# Step-by-Step: Render Backend Deployment

## You're Here: Render "New Web Service" Page

You should see your repository: **"KeerthiKrishnaT / pos-inventory-system"** selected.

---

## Step 1: Fill the Form Fields

Look for these input fields on the page and fill them:

### Field 1: Name
- **Find**: Text box that says "Name" or "A unique name for your web service"
- **Type**: `pos-inventory-backend`
- (This is just a name for your service, you can use any name)

### Field 2: Language/Runtime
- **Find**: Dropdown that says "Language" or "Runtime"
- **Select**: `Node` (should be auto-selected, but make sure it says "Node")

### Field 3: Region
- **Find**: Dropdown that says "Region"
- **Select**: Any region close to you (e.g., "Singapore" or "US East")

### Field 4: Branch
- **Find**: Dropdown that says "Branch"
- **Select**: `main` (should already be selected)

### Field 5: Root Directory ⚠️ IMPORTANT
- **Find**: Text box that says "Root Directory"
- **Type**: `backend`
- **This is very important!** It tells Render where your backend code is.

### Field 6: Build Command
- **Find**: Text box that says "Build Command"
- **Type**: `npm install`
- (This installs all packages)

### Field 7: Start Command
- **Find**: Text box that says "Start Command"
- **Type**: `npm start`
- (This starts your server)

---

## Step 2: Add Environment Variables

Scroll down on the page until you see a section called **"Environment Variables"** or **"Environment"**.

You'll see a button that says **"Add Environment Variable"** or **"Add"**.

Click it **4 times** to add these 4 variables:

### Variable 1: MONGODB_URI
1. Click "Add Environment Variable"
2. In the **Key** field, type: `MONGODB_URI`
3. In the **Value** field, type: `mongodb+srv://keerthikrishna920_db_user:oahP5Aut2YabrbEn@cluster0.alhiv73.mongodb.net/pos_inventory?retryWrites=true&w=majority`
4. Click "Add" or "Save"

### Variable 2: JWT_SECRET
1. Click "Add Environment Variable" again
2. **Key**: `JWT_SECRET`
3. **Value**: `my_secret_key_12345` (or any random text)
4. Click "Add" or "Save"

### Variable 3: NODE_ENV
1. Click "Add Environment Variable" again
2. **Key**: `NODE_ENV`
3. **Value**: `production`
4. Click "Add" or "Save"

### Variable 4: FRONTEND_URL
1. Click "Add Environment Variable" again
2. **Key**: `FRONTEND_URL`
3. **Value**: `http://localhost:3000`
4. Click "Add" or "Save"

---

## Step 3: Deploy

1. Scroll to the bottom of the page
2. Look for a button that says:
   - **"Create Web Service"** OR
   - **"Deploy"** OR
   - **"Create"**
3. Click that button
4. Wait 5-10 minutes (you'll see a progress screen)

---

## What You Should See After Clicking "Create"

- A loading/progress screen
- Logs showing "Installing dependencies..."
- Logs showing "Building..."
- Finally: "Your service is live at https://xxx.onrender.com"
- **Copy that URL!** You'll need it later.

---

## Still Confused?

**Tell me which part you're stuck on:**
- Can't find a field?
- Don't see "Root Directory"?
- Can't find "Environment Variables"?
- Something else?

I'll help you with that specific part!

