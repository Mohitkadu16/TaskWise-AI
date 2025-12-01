import { createClient } from './supabase/server';
import { getCurrentUser } from './auth';
import type { Task, Assignee } from './types';

// TASKS OPERATIONS
export async function getTasks() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createTask(task: Partial<Task> & {
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignee?: Assignee;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        ...task,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTask(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}

// USER OPERATIONS
export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserProfile(updates: {
  full_name?: string;
  avatar_url?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// PAYMENTS OPERATIONS
export async function getPayments() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createPayment(paymentData: {
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        ...paymentData,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
