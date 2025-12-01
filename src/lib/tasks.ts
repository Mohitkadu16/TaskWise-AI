import { createClient } from './supabase/server';
import { getCurrentUser } from './auth';
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

/**
 * Get all tasks for the current user from Supabase
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error.message);
      throw new Error(error.message);
    }

    // Transform database records to Task format with assignee info
    const tasks = [] as any[];
    for (const task of (data || [])) {
      let assignee = { name: 'Unassigned', email: '', avatar: getAvatar('avatar-default') };
      if (task.assignee_id) {
        try {
          const { data: userRow } = await supabase.from('users').select('id,email,full_name,avatar_url').eq('id', task.assignee_id).single();
          if (userRow) {
            assignee = { name: userRow.full_name || userRow.email, email: userRow.email || '', avatar: userRow.avatar_url || getAvatar('avatar-default') };
          }
        } catch (e) {
          // ignore and leave default assignee
        }
      }
      tasks.push({
        ...task,
        dueDate: task.due_date || new Date().toISOString().split('T')[0],
        assignee,
      });
    }

    return tasks;
  } catch (error) {
    console.error('getTasks error:', error);
    return [];
  }
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('No authenticated user found');
      return undefined;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching task:', error.message);
      return undefined;
    }

    if (!data) return undefined;

    // Transform to Task format
    let assignee = { name: 'Unassigned', email: '', avatar: getAvatar('avatar-default') };
    if (data.assignee_id) {
      try {
        const { data: userRow } = await supabase.from('users').select('id,email,full_name,avatar_url').eq('id', data.assignee_id).single();
        if (userRow) {
          assignee = { name: userRow.full_name || userRow.email, email: userRow.email || '', avatar: userRow.avatar_url || getAvatar('avatar-default') };
        }
      } catch (e) {
        // ignore
      }
    }

    return {
      ...data,
      dueDate: data.due_date || new Date().toISOString().split('T')[0],
      assignee,
    };
  } catch (error) {
    console.error('getTaskById error:', error);
    return undefined;
  }
}

export async function updateTask(id: string, updatedData: Partial<Task>): Promise<Task | undefined> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const supabase = await createClient();

    const updatePayload: any = {};
    
    if (updatedData.title) updatePayload.title = updatedData.title;
    if (updatedData.description) updatePayload.description = updatedData.description;
    if (updatedData.status) updatePayload.status = updatedData.status;
    if (updatedData.priority) updatePayload.priority = updatedData.priority;
    if (updatedData.dueDate) updatePayload.due_date = updatedData.dueDate;
    if (updatedData.assignee && updatedData.assignee.email) {
      // try to resolve assignee email -> id
      try {
        const { data: userRow } = await supabase.from('users').select('id').eq('email', updatedData.assignee.email).single();
        if (userRow?.id) updatePayload.assignee_id = userRow.id;
      } catch (e) {
        // ignore if not found
      }
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error.message);
      throw new Error(error.message);
    }

    if (!data) return undefined;

    // build assignee info from assignee_id
    let assignee = { name: 'Unassigned', email: '', avatar: getAvatar('avatar-default') };
    if (data.assignee_id) {
      try {
        const { data: userRow } = await supabase.from('users').select('id,email,full_name,avatar_url').eq('id', data.assignee_id).single();
        if (userRow) assignee = { name: userRow.full_name || userRow.email, email: userRow.email || '', avatar: userRow.avatar_url || getAvatar('avatar-default') };
      } catch (e) {
        // ignore
      }
    }

    return {
      ...data,
      dueDate: data.due_date,
      assignee,
    };
  } catch (error) {
    console.error('updateTask error:', error);
    throw error;
  }
}

export async function addTask(newTaskData: Omit<Task, 'id'>): Promise<Task> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: newTaskData.title,
          description: newTaskData.description,
          status: newTaskData.status,
          priority: newTaskData.priority,
          due_date: newTaskData.dueDate,
          assignee_id: null,
          // try to resolve assignee email to id if provided
          // (we'll attempt below after creating supabase client)
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error.message);
      throw new Error(error.message);
    }

    if (!data) throw new Error('Failed to create task');

    // If client provided assignee email, try to update assignee_id
    if (newTaskData.assignee?.email) {
      try {
        const { data: userRow } = await supabase.from('users').select('id').eq('email', newTaskData.assignee.email).single();
        if (userRow?.id) {
          const { error: updateError } = await supabase.from('tasks').update({ assignee_id: userRow.id }).eq('id', data.id);
          if (updateError) console.warn('Failed to set assignee_id after insert', updateError.message);
        }
      } catch (e) {
        // ignore
      }
    }

    // return created task with transformed assignee
    let assignee = { name: 'Unassigned', email: '', avatar: getAvatar('avatar-default') };
    if (data.assignee_id) {
      try {
        const { data: userRow } = await supabase.from('users').select('id,email,full_name,avatar_url').eq('id', data.assignee_id).single();
        if (userRow) assignee = { name: userRow.full_name || userRow.email, email: userRow.email || '', avatar: userRow.avatar_url || getAvatar('avatar-default') };
      } catch (e) {}
    }

    return {
      ...data,
      dueDate: data.due_date,
      assignee,
    };
  } catch (error) {
    console.error('addTask error:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error.message);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('deleteTask error:', error);
    return { success: false };
  }
}
