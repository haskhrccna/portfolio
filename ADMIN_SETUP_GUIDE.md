# Admin User Setup Guide

Your portfolio **doesn't have hardcoded credentials**. The admin system uses Supabase Authentication, which is more secure. You need to create an admin user in your Supabase project.

## 📋 Prerequisites

- Supabase project created and active
- `DATABASE_SETUP.sql` already executed
- Supabase credentials updated in your code

---

## 🚀 Step-by-Step Setup (10 minutes)

### Step 1: Run Admin Setup SQL (2 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `ADMIN_SETUP.sql`
5. Paste into the SQL editor
6. Click **Run** (or Ctrl+Enter)
7. You should see "Success. No rows returned" ✅

This creates:
- `admin_profiles` table
- `admin_settings` table
- `is_admin()` RPC function
- All necessary RLS policies

---

### Step 2: Create Your Admin User (3 minutes)

1. In Supabase dashboard, go to **Authentication** → **Users** (left sidebar)
2. Click **Add user** button (top right)
3. Click **Create new user**
4. Fill in the form:
   - **Email**: Your email (e.g., `admin@yourdomain.com`)
   - **Password**: A strong password (e.g., `Admin123!Secure`)
   - **Auto Confirm User**: ✅ Check this box (important!)
5. Click **Create user**
6. **Copy the User UID** - you'll see it in the users list (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

### Step 3: Make the User an Admin (2 minutes)

1. Go back to **SQL Editor**
2. Create a new query
3. Paste this SQL, replacing `YOUR_USER_ID` with the UID you copied:

```sql
INSERT INTO admin_profiles (id, username, is_admin)
VALUES ('YOUR_USER_ID_HERE', 'admin', true);
```

**Example:**
```sql
INSERT INTO admin_profiles (id, username, is_admin)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin', true);
```

4. Click **Run**
5. Should see "Success. 1 row(s) affected" ✅

---

### Step 4: Test Admin Login (1 minute)

1. Go to your website: `https://yourusername.github.io/portfolio/login`
2. Enter your credentials:
   - **Email**: The email you created (e.g., `admin@yourdomain.com`)
   - **Password**: The password you set
3. Click **Sign In**
4. You should be redirected to `/admin` and see "Welcome back, admin!" ✅

---

## ✅ Your Admin Credentials

After setup, you can login with:

```
URL: https://your-site.com/login

Email: [The email you created in Step 2]
Password: [The password you set in Step 2]
```

**Example:**
```
URL: https://yourusername.github.io/portfolio/login

Email: admin@yourdomain.com
Password: Admin123!Secure
```

**⚠️ Security Note:**
- Use a **strong password** (at least 12 characters, mix of letters, numbers, symbols)
- Don't share your credentials
- Don't commit credentials to Git
- Consider using a password manager

---

## 🎯 What You Can Do in Admin Panel

Once logged in at `/admin`, you can:

- 📊 View visitor statistics
- 📈 See visitor charts by country
- 📋 View visitor details (country, IP, timestamps)
- 💬 Read contact form messages
- ⚙️ Manage site settings

---

## 🐛 Troubleshooting

### "Email not confirmed" error

**Solution:** When creating the user in Step 2, make sure to check **"Auto Confirm User"**

Or manually confirm:
1. Go to Authentication → Users
2. Click on your user
3. Click **"Confirm user"**

---

### "Unauthorized access" error after login

**Possible causes:**

1. **User not added to admin_profiles**
   - Go to SQL Editor
   - Run: `SELECT * FROM admin_profiles;`
   - Should see your user ID with `is_admin = true`
   - If not found, run Step 3 again with correct User UID

2. **is_admin function not created**
   - Run `ADMIN_SETUP.sql` again
   - Make sure no errors appear

3. **Wrong User UID in admin_profiles**
   - Get your User UID from Authentication → Users
   - Run:
     ```sql
     UPDATE admin_profiles
     SET id = 'YOUR_CORRECT_USER_ID'
     WHERE username = 'admin';
     ```

---

### Can't find the User UID

1. Go to **Authentication** → **Users** in Supabase
2. Click on your user's email
3. Look for **"UID"** or **"id"** field
4. Copy the entire UUID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

Or use SQL:
```sql
SELECT id, email FROM auth.users;
```

---

### "Invalid login credentials" error

- Double-check your email and password
- Passwords are case-sensitive
- Make sure there are no extra spaces
- Try resetting the password:
  1. Authentication → Users
  2. Click on user → Send password reset email
  3. Or delete and create a new user

---

### Login page shows error message

Check browser console (F12) for detailed errors:
- If you see database connection errors, verify Supabase credentials
- If you see RLS policy errors, run `ADMIN_SETUP.sql` again

---

## 🔒 Security Best Practices

### 1. Use a Strong Password

❌ Bad passwords:
- `admin`
- `password`
- `123456`
- Your name or email

✅ Good passwords:
- `MyP0rtf0l!o2024$Adm1n`
- `Secure#Admin*Pass2024!`
- Use a password generator

### 2. Enable Two-Factor Authentication (Optional)

In Supabase:
1. Go to Authentication → Providers
2. Enable Phone provider or other 2FA methods
3. Configure in your user settings

### 3. Use a Real Email Address

- Receive password reset emails
- Get security notifications
- Can be your personal email or a dedicated admin email

### 4. Regularly Update Password

- Change password every 3-6 months
- Use Supabase dashboard: Authentication → Users → Reset password

---

## 👥 Adding Multiple Admins (Optional)

To add another admin user:

1. Create new user in Authentication → Users
2. Copy their User UID
3. Run:
   ```sql
   INSERT INTO admin_profiles (id, username, is_admin)
   VALUES ('NEW_USER_ID', 'admin2', true);
   ```

To remove admin access:
```sql
UPDATE admin_profiles
SET is_admin = false
WHERE id = 'USER_ID_TO_REMOVE';
```

Or delete completely:
```sql
DELETE FROM admin_profiles WHERE id = 'USER_ID_TO_REMOVE';
```

---

## 📊 Verify Admin Setup

Run these SQL queries to verify everything is set up correctly:

```sql
-- Check if admin_profiles table exists and has data
SELECT * FROM admin_profiles;

-- Check if is_admin function works
SELECT is_admin('YOUR_USER_ID');  -- Should return: true

-- Check admin_settings
SELECT * FROM admin_settings;

-- List all users in auth
SELECT id, email, created_at FROM auth.users;
```

---

## ✅ Setup Checklist

- [ ] `ADMIN_SETUP.sql` executed successfully
- [ ] Admin user created in Authentication → Users
- [ ] User UID copied
- [ ] User added to `admin_profiles` table with `is_admin = true`
- [ ] Can login at `/login` with email and password
- [ ] Successfully redirected to `/admin` dashboard
- [ ] Can see visitor statistics and data
- [ ] Password is strong and secure
- [ ] Credentials saved in password manager

---

## 🎉 Success!

You can now access your admin panel at:

**Login URL:** `https://your-site.com/login`

**After login, you'll be at:** `https://your-site.com/admin`

To logout: Click the logout button in the admin panel.

---

## 📁 Files

- `ADMIN_SETUP.sql` - SQL commands to run
- `ADMIN_SETUP_GUIDE.md` - This guide
- `DATABASE_SETUP.sql` - Main database setup (run first)

**Need help?** Check the troubleshooting section above or review the browser console for errors!
