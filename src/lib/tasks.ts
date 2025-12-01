import type { Task, Assignee } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getAvatar = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const assignees: Assignee[] = [
  { name: 'Alice', email: 'alice@example.com', avatar: getAvatar('avatar-alice') },
  { name: 'Bob', email: 'bob@example.com', avatar: getAvatar('avatar-bob') },
  { name: 'Charlie', email: 'charlie@example.com', avatar: getAvatar('avatar-charlie') },
  { name: 'David', email: 'david@example.com', avatar: getAvatar('avatar-david') },
  { name: 'Eva', email: 'eva@example.com', avatar: getAvatar('avatar-eva') },
];

let tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design login page UI',
    description: 'Create a clean and modern UI for the login page, including email and password fields, and a submit button. Ensure it is responsive.',
    status: 'Done',
    priority: 'High',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    assignee: assignees[0],
  },
  {
    id: 'task-2',
    title: 'Develop task board component',
    description: 'Build the main task board with columns for different statuses. Task cards should be draggable in a future update.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    assignee: assignees[1],
  },
  {
    id: 'task-3',
    title: 'Implement "Add Task" modal',
    description: 'Create a modal form for adding new tasks with fields for title, description, status, assignee, priority, and due date.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    assignee: assignees[2],
  },
  {
    id: 'task-4',
    title: 'Set up placeholder API services',
    description: 'Create placeholder functions for authentication and task management to be integrated with Supabase later.',
    status: 'Done',
    priority: 'Medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    assignee: assignees[0],
  },
  {
    id: 'task-5',
    title: 'Integrate AI evaluation page',
    description: 'Connect the AI evaluation UI to the Genkit flow to get scores and suggestions for task descriptions.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    assignee: assignees[3],
  },
  {
    id: 'task-6',
    title: 'Create user profile page',
    description: 'Build the user profile page to display user information and provide a logout option.',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    assignee: assignees[4],
  },
  {
    id: 'task-7',
    title: 'Refine color scheme and typography',
    description: 'Adjust the global CSS to match the requested soft color palette and ensure font consistency.',
    status: 'Done',
    priority: 'Low',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    assignee: assignees[1],
  },
  {
    id: 'task-8',
    title: 'Write documentation for components',
    description: 'Add comments and documentation for all major components to facilitate future development and maintenance.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
    assignee: assignees[2],
  },
];

export async function getTasks(): Promise<Task[]> {
  console.log('Fetching all tasks...');
  // In a real app, this would be a database call.
  return Promise.resolve(tasks);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
    console.log(`Fetching task with id: ${id}`);
    return Promise.resolve(tasks.find(task => task.id === id));
}

export async function updateTask(id: string, updatedData: Partial<Task>): Promise<Task | undefined> {
    console.log(`Updating task with id: ${id}`);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
        return Promise.resolve(tasks[taskIndex]);
    }
    return Promise.resolve(undefined);
}

export async function addTask(newTaskData: Omit<Task, 'id'>): Promise<Task> {
    console.log('Adding new task...');
    const newTask: Task = {
        id: `task-${Date.now()}`,
        ...newTaskData,
    };
    tasks.unshift(newTask);
    return Promise.resolve(newTask);
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
    console.log(`Deleting task with id: ${id}`);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return Promise.resolve({ success: tasks.length < initialLength });
}
