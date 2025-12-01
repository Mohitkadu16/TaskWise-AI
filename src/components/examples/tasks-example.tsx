'use client';

import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/database';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * EXAMPLE COMPONENT showing how to use Supabase database functions
 * 
 * This component demonstrates:
 * - Fetching tasks from the database
 * - Creating new tasks
 * - Updating existing tasks
 * - Deleting tasks
 * 
 * Copy this pattern to your actual components
 */

export function TasksExample() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask() {
    try {
      const newTask = await createTask({
        title: 'New Task',
        description: 'Task description',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2025-12-20',
        // assignee is optional
      });
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  async function handleUpdateTask(taskId: string) {
    try {
      const updated = await updateTask(taskId, {
        status: 'Done',
      });
      setTasks(tasks.map(t => (t.id === taskId ? updated : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateTask}>Add Task</Button>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                onClick={() => handleUpdateTask(task.id)}
              >
                Mark Done
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
