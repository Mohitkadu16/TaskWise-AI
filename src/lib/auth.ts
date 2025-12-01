'use server';
import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

export async function handleLogin(data: FormData) {
  try {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      // More helpful error messages
      if (error.message.includes('Invalid login')) {
        throw new Error('Invalid email or password. Make sure the test user exists in Supabase.');
      }
      throw new Error(error.message);
    }

    redirect('/dashboard');
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function handleLogout() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    throw new Error(error.message);
  }

  redirect('/login');
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
