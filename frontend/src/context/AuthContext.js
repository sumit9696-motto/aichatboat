import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, fetchCurrentUser, logout } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          setAuthenticated(true);
          const storedUser = getCurrentUser();
          setUser(storedUser);
          
          try {
            // Fetch fresh user data from API
            const updatedUser = await fetchCurrentUser();
            setUser(updatedUser);
          } catch (error) {
            console.error('Error fetching current user:', error);
            // If unauthorized, logout
            if (error.response && 
                (error.response.status === 401 || 
                 error.message === 'Token is not valid' || 
                 error.message === 'No token, authorization denied')) {
              handleLogout();
            }
            setError(error.message || 'Error fetching user data');
          }
        } else {
          // Clear any lingering user data if not authenticated
          handleLogout();
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData) => {
    if (!userData || !userData.user) {
      setError('Invalid login data received');
      return false;
    }
    
    setUser(userData.user);
    setAuthenticated(true);
    setError(null);
    return true;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthenticated(false);
    setError(null);
  };

  const updateUser = (userData) => {
    if (!userData) {
      setError('Invalid user data for update');
      return false;
    }
    
    setUser(userData);
    
    // Only update localStorage if we're still authenticated
    if (isAuthenticated()) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return true;
  };

  const checkAuthStatus = async () => {
    if (!isAuthenticated()) {
      return false;
    }
    
    try {
      const updatedUser = await fetchCurrentUser();
      setUser(updatedUser);
      setAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        updateUser,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};