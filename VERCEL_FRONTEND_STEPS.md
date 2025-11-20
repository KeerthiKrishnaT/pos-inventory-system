# Step-by-Step: Deploy Frontend on Vercel

## Step 1: Go to Vercel

1. Open a new tab in your browser
2. Go to: **[vercel.com](https://vercel.com)**
3. Click **"Sign Up"** (if new) or **"Log In"** (if you have account)
4. **Important**: Click **"Continue with GitHub"** (use your GitHub account)

---

## Step 2: Import Your Project

After logging in:

1. You'll see a dashboard
2. Click the **"Add New..."** button (usually top right)
3. Click **"Project"** from the dropdown
4. You'll see a list of your GitHub repositories
5. Find: **"pos-inventory-system"**
6. Click **"Import"** button next to it

---

## Step 3: Configure Project Settings

You'll see a configuration page. Fill these:

### Important Settings:

1. **Framework Preset**
   - Should auto-detect as "React"
   - If not, select "React" from dropdown

2. **Root Directory** ⚠️ **VERY IMPORTANT!**
   - Click the **"Edit"** button next to it
   - Change from blank/root to: **`frontend`**
   - This tells Vercel where your frontend code is

3. **Build Command**
   - Should auto-fill as: `npm run build`
   - If not, type: `npm run build`

4. **Output Directory**
   - Should auto-fill as: `build`
   - If not, type: `build`

5. **Install Command**
   - Should auto-fill as: `npm install`
   - If not, type: `npm install`

---

## Step 4: Add Environment Variable

Scroll down to find **"Environment Variables"** section:

1. Click **"Add"** or **"Add Environment Variable"**
2. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://YOUR-BACKEND-URL.onrender.com/api`
   - **Replace `YOUR-BACKEND-URL`** with your actual Render backend URL
   - Example: If your backend is `https://pos-inventory-backend.onrender.com`
   - Then value should be: `https://pos-inventory-backend.onrender.com/api`

**Where to find your backend URL?**
- Go back to Render dashboard
- Click on your backend service
- You'll see the URL at the top (e.g., `https://xxx.onrender.com`)

---

## Step 5: Deploy

1. Scroll to the bottom
2. Click the big **"Deploy"** button
3. Wait 2-3 minutes (you'll see build progress)
4. Once done, you'll see: **"Congratulations! Your project has been deployed."**
5. **Copy your frontend URL!** (e.g., `https://pos-inventory-system.vercel.app`)

---

## Step 6: Update Backend CORS (Important!)

Now we need to tell your backend to accept requests from your frontend:

1. Go back to **Render dashboard** (render.com)
2. Click on your **backend service**
3. Go to **"Environment"** tab (top menu)
4. Find the `FRONTEND_URL` variable
5. Click the **pencil/edit icon** next to it
6. Change the value to your **Vercel frontend URL**
   - Example: `https://pos-inventory-system.vercel.app`
7. Click **"Save Changes"**
8. Render will automatically redeploy (takes 2-3 minutes)

---

## Step 7: Test Your Live App! 🎉

1. Open your **Vercel frontend URL** in a new tab
2. Try registering a new user
3. Try logging in
4. Test creating products (as admin)
5. Test making sales (as employee)

---

## Quick Checklist

- [ ] Signed up/logged in to Vercel with GitHub
- [ ] Imported `pos-inventory-system` repository
- [ ] Set Root Directory to `frontend`
- [ ] Added `REACT_APP_API_URL` environment variable with backend URL
- [ ] Clicked "Deploy"
- [ ] Copied frontend URL
- [ ] Updated `FRONTEND_URL` in Render backend
- [ ] Tested the live app

---

## Troubleshooting

### Can't find "Root Directory"?
- Look for a section called "Project Settings" or "Build Settings"
- There should be an "Edit" button to change root directory

### Frontend can't connect to backend?
- Check `REACT_APP_API_URL` in Vercel settings
- Make sure it includes `/api` at the end
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Wait for Render redeploy to complete

### Build fails?
- Check Vercel build logs
- Make sure Root Directory is set to `frontend`
- Verify all files are in the GitHub repository

---

**You're almost done! Follow these steps and your app will be live! 🚀**

