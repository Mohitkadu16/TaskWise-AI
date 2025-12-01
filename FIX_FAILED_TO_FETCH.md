# 🔧 Fix "Failed to Fetch" Error

## What Happened?

When you tried to log in, the error `Failed to fetch` appeared. This means:

**Your Supabase credentials are correct ✅**  
**But the test user doesn't exist or couldn't be found ❌**

---

## 🎯 3-Step Fix

### Step 1: Create Test User in Supabase (2 minutes)

1. Go to your Supabase dashboard: https://supabase.com
2. Click **Authentication** (left sidebar)
3. Click **Users** tab
4. Click **"Add user"** button (top right)
5. Fill in:
   - **Email:** `team@example.com`
   - **Password:** `password`
6. Click **"Create user"**

**You should see a success message!**

---

### Step 2: Create User Profile in Database (1 minute)

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Copy and paste this:

```sql
INSERT INTO users (id, email, full_name)
SELECT id, email, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

4. Click **"Run"**

**You should see: "Success. 1 rows affected"**

---

### Step 3: Restart Your App & Test (2 minutes)

1. **Stop the dev server** (Press Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```
3. **Open in browser:** `http://localhost:9002/login`
4. **Log in with:**
   - Email: `team@example.com`
   - Password: `password`
5. **Click "Login"**

**You should see the dashboard! 🎉**

---

## ✅ Checklist

- [ ] Test user `team@example.com` created in Supabase
- [ ] User profile inserted into `users` table
- [ ] Dev server restarted
- [ ] Can access `/login` page
- [ ] Can log in successfully
- [ ] Redirected to `/dashboard`

---

## If It Still Doesn't Work

### Check 1: User exists in Supabase?
Go to **Authentication > Users** and verify `team@example.com` is listed.

### Check 2: User profile exists in database?
In SQL Editor, run:
```sql
SELECT * FROM users;
```
You should see at least one row with `team@example.com`.

### Check 3: Passwords match?
Make sure you used exactly:
- Email: `team@example.com`
- Password: `password`

### Check 4: Clear browser cache?
Try:
1. Open browser DevTools (F12)
2. Right-click refresh button → "Empty cache and hard refresh"
3. Try logging in again

---

## 🚀 After Login Works

Once you can log in successfully, you're done! 

Your app now has:
- ✅ Working authentication
- ✅ Supabase backend
- ✅ Secure database
- ✅ User profiles
- ✅ Ready to build features!

Next steps:
- Update dashboard to show real tasks
- Add task creation
- Add user profile page
- Build payment features
