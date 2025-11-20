import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const leaves = [
  {
    title: 'Automated Billing',
    gradient: 'linear-gradient(135deg, #ffd200, #ff7e00)',
    origin: { x: -520, y: -260 }
  },
  {
    title: 'Minimizes Billing Errors',
    gradient: 'linear-gradient(135deg, #f83600, #f9d423)',
    origin: { x: 450, y: -240 }
  },
  {
    title: 'Eases Out Calculation',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    origin: { x: -420, y: 300 }
  },
  {
    title: 'Generates Bills Quickly',
    gradient: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    origin: { x: 520, y: 260 }
  },
  {
    title: 'Faster Transactions',
    gradient: 'linear-gradient(135deg, #43cea2, #185a9d)',
    origin: { x: -600, y: 80 }
  },
  {
    title: 'Improves Customer Relations',
    gradient: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
    origin: { x: 520, y: 120 }
  }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-overlay" />
      <div className="landing-wrapper">
        <div className="landing-content">
          <p className="eyebrow">Billing Web · POS & Inventory</p>
          <h1>Smart Billing for Agile Businesses</h1>
          <p className="subtitle">
            Automate invoicing, keep inventory in sync, and convert every sale into actionable insights.
            Your team gets speed, your customers get clarity.
          </p>
          <div className="landing-actions">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>
              Create Account
            </button>
          </div>
        </div>
        
        <div className="landing-visual">
          <div className="leaf-orbit">
            <div className="center-orb">
              <span>Billing</span>
              <span>Web</span>
              <span>Benefits</span>
            </div>
            {leaves.map((leaf, index) => (
              <div
                key={leaf.title}
                className="leaf"
                style={{
                  '--angle': `${index * (360 / leaves.length)}deg`,
                  '--delay': `${index * 0.25}s`,
                  '--startX': `${leaf.origin.x}px`,
                  '--startY': `${leaf.origin.y}px`
                }}
              >
                <div className="leaf-shape" style={{ background: leaf.gradient }} />
                <p>{leaf.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

