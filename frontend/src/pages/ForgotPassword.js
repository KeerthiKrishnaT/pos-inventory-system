import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLink('');
    setLoading(true);

    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(result.message);
      if (result.resetLink) {
        setResetLink(result.resetLink);
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div className="auth-background forgot-password-background"></div>
      <div className="card" style={{ width: '400px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>POS & Inventory System</h2>
        <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>Forgot Password</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {!success ? (
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
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '15px' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div>
            {resetLink && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Reset Link:</p>
                <a 
                  href={resetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#007bff', 
                    wordBreak: 'break-all',
                    textDecoration: 'none'
                  }}
                >
                  {resetLink}
                </a>
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                  Note: In production, this link would be sent to your email.
                </p>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

