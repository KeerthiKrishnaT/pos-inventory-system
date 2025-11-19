# Quick Start: Deploy in 10 Minutes

## Step 1: Push to GitHub (5 minutes)

```bash
# In your project root (D:\Project)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/pos-inventory-system.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend - Render (3 minutes)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=any_random_string_here
   NODE_ENV=production
   FRONTEND_URL=http://localhost:3000 (update later)
   ```
6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://xxx.onrender.com`)

## Step 3: Deploy Frontend - Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Settings:
   - **Root Directory**: `frontend`
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Click "Deploy"
7. **Copy your frontend URL** (e.g., `https://xxx.vercel.app`)

## Step 4: Update Backend CORS (1 minute)

1. Go back to Render dashboard
2. Edit `FRONTEND_URL` environment variable
3. Set it to your Vercel URL: `https://xxx.vercel.app`
4. Save (auto-redeploys)

## Step 5: Update MongoDB Atlas (1 minute)

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Confirm

## Done! 🎉

Your app is now live at your Vercel URL!

---

## Troubleshooting

**Backend not working?**
- Check Render logs
- Verify root directory is `backend`
- Check environment variables

**Frontend can't connect?**
- Verify `REACT_APP_API_URL` in Vercel
- Check `FRONTEND_URL` in Render matches Vercel URL

**MongoDB error?**
- Check Network Access allows `0.0.0.0/0`
- Verify connection string includes database name

