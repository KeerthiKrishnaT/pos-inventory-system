import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await register(email, password, role);
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
      <div className="auth-background register-background"></div>
      <div className="card" style={{ width: '400px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>POS & Inventory System</h2>
        <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>Register</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
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
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password (min 6 characters)"
                minLength={6}
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

          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                minLength={6}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
            Register
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

