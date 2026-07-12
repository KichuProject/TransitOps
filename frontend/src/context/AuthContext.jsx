import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/auth';
import { toast } from 'react-hot-toast';
import { INITIAL_USERS } from '../constants/mockData';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('to_token') || 'mock-jwt-token-key-xyz-789');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('to_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Local authentication validation bypass for demo accounts
      const isDemo = email.toLowerCase().endsWith('@transitops.com');
      if (isDemo) {
        const demoUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (demoUser) {
          const localPayload = {
            token: 'mock-jwt-token-key-xyz-789',
            user: demoUser
          };
          setToken(localPayload.token);
          setCurrentUser(localPayload.user);
          localStorage.setItem('to_token', localPayload.token);
          localStorage.setItem('to_current_user', JSON.stringify(localPayload.user));
          toast.success(`Welcome back, ${localPayload.user.name}!`);
          return true;
        }
      }

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
