# Supabase Integration Architecture

## Project Structure

```
TaskWise-AI/
├── src/
│   ├── lib/
│   │   ├── supabaseClient.ts          ← Browser Supabase client
│   │   ├── supabase/
│   │   │   └── server.ts              ← Server Supabase client
│   │   ├── auth.ts                    ← Login/Logout (Supabase Auth)
│   │   ├── database.ts                ← Database operations
│   │   ├── tasks.ts                   ← (Keep for backward compatibility)
│   │   └── types.ts                   ← TypeScript types
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx           ← Uses handleLogin from auth.ts
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── payments/
│   │   │   └── ai-evaluation/
│   │   └── layout.tsx
│   ├── middleware.ts                  ← Route protection
│   └── components/
│       └── examples/
│           └── tasks-example.tsx      ← Example usage
├── .env.local                         ← Your Supabase credentials
├── SUPABASE_SETUP.md                  ← Detailed setup guide
├── QUICKSTART.md                      ← Quick reference
└── ARCHITECTURE.md                    ← This file
```

---

## Data Flow Diagram

### Authentication Flow
```
Login Form (Browser)
    ↓
[handleLogin] (Server Action)
    ↓
[Supabase Auth Client] (Server)
    ↓
Supabase Auth Service
    ↓
Session stored in cookies
    ↓
Redirect to /dashboard
```

### Database Operations Flow
```
Component (Client)
    ↓
Server Action (e.g., getTasks)
    ↓
[Supabase Server Client] with auth cookie
    ↓
Supabase Database
    ↓
RLS Policy check (user_id == auth.uid())
    ↓
Return only user's data
    ↓
Back to Component
```

### Protected Route Flow
```
Request to protected route (e.g., /dashboard)
    ↓
[middleware.ts] checks session
    ↓
Session valid? YES → Allow access
              NO → Redirect to /login
```

---

## Supabase Tables

### 1. users
```sql
id                UUID (from auth.users)
email             VARCHAR
full_name         VARCHAR
avatar_url        TEXT
created_at        TIMESTAMP
updated_at        TIMESTAMP

RLS Policies:
- Users can only read/write their own profile
```

### 2. tasks
```sql
id                UUID (auto-generated)
user_id           UUID (foreign key to auth.users)
title             VARCHAR
description       TEXT
status            VARCHAR ('To Do', 'In Progress', 'Done')
priority          VARCHAR ('Low', 'Medium', 'High')
due_date          DATE
assignee_id       UUID (optional, foreign key to auth.users)
created_at        TIMESTAMP
updated_at        TIMESTAMP

RLS Policies:
- Users can only see/manage tasks where user_id = auth.uid()
```

### 3. payments
```sql
id                UUID (auto-generated)
user_id           UUID (foreign key to auth.users)
amount            DECIMAL
status            VARCHAR ('pending', 'completed', 'failed')
description       TEXT
created_at        TIMESTAMP
updated_at        TIMESTAMP

RLS Policies:
- Users can only see/manage their own payments
```

---

## Function Reference

### Authentication (`lib/auth.ts`)
```typescript
// Login user with email/password
async handleLogin(data: FormData)

// Logout user
async handleLogout()

// Get current authenticated user
async getCurrentUser()
```

### Tasks (`lib/database.ts`)
```typescript
// Get all tasks for current user
async getTasks()

// Create new task
async createTask(task: TaskInput)

// Update existing task
async updateTask(id: string, updates: Partial<Task>)

// Delete task
async deleteTask(id: string)
```

### User Profile (`lib/database.ts`)
```typescript
// Get current user's profile
async getUserProfile()

// Update user profile
async updateUserProfile(updates: ProfileUpdate)
```

### Payments (`lib/database.ts`)
```typescript
// Get all payments for current user
async getPayments()

// Create payment record
async createPayment(paymentData: PaymentInput)
```

---

## Environment Variables

```env
# In .env.local (never commit this!)

# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Public Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Users can only access their own data
- ✅ Protected routes via middleware
- ✅ Session stored in httpOnly cookies
- ✅ Environment variables not exposed
- ✅ Server actions validate user authentication

---

## Common Patterns

### Getting User Data in a Server Component
```typescript
import { getCurrentUser } from '@/lib/auth';
import { getTasks } from '@/lib/database';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Not authenticated</div>;
  
  const tasks = await getTasks();
  return <div>{tasks.length} tasks</div>;
}
```

### Creating Data in a Server Action
```typescript
'use server'
import { createTask } from '@/lib/database';

export async function addTask(formData: FormData) {
  const task = await createTask({
    title: formData.get('title'),
    description: formData.get('description'),
    status: 'To Do',
    priority: 'Medium',
  });
  return task;
}
```

### Using in Client Component
```typescript
'use client'
import { useState } from 'react';
import { addTask } from './actions';

export function TaskForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await addTask(formData);
      // Success
    } finally {
      setLoading(false);
    }
  }

  return <form action={handleSubmit}>...</form>;
}
```

---

## Next Steps

1. **Add real data** - Replace test data with database queries
2. **Implement Realtime** - Add live updates for tasks
3. **File Storage** - Store user avatars in Supabase Storage
4. **Email Templates** - Set up custom email confirmations
5. **Webhooks** - Trigger actions on events (payment status, etc.)

---

## Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check auth cookie, user may be logged out |
| RLS denies access | Verify user_id matches auth.uid() in database |
| Environment variables undefined | Check .env.local exists and is loaded |
| Cannot find Supabase | Check node_modules, run npm install |
| Session lost on refresh | Middleware handles this automatically |

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Authentication Best Practices](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
