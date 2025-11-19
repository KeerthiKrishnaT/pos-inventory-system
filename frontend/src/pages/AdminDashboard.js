import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProductManagement from '../components/ProductManagement';
import SalesHistory from '../components/SalesHistory';
import SalesChart from '../components/SalesChart';
import '../App.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="app">
      <nav className="navbar admin-navbar">
        <h1>POS & Inventory System - Admin Dashboard</h1>
        <div className="navbar-actions">
          <span>Welcome, {user?.email}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
          <button
            className={`admin-tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales History
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && <SalesChart />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'sales' && <SalesHistory />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

