import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <Link to={authenticated ? '/dashboard' : '/'}>
          <h1>Technical Education Assistant</h1>
        </Link>
        <p>Department of Technical Education, Government of Rajasthan</p>
      </div>
      
      <nav className="header-nav">
        {authenticated ? (
          <div className="user-menu">
            <span className="welcome-text">
              Welcome, {user?.name || 'Student'}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;