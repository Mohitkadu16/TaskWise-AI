# ✅ Complete Remaining Steps (3 & 4)

## Status So Far
- ✅ Step 1: Tables created
- ✅ Step 2: RLS policies added
- ⏳ Step 3: Create test user
- ⏳ Step 4: Create `.env.local`
- ⏳ Step 5: Test login
- ⏳ Step 6: Test creating tasks

---

## 📝 Step 3: Create Test User in Supabase

### Where to Go:
1. Open your Supabase project dashboard
2. Click **Authentication** (left sidebar)
3. Click **Users** 

```
Supabase Dashboard
├── Home
├── Database
├── SQL Editor
├── Authentication ← CLICK HERE
│   └── Users ← THEN CLICK HERE
├── Storage
└── ...
```

### What to Do:

1. Click **"Add user"** button (top right)

```
┌─────────────────────────────────────┐
│  Users                              │
│  [Add user] button (top right)      │
│                                     │
│  Search users...                    │
│  [List of users]                    │
└─────────────────────────────────────┘
```

2. A popup will appear:

```
┌──────────────────────────────────────┐
│  Add User                            │
│                                      │
│  Email: [_________________]          │
│  Password: [_________________]       │
│  Confirm Password: [_________________]│
│                                      │
│  [Create user] button               │
└──────────────────────────────────────┘
```

3. **Enter these details:**
   - Email: `team@example.com`
   - Password: `password`
   - Confirm Password: `password`

4. **Click "Create user"**

5. **You'll see:** A success message or the user appears in the list

### ✅ Done!
You now have a test user you can log in with!

---

## 📝 Step 4: Create `.env.local` File

### What is `.env.local`?
It's a file that stores your Supabase credentials (secret info). It tells your app how to connect to Supabase.

### Where to Create It:

In your project folder `TaskWise-AI`, create a new file named `.env.local`

```
TaskWise-AI/
├── src/
├── public/
├── package.json
├── tsconfig.json
├── .env.local ← CREATE THIS FILE HERE
└── ...
```

### How to Create It:

#### Option A: Using VS Code (Easiest)

1. Open VS Code
2. Open your `TaskWise-AI` folder
3. Right-click in the explorer (left sidebar) → "New File"
4. Name it: `.env.local`
5. Paste this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sykvxfihafzmznhmvbgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5a3Z4ZmloYWZ6bXpuaG12YmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDA2MTQsImV4cCI6MjA4MDE3NjYxNH0.MAOfP0vWhz7YhiSSO0F-QM_1bZJjL4MbJXLNWsK3z1c
```

6. **Save the file** (Ctrl+S)

#### Option B: Using Terminal

```bash
cd "c:\Users\mohit\My folder\Coding\TaskWise-AI"

# On Windows PowerShell:
@"
NEXT_PUBLIC_SUPABASE_URL=https://sykvxfihafzmznhmvbgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5a3Z4ZmloYWZ6bXpuaG12YmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDA2MTQsImV4cCI6MjA4MDE3NjYxNH0.MAOfP0vWhz7YhiSSO0F-QM_1bZJjL4MbJXLNWsK3z1c
"@ | Out-File -Encoding UTF8 .env.local
```

### ✅ Done!
Your app now knows how to connect to Supabase!

---

## 📝 Step 5: Test Your App Login

### Before Testing:

Make sure you have:
- ✅ Tables created in Supabase
- ✅ RLS policies added
- ✅ Test user created (`team@example.com` / `password`)
- ✅ `.env.local` file created with credentials

### How to Test:

1. **Open terminal** in VS Code
2. **Run this command:**

```bash
npm run dev
```

3. **Wait** for it to start (you'll see messages)

4. **Open your browser** and go to:
```
http://localhost:9002/login
```

You should see a login page:

```
┌─────────────────────────────────┐
│                                 │
│    Welcome Back                 │
│                                 │
│  Email: [team@example.com    ]  │
│  Password: [password         ]  │
│                                 │
│  [Login] button                 │
│                                 │
└─────────────────────────────────┘
```

5. **Enter these details:**
   - Email: `team@example.com`
   - Password: `password`

6. **Click "Login"**

7. **What should happen:**
   - ✅ Loading spinner appears
   - ✅ You're redirected to `/dashboard`
   - ✅ You see the dashboard page
   - ✅ No error messages

### If It Works:
🎉 **Your authentication is working!**

### If It Doesn't Work:

**Error: "Cannot find module '@supabase/supabase-js'"**
→ Run: `npm install`

**Error: "NEXT_PUBLIC_SUPABASE_URL is not set"**
→ Check your `.env.local` file exists and has the right values

**Error: "Invalid user credentials"**
→ Check you created the test user correctly in Supabase

**Error: "User not found in users table"**
→ This is OK! You need to create the user profile (see Step 6 below)

---

## 📝 Step 6: Test Creating Tasks

After you've successfully logged in, you can test creating tasks:

1. **You should be on the dashboard page** (`/dashboard`)
2. **Look for a "Create Task" button or form**
3. **Click it and fill in:**
   - Title: `Test Task`
   - Description: `My first task`
   - Status: `To Do`
   - Priority: `High`

4. **Click "Create"**

5. **Check if:**
   - ✅ Task appears in the list
   - ✅ No error messages
   - ✅ Task is saved in database

---

## 🔍 Troubleshooting Quick Guide

### Issue: Login page shows but login fails
**Solution:** 
- Check `.env.local` file has correct URLs
- Check test user exists in Supabase
- Check browser console for errors (F12)

### Issue: "User doesn't exist in users table"
**Solution:**
In Supabase SQL Editor, run:
```sql
INSERT INTO users (id, email, full_name)
SELECT id, email, email FROM auth.users;
```

### Issue: Tasks not appearing
**Solution:**
- Check RLS policies are enabled
- Check you're logged in as the right user
- Check tasks were created in the database (go to Supabase → Databases → tasks table)

### Issue: Page keeps redirecting to login
**Solution:**
- Your session might have expired
- Try logging in again
- Check browser cookies are enabled

---

## ✅ Final Checklist

- [ ] Test user created (`team@example.com` / `password`)
- [ ] `.env.local` file created with credentials
- [ ] Can run `npm run dev` without errors
- [ ] Can access `/login` page
- [ ] Can log in successfully
- [ ] Redirected to `/dashboard`
- [ ] Can create a task
- [ ] Task appears in the list

---

## 🎉 When You've Done All This

You'll have:
✅ Supabase backend ready
✅ Authentication working
✅ Database secure with RLS
✅ Test user created
✅ App configured
✅ Everything tested

### Next Steps:

You can now:
1. Update your dashboard to use real database data
2. Add more features
3. Create more users
4. Deploy to production

---

## 💡 Quick Summary

| Step | What | Status |
|------|------|--------|
| 1 | Create tables | ✅ DONE |
| 2 | Add RLS policies | ✅ DONE |
| 3 | Create test user | ⏳ DO NOW |
| 4 | Create `.env.local` | ⏳ DO NOW |
| 5 | Test login | ⏳ DO AFTER |
| 6 | Test task creation | ⏳ DO AFTER |

---

**You're almost there!** Just a few more quick steps and you're live! 🚀
