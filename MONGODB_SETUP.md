# MongoDB Setup Guide

This project uses **MongoDB** as the database with **Mongoose** as the ODM (Object Document Mapper).

## MongoDB Installation Options

### Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download and install MongoDB for your operating system
   - Follow the installation wizard

2. **Start MongoDB Service**
   - **Windows**: MongoDB should start automatically as a service
   - **macOS/Linux**: Run `mongod` in terminal or use `brew services start mongodb-community` (if installed via Homebrew)

3. **Verify Installation**
   ```bash
   mongosh
   ```
   If MongoDB is running, you'll see the MongoDB shell prompt.

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `pos_inventory`)

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pos_inventory

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pos_inventory?retryWrites=true&w=majority

# Server Configuration
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Connection String Formats

**Local MongoDB:**
```
mongodb://localhost:27017/pos_inventory
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pos_inventory?retryWrites=true&w=majority
```

## Database Collections

The application automatically creates the following collections:

1. **users** - Stores user accounts (admin/employee)
2. **products** - Stores product inventory
3. **sales** - Stores sales transactions

## Verifying Connection

When you start the backend server, you should see:
```
✅ MongoDB Connected Successfully
📊 Database: pos_inventory
🔗 Connection: mongodb://localhost:27017/pos_inventory
```

If you see connection errors:
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access (for Atlas)
- Check firewall settings

## MongoDB Tools

### MongoDB Compass (GUI)
- Download: https://www.mongodb.com/try/download/compass
- Visual interface to view and manage your database

### MongoDB Shell (mongosh)
- Command-line interface for MongoDB
- Useful for debugging and direct database queries

## Troubleshooting

### Connection Refused
- **Solution**: Make sure MongoDB service is running
- **Windows**: Check Services → MongoDB
- **macOS/Linux**: Run `mongod` or check service status

### Authentication Failed
- **Solution**: Verify username and password in connection string
- Check database user permissions in Atlas

### Network Timeout (Atlas)
- **Solution**: Add your IP address to Atlas whitelist
- Check firewall settings

### Database Not Found
- **Solution**: MongoDB will create the database automatically on first write
- No need to create it manually

## Production Considerations

1. **Use MongoDB Atlas** for production deployments
2. **Set strong JWT_SECRET** in production
3. **Use environment-specific connection strings**
4. **Enable MongoDB authentication** (required for Atlas)
5. **Set up database backups**
6. **Monitor database performance**

