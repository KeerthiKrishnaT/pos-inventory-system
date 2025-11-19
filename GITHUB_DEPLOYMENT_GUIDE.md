# Complete Guide: Push to GitHub & Deploy for Free

This guide will walk you through pushing your code to GitHub and deploying both frontend and backend for free.

---

## Part 1: Push Code to GitHub

### Step 1: Initialize Git Repository

Open terminal/command prompt in your project root directory (`D:\Project`):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: POS & Inventory System"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository settings:
   - **Name**: `pos-inventory-system` (or any name you like)
   - **Description**: "MERN Stack POS & Inventory Management System"
   - **Visibility**: Private (recommended for personal use) or Public
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

### Step 3: Connect and Push to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pos-inventory-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: If you get authentication error, you may need to:
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app for easier push

---

## Part 2: Deploy Backend (Render - Free)

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (recommended)

### Step 2: Create Web Service

1. After login, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Select your repository: `pos-inventory-system`
4. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the form:

- **Name**: `pos-inventory-backend` (or any name)
- **Environment**: Select **"Node"**
- **Region**: Choose closest to you (e.g., Singapore, US East)
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**:

Add these one by one:

1. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pos_inventory?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Generate a strong random string (you can use: `openssl rand -base64 32` or any random string)
   - Example: `my_super_secret_jwt_key_12345_change_this`

3. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

4. **FRONTEND_URL**
   - Key: `FRONTEND_URL`
   - Value: We'll update this after deploying frontend (for now use: `http://localhost:3000`)
   - **Update later** with your Vercel URL

### Step 5: Deploy

1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (5-10 minutes for first time)
3. Once deployed, copy your service URL (e.g., `https://pos-inventory-backend.onrender.com`)
4. **Save this URL** - you'll need it for frontend!

### Step 6: Update MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
5. Click **"Confirm"**

---

## Part 3: Deploy Frontend (Vercel - Free)

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with your **GitHub account** (recommended)

### Step 2: Import Project

1. After login, click **"Add New..."** → **"Project"**
2. Find your repository: `pos-inventory-system`
3. Click **"Import"**

### Step 3: Configure Frontend

In the project configuration:

- **Framework Preset**: React (auto-detected)
- **Root Directory**: Click **"Edit"** and set to `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `build` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variable

1. Scroll down to **"Environment Variables"**
2. Click **"Add"**
3. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - Replace `your-backend-url` with your actual Render backend URL
   - Example: `https://pos-inventory-backend.onrender.com/api`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://pos-inventory-system.vercel.app`
4. **Save this URL**

### Step 6: Update Backend CORS

1. Go back to **Render dashboard**
2. Click on your backend service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Click **"Edit"** and update value to your Vercel URL
   - Example: `https://pos-inventory-system.vercel.app`
6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## Part 4: Test Your Deployment

1. Visit your **Vercel frontend URL**
2. Try registering a new user
3. Test login
4. Test creating products (as admin)
5. Test making sales (as employee)

---

## Troubleshooting

### Backend not working?

1. Check Render logs:
   - Render Dashboard → Your Service → **"Logs"** tab
   - Look for errors

2. Common issues:
   - Wrong root directory (should be `backend`)
   - Missing environment variables
   - MongoDB connection string incorrect

### Frontend can't connect to backend?

1. Check environment variable in Vercel:
   - Vercel Dashboard → Your Project → **"Settings"** → **"Environment Variables"**
   - Verify `REACT_APP_API_URL` is correct

2. Check CORS:
   - Verify `FRONTEND_URL` in Render matches your Vercel URL exactly

3. Test backend directly:
   - Open: `https://your-backend.onrender.com/api/auth/me` in browser
   - Should show error (expected) but confirms backend is running

### MongoDB connection fails?

1. Check MongoDB Atlas:
   - Network Access → Should allow `0.0.0.0/0`
   - Database Access → User should have read/write permissions

2. Verify connection string:
   - Should include database name: `/pos_inventory`
   - Should include `?retryWrites=true&w=majority`

---

## Quick Reference

### Your URLs (after deployment):

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Base**: `https://your-backend.onrender.com/api`

### Environment Variables Summary:

**Render (Backend):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend):**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Free Tier Limitations

### Render Free Tier:
- ✅ Free forever
- ⚠️ Spins down after 15 min inactivity (first request takes ~30 seconds)
- ✅ 750 hours/month free
- ✅ Auto-deploys on git push

### Vercel Free Tier:
- ✅ Free forever
- ✅ Unlimited deployments
- ✅ Global CDN
- ✅ Auto-deploys on git push

### MongoDB Atlas Free Tier:
- ✅ 512MB storage
- ✅ Perfect for personal use

---

## Next Steps After Deployment

1. **Test all features** on live site
2. **Create your admin account** via registration
3. **Add some products** to test
4. **Make a test sale** to verify everything works
5. **Bookmark your URLs** for easy access

---

## Need Help?

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints directly in browser
4. Check MongoDB Atlas connection status

Good luck with your deployment! 🚀

