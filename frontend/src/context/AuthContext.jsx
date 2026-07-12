import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('to_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('to_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);

      // Save to state and storage
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('to_token', data.token);
      localStorage.setItem('to_current_user', JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Invalid email or password';
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('to_token');
    localStorage.removeItem('to_current_user');
    toast.success('Successfully logged out.');
  };

  // Listen for auto-logout events from Axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setCurrentUser(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, currentUser, loading, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
