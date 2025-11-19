# How to Combine Frontend & Backend into One Repository

## Current Situation
- ✅ Frontend pushed to: `https://github.com/KeerthiKrishnaT/pos-frontend.git`
- ❌ Backend not yet pushed

## Option 1: Combine into One Repository (Recommended)

### Step 1: Create New Combined Repository on GitHub

1. Go to [github.com](https://github.com)
2. Create a **new repository** named: `pos-inventory-system` (or any name)
3. **DO NOT** initialize with README

### Step 2: Initialize Git in Root Directory

Open PowerShell in `D:\Project` (root directory):

```powershell
# Remove the frontend git repo
cd D:\Project
Remove-Item -Recurse -Force frontend\.git

# Initialize git in root
git init
git add .
git commit -m "Initial commit: POS Inventory System (Frontend + Backend)"
```

### Step 3: Connect to New Combined Repository

```powershell
git remote add origin https://github.com/KeerthiKrishnaT/pos-inventory-system.git
git branch -M main
git push -u origin main
```

### Step 4: Delete Old Frontend-Only Repository (Optional)

You can delete `pos-frontend` repository on GitHub if you want, since everything is now in the combined repo.

---

## Option 2: Keep Separate Repositories

If you prefer to keep them separate:

### Push Backend to Separate Repo

```powershell
# In D:\Project\backend
cd D:\Project\backend
git init
git add .
git commit -m "Initial commit: POS Backend"
git remote add origin https://github.com/KeerthiKrishnaT/pos-backend.git
git branch -M main
git push -u origin main
```

### Deployment with Separate Repos

- **Frontend (Vercel)**: Connect `pos-frontend` repo, set root to `frontend` (but since it's already the root, just deploy)
- **Backend (Render)**: Connect `pos-backend` repo, set root to `backend` (but since it's already the root, just deploy)

**Note**: This requires adjusting the deployment guides slightly.

---

## Recommendation

**I recommend Option 1** because:
- ✅ Matches the deployment guides I created
- ✅ Easier to manage (one repo)
- ✅ Better for version control (frontend and backend changes together)
- ✅ Standard practice for monorepo projects

Which option do you prefer?

