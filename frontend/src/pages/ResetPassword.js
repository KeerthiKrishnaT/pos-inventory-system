import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
      <div className="auth-background reset-password-background"></div>
      <div className="card" style={{ width: '400px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>POS & Inventory System</h2>
        <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>Reset Password</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {!success && token ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password (min 6 characters)"
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
              <label>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
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
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '15px' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </form>
        ) : !token ? (
          <div>
            <div className="alert alert-error">
              Invalid reset token. Please request a new password reset.
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="/forgot-password" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginRight: '10px' }}>
                Request Reset Link
              </Link>
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResetPassword;

