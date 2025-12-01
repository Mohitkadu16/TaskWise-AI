# TaskWise-AI Supabase Integration - Quick Start

## 🚀 Installation Complete!

Your project now has Supabase integrated! Here's what was set up:

### ✅ Installed Packages
- `@supabase/supabase-js` - JavaScript/TypeScript client
- `@supabase/ssr` - Server-side rendering support

### ✅ Created Files
1. **`src/lib/supabaseClient.ts`** - Browser client
2. **`src/lib/supabase/server.ts`** - Server client
3. **`src/lib/auth.ts`** - Authentication functions (updated)
4. **`src/lib/database.ts`** - Database operations
5. **`src/middleware.ts`** - Route protection
6. **`.env.example`** - Environment variables template
7. **`SUPABASE_SETUP.md`** - Detailed setup guide

---

## 🔐 Next Steps (5 minutes)

### 1. Create Supabase Account & Project
```
1. Go to https://supabase.com
2. Sign up (free tier is perfect)
3. Create new project
4. Wait 2-3 minutes for it to be ready
```

### 2. Get Your Credentials
```
1. Go to Settings > API
2. Copy Project URL → NEXT_PUBLIC_SUPABASE_URL
3. Copy anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Create `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database
Copy the SQL from `SUPABASE_SETUP.md` and run in Supabase SQL Editor.

### 5. Create Test User
1. Go to Authentication > Users
2. Click "Add user"
3. Email: `team@example.com`
4. Password: `password`

---

## 📊 Database Schema

```
┌─────────────────┐
│  auth.users     │
│  (Supabase)     │
└────────┬────────┘
         │
         ├──→ users (profile)
         ├──→ tasks (owned tasks)
         └──→ payments (transactions)
```

### Tables Created:
- **users** - User profiles
- **tasks** - Task management
- **payments** - Payment tracking

### RLS (Row Level Security):
✅ Users can only access their own data
✅ No manual permission checks needed

---

## 💻 Using in Your Code

### Server Actions (Next.js)

```typescript
import { getTasks, createTask, updateTask } from '@/lib/database';

// Get user's tasks
const tasks = await getTasks();

// Create task
const newTask = await createTask({
  title: 'My Task',
  description: 'Do something',
  status: 'To Do',
  priority: 'High',
  dueDate: '2025-12-20'
});

// Update task
await updateTask(taskId, { status: 'Done' });

// Delete task
await deleteTask(taskId);
```

### Authentication

```typescript
import { getCurrentUser, handleLogin, handleLogout } from '@/lib/auth';

// Get current user
const user = await getCurrentUser();

// Login (automatically handled in form)
// Logout (automatically handled)
```

### User Profile

```typescript
import { getUserProfile, updateUserProfile } from '@/lib/database';

// Get profile
const profile = await getUserProfile();

// Update profile
await updateUserProfile({
  full_name: 'John Doe',
  avatar_url: 'https://...'
});
```

### Payments

```typescript
import { getPayments, createPayment } from '@/lib/database';

// Get payments
const payments = await getPayments();

// Create payment
const payment = await createPayment({
  amount: 99.99,
  status: 'pending',
  description: 'Monthly subscription'
});
```

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled:
- Users can only see their own data
- No direct SQL injection possible
- All queries automatically filtered by user ID

### Authentication
- Email/password authentication
- Secure session management
- Automatic session refresh
- Protected routes via middleware

---

## 🛠️ Troubleshooting

**Q: "Missing Supabase environment variables"**
A: Create `.env.local` with your credentials

**Q: "Not authenticated" error**
A: Make sure user is logged in before calling database functions

**Q: Login not working**
A: Check that test user exists in Supabase

**Q: RLS denies access**
A: Verify user_id matches authenticated user ID in database

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 You're Ready!

Your app now has:
- ✅ Secure email authentication
- ✅ Database with RLS
- ✅ Protected routes
- ✅ User profiles
- ✅ Task management
- ✅ Payment tracking

Start building! 🚀
