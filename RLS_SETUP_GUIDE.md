# 📍 Visual Guide: Where to Add RLS Policies

## Step-by-Step Screenshots (Text Version)

### Step 1: Open Supabase Dashboard
```
Go to: https://supabase.com
Login → Your Project
```

### Step 2: Click SQL Editor
```
Left Sidebar:
├── Home
├── Databases
├── SQL Editor ← CLICK HERE
├── Auth
├── Storage
└── ...
```

### Step 3: Click "New Query" Button
```
Top Right Area:

┌─────────────────────────────────┐
│  SQL Editor                     │
│                                 │
│  [New Query] [Open] [Examples]  │
│     ↑ CLICK THIS               │
│                                 │
└─────────────────────────────────┘
```

### Step 4: Paste SQL Code
```
You'll see a blank editor:

┌────────────────────────────────────────┐
│ -- Write your SQL here                │
│                                        │
│  [Click here and paste SQL]            │
│                                        │
│  [Run] button at bottom               │
└────────────────────────────────────────┘
```

### Step 5: Copy & Paste SQL
```
For Users Table:
1. Copy the entire SQL block from below
2. Paste into the editor
3. Click "Run" button
4. You'll see: "Success!"
```

### Step 6: Repeat for Other Tables
```
Do the same for:
- Tasks table
- Payments table
```

---

## 🔑 SQL Blocks to Run (In Order)

### Block 1️⃣ : Users Table RLS

**Copy everything below and paste into a new query, then click Run:**

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

**After pasting, click the blue "Run" button**

Expected result: `Success! Executed queries`

---

### Block 2️⃣ : Tasks Table RLS

**Create NEW Query, copy and paste:**

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can see only their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can create tasks
CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

**Click Run**

---

### Block 3️⃣ : Payments Table RLS

**Create NEW Query, copy and paste:**

```sql
-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can see only their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can create payments
CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own payments
CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);
```

**Click Run**

---

## ✅ Verify It Worked

### Method 1: Check in Dashboard

1. Go to **Databases** (left sidebar)
2. Click on each table name
3. You should see a "🔒 RLS enabled" indicator

### Method 2: Run a Query

In SQL Editor, create a new query and run:

```sql
-- This shows all RLS policies
SELECT * FROM pg_policies 
WHERE tablename IN ('users', 'tasks', 'payments');
```

You should see multiple rows with your policy names.

---

## 📝 Quick Checklist

- [ ] Open SQL Editor
- [ ] Create new query for Users table
- [ ] Copy & paste Block 1️⃣ 
- [ ] Click Run
- [ ] See "Success!"
- [ ] Create new query for Tasks table
- [ ] Copy & paste Block 2️⃣
- [ ] Click Run
- [ ] See "Success!"
- [ ] Create new query for Payments table
- [ ] Copy & paste Block 3️⃣
- [ ] Click Run
- [ ] See "Success!"
- [ ] Verify: Check all tables have 🔒 indicator

---

## 🎊 Done!

After all 3 blocks run successfully:

✅ Your database is now secure
✅ RLS is enabled on all tables
✅ Users can only see their own data
✅ Your app will work perfectly!

---

## 🚨 If Something Goes Wrong

### Error: "table ... already exists"
→ This means the table already exists, that's OK. The RLS policies will be created.

### Error: "policy already exists"
→ This means the policy is already there. That's fine, it means RLS is already set up!

### Error: Something else
→ Copy the full error message
→ Try running just the first line: `ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;`
→ Then run the policies one at a time

---

## 💡 What RLS Does

```
Without RLS:
User A → Can see User B's tasks ❌ BAD!

With RLS:
User A → Can only see User A's tasks ✅ GOOD!
User B → Can only see User B's tasks ✅ GOOD!
```

RLS automatically filters data based on who's logged in.

---

## 🎯 Next Steps After RLS

1. ✅ Create a test user in Supabase
2. ✅ Create `.env.local` file
3. ✅ Test your app login
4. ✅ Test creating tasks

All covered in the other guides!
