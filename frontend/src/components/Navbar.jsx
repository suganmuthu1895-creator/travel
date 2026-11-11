import React from 'react';
import { Bus, Ticket, User, LogOut, LogIn } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, bookingsCount }) {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('search')}>
          <div className="brand-icon-box">
            <Bus size={22} className="brand-bus-icon" />
          </div>
          <div>
            <span className="brand-name">Wander<span className="brand-accent">Bus</span></span>
            <span className="brand-sub">Express Intercity</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          <button 
            type="button"
            className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Bus size={18} />
            <span>Book Buses</span>
          </button>

          <button 
            type="button"
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Ticket size={18} />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="nav-badge">{bookingsCount}</span>
            )}
          </button>
        </nav>

        {/* User Profile / Auth Actions */}
        <div className="navbar-user">
          {user ? (
            <div className="user-profile-pill">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt={user.name} 
                className="nav-avatar"
              />
              <div className="nav-user-info">
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-role">{user.role || 'Passenger'}</span>
              </div>
              <button 
                type="button" 
                onClick={onLogout} 
                className="nav-logout-btn" 
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={onOpenAuth} 
              className="nav-signin-btn"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
