# Fix CORS Issue - Backend Update Required

## Problem
The backend on Render is only allowing `http://localhost:3000`, but your frontend is deployed at `https://pos-inventory-system-six.vercel.app`, causing CORS errors.

## Solution

I've updated the backend code to allow both localhost and your Vercel URL. Now you need to:

### Option 1: Update Render Environment Variable (Recommended)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Log in to your account

2. **Navigate to Your Backend Service**
   - Click on your backend service (pos-inventory-system)

3. **Go to Environment Tab**
   - Click on "Environment" in the left sidebar

4. **Update FRONTEND_URL**
   - Find the `FRONTEND_URL` variable
   - Change it from `http://localhost:3000` to:
     ```
     https://pos-inventory-system-six.vercel.app
     ```
   - Or add both URLs separated by comma (if Render supports it)

5. **Save and Redeploy**
   - Click "Save Changes"
   - Render will automatically redeploy your service
   - Wait 2-3 minutes for deployment to complete

### Option 2: Push Updated Code to GitHub (Alternative)

The backend code has been updated to automatically allow both:
- `http://localhost:3000` (for local development)
- `https://pos-inventory-system-six.vercel.app` (for production)

If Render is connected to GitHub with auto-deploy:
1. Push the updated `backend/server.js` to GitHub
2. Render will automatically redeploy

### Verify the Fix

After deployment:
1. Try logging in from your Vercel frontend
2. The CORS error should be gone
3. Check browser console - no more CORS errors

## What Was Changed

**File: `backend/server.js`**
- Updated CORS configuration to allow multiple origins
- Now allows both localhost and Vercel frontend URL
- More flexible for development and production

## If Issues Persist

1. **Check Render Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for any errors during deployment

2. **Verify Environment Variable**
   - Make sure `FRONTEND_URL` is set correctly in Render

3. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Or clear browser cache

4. **Check Backend URL**
   - Verify your backend is accessible at: `https://pos-inventory-system.onrender.com`

---

**Note**: The accessibility warnings about DialogContent are from browser extensions (React DevTools) and can be safely ignored. They're false positives since we're using custom modals, not Radix UI components.

