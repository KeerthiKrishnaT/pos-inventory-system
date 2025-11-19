import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/pos');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/pos');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div className="auth-background login-background"></div>
      <div className="card" style={{ width: '400px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>POS & Inventory System</h2>
        <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>Login</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
            Login
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
              Forgot Password?
            </Link>
            <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

