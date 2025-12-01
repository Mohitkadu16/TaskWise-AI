'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date(),
  assigneeEmail: z.string().email(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const defaultValues: Partial<TaskFormValues> = task
    ? {
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status ?? 'To Do',
        priority: task.priority ?? 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        assigneeEmail: task.assignee?.email ?? '',
      }
    : {
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(),
        assigneeEmail: '',
      };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const getAvatar = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

  const ASSIGNEES = [
    { name: 'Alice', email: 'alice@example.com', avatar: getAvatar('avatar-alice') },
    { name: 'Bob', email: 'bob@example.com', avatar: getAvatar('avatar-bob') },
    { name: 'Charlie', email: 'charlie@example.com', avatar: getAvatar('avatar-charlie') },
    { name: 'David', email: 'david@example.com', avatar: getAvatar('avatar-david') },
    { name: 'Eva', email: 'eva@example.com', avatar: getAvatar('avatar-eva') },
  ];

  async function onSubmit(data: TaskFormValues) {
    const assignee = ASSIGNEES.find((a) => a.email === data.assigneeEmail);
    if (!assignee) {
      toast({
        variant: 'destructive',
        title: 'Invalid Assignee',
        description: 'Please select a valid assignee.',
      });
      return;
    }

    const taskData = {
      ...data,
      dueDate: data.dueDate.toISOString().split('T')[0],
      assignee,
    };
    
    try {
      if (task) {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            assignee: taskData.assignee,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Failed to update task');
        }
        toast({ title: 'Task Updated', description: `"${data.title}" has been successfully updated.` });
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            assignee: taskData.assignee,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Failed to create task');
        }
        toast({ title: 'Task Created', description: `"${data.title}" has been successfully created.` });
      }
      onClose();
      router.refresh();
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error?.message || 'Could not save the task. Please try again.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Implement user authentication" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a more detailed description..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigneeEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ASSIGNEES.map((assignee) => (
                      <SelectItem key={assignee.email} value={assignee.email}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className='mb-1.5'>Due Date</FormLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Form>
  );
}
