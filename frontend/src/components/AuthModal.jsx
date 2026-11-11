import React, { useState } from 'react';
import { Compass, Mail, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, apiBase }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!email.trim() || !password) {
      setFeedback({ type: 'error', text: 'Please fill in both email and password.' });
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your name.' });
      return;
    }

    setLoading(true);

    const endpoint = mode === 'login' ? `${apiBase}/login` : `${apiBase}/register`;
    const payload = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFeedback({ type: 'success', text: data.message });
        
        if (mode === 'login') {
          setTimeout(() => {
            onLoginSuccess(data.user, data.token);
            onClose();
          }, 800);
        } else {
          setTimeout(() => {
            setMode('login');
            setFeedback({ type: 'success', text: 'Account registered! You can now log in.' });
          }, 1200);
        }
      } else {
        setFeedback({
          type: 'error',
          text: data.message || 'Verification failed at backend.'
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Unable to connect to backend server. Make sure Node.js is running on http://localhost:5000'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal-card">
        
        <button type="button" onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>

        <div className="card-header">
          <div className="brand-badge">
            <Compass size={16} />
            <span>WanderBus Account</span>
          </div>
          <h2 className="card-title">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h2>
          <p className="card-subtitle">
            {mode === 'login'
              ? 'Enter your credentials to book and manage bus tickets'
              : 'Join WanderBus to book journeys across the country'}
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button 
            type="button"
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setFeedback(null); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setFeedback(null); }}
          >
            Register
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`alert-banner ${feedback.type}`}>
            {feedback.type === 'error' && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            {feedback.type === 'success' && <CheckCircle2 size={18} style={{ flexShrink: 0 }} />}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="authNameInput">Full Name</label>
              <div className="input-container">
                <span className="input-icon"><User size={18} /></span>
                <input
                  id="authNameInput"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="authEmailInput">Email Address</label>
            <div className="input-container">
              <span className="input-icon"><Mail size={18} /></span>
              <input
                id="authEmailInput"
                type="email"
                className="form-input"
                placeholder="traveler@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="authPasswordInput">Password</label>
            <div className="input-container">
              <span className="input-icon"><Lock size={18} /></span>
              <input
                id="authPasswordInput"
                type={showPassword ? 'text' : 'password'}
                className="form-input has-toggle"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Verifying with Backend...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Continue' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Test Accounts */}
        {mode === 'login' && (
          <div className="demo-accounts">
            <div className="demo-title">
              <span>Quick Test Credentials</span>
            </div>
            <div className="demo-pills">
              <button
                type="button"
                className="demo-pill-btn"
                onClick={() => handleQuickFill('traveler@example.com', 'password123')}
              >
                <span><strong>traveler@example.com</strong> / password123</span>
                <span className="demo-pill-tag">Auto Fill</span>
              </button>
              <button
                type="button"
                className="demo-pill-btn"
                onClick={() => handleQuickFill('sophia@wanderlust.com', 'adventure2026')}
              >
                <span><strong>sophia@wanderlust.com</strong> / adventure2026</span>
                <span className="demo-pill-tag">Auto Fill</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
