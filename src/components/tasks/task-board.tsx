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
    try {
      const res = await fetch(`/api/tasks/${deletingTaskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks(prev => prev.filter(t => t.id !== deletingTaskId));
      toast({ title: 'Task deleted successfully' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to delete task' });
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

      <div className="flex flex-col md:flex-row md:items-stretch justify-center gap-4 md:gap-6 lg:gap-8 pb-4">
        {columns.map((status) => (
          <div key={status} className="w-full md:w-1/3">
            <TaskColumn
              title={status}
              tasks={tasksByStatus[status]}
              onEditTask={handleOpenEditModal}
              onDeleteTask={setDeletingTaskId}
            />
          </div>
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

      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">Are you absolutely sure?</h3>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone. This will permanently delete the task.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingTaskId(null)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm}>Continue</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
