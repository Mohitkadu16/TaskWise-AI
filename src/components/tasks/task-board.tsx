'use client';
import { useState, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { TaskColumn } from './task-column';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { TaskForm } from './task-form';
import { deleteTask } from '@/lib/tasks';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface TaskBoardProps {
  initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const columns: Task['status'][] = ['To Do', 'In Progress', 'Done'];
  
  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<Task['status'], Task[]>);
  }, [tasks]);

  const handleOpenCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingTaskId) return;
    const result = await deleteTask(deletingTaskId);
    if(result.success) {
        setTasks(prev => prev.filter(t => t.id !== deletingTaskId));
        toast({ title: "Task deleted successfully" });
    } else {
        toast({ variant: 'destructive', title: "Failed to delete task" });
    }
    setDeletingTaskId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
        {columns.map((status) => (
          <TaskColumn
            key={status}
            title={status}
            tasks={tasksByStatus[status]}
            onEditTask={handleOpenEditModal}
            onDeleteTask={setDeletingTaskId}
          />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create a new task'}</DialogTitle>
          </DialogHeader>
          <TaskForm task={editingTask} onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingTaskId} onOpenChange={(open) => !open && setDeletingTaskId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingTaskId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
