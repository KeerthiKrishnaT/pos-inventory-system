# Mini POS & Inventory System

A simplified Point-of-Sale and Inventory Management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration
  - Password reset functionality (forgot password)
  - Role-based access control (Admin/Employee)
  - Password hashing with bcrypt

- **Product & Inventory Management (Admin Only)**
  - Create, edit, and delete products
  - Track inventory levels
  - Product details: name, SKU, price, stock

- **POS Counter (Employee Only)**
  - Search and select products
  - Add items to cart with quantity
  - Real-time stock validation
  - Complete sales and automatically update inventory

- **Sales History (Admin Only)**
  - View all past sales
  - Detailed sale information
  - Date/time tracking

## Technology Stack

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
  - **Local**: Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
  - **Cloud**: Use MongoDB Atlas (free tier available) from [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- npm or yarn

> 📖 **See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB installation and configuration instructions.**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/pos_inventory
# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pos_inventory?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Initial User Setup

You can create users in two ways:

### Option 1: Using the Registration Page
Navigate to `http://localhost:3000/register` and fill in the registration form. You can choose between Admin or Employee role.

### Option 2: Using the API Endpoint

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

Or create an employee:
```json
{
  "email": "employee@example.com",
  "password": "employee123",
  "role": "employee"
}
```

**Note**: In production, you should restrict the registration endpoint or create users directly in the database.

## Password Reset

If you forget your password:

1. Go to the login page and click "Forgot Password?"
2. Enter your email address
3. You'll receive a reset link (in development, the link is displayed on screen; in production, it would be sent via email)
4. Click the reset link or navigate to `/reset-password?token=YOUR_TOKEN`
5. Enter your new password and confirm it
6. You'll be redirected to the login page

## User Roles

### Admin
- Full access to product and inventory management
- View and manage all products
- Access to sales history
- Can view all past transactions

### Employee
- Access to POS counter only
- Can search and select products
- Can complete sales
- Cannot access admin panels

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Products (Admin Only)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales (Admin only)
- `GET /api/sales/:id` - Get single sale (Admin only)
- `POST /api/sales` - Create sale (Employee/Admin)
- `GET /api/sales/pos/products` - Get products for POS (Employee/Admin)

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Sale.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── sales.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.js
│   │   │   ├── ProductManagement.js
│   │   │   └── SalesHistory.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── EmployeePOS.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Security Notes

- Change the JWT_SECRET in production
- Implement rate limiting for authentication endpoints
- Use HTTPS in production
- Consider implementing request validation middleware
- Restrict registration endpoint in production

## Deployment

This application can be deployed for free using:

- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)

📖 **See [GITHUB_DEPLOYMENT_GUIDE.md](./GITHUB_DEPLOYMENT_GUIDE.md) for complete step-by-step guide (GitHub + Deployment).**

📖 **See [QUICK_START.md](./QUICK_START.md) for quick deployment in 10 minutes.**

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

### Quick Deploy Steps:

1. **Backend (Render)**:
   - Connect GitHub repo
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

2. **Frontend (Vercel)**:
   - Connect GitHub repo
   - Set root directory to `frontend`
   - Add `REACT_APP_API_URL` environment variable
   - Deploy

3. **Update MongoDB Atlas**:
   - Whitelist IP: `0.0.0.0/0` (allow all)

## License

This project is for educational purposes.

