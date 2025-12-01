# Supabase Setup Guide for TaskWise-AI

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - Name: `TaskWise-AI` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose closest to you
4. Wait for project to be created

## Step 2: Get Your Credentials

1. Go to **Settings > API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Create Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Create Database Tables

Go to **SQL Editor** in Supabase and run these SQL commands:

### Create Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Todo',
  priority VARCHAR(50) DEFAULT 'Medium',
  due_date DATE,
  assignee_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can only see tasks they created
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

### Create Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);
```

## Step 5: Create Test Users

1. Go to **Authentication > Users** in Supabase
2. Click "Add user"
3. Create test user:
   - Email: `team@example.com`
   - Password: `password`
4. Create another test user for testing multi-user features

## Step 6: Insert User Profiles

Go to **SQL Editor** and run:

```sql
INSERT INTO users (id, email, full_name)
SELECT id, email, email FROM auth.users;
```

## Step 7: Test Your Setup

Now your app is ready to use! The auth flow will:

1. User logs in with email/password
2. Supabase authenticates and returns session
3. Session is stored in cookies
4. All database queries include RLS checks
5. Users can only access their own data

## Features Implemented

✅ **Auth** - Email login with Supabase Auth
✅ **Database** - Tasks, Users, Payments tables
✅ **RLS** - Row Level Security policies enabled
✅ **API** - Server actions in `/src/lib/database.ts`

## Usage Examples

### In Server Components or Server Actions:

```typescript
import { getTasks, createTask } from '@/lib/database';

// Get user's tasks
const tasks = await getTasks();

// Create a new task
const newTask = await createTask({
  title: 'New Task',
  description: 'Task description',
  status: 'Todo',
  priority: 'High',
  dueDate: '2025-12-20'
});

// Update a task
const updated = await updateTask(taskId, {
  status: 'Done'
});

// Get user profile
const profile = await getUserProfile();
```

## Troubleshooting

- **"Missing Supabase environment variables"**: Check your `.env.local` file
- **"Not authenticated"**: Make sure user is logged in before calling database functions
- **RLS denies access**: Check that user_id matches authenticated user's ID

## Next Steps

1. Update your UI components to use the new database functions
2. Add more complex queries as needed
3. Consider adding Realtime subscriptions for live updates
4. Implement file storage for avatars if needed
