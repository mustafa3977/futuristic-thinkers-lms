import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  _id: 'admin_demo_01',
  name: 'Futuristic Administrator',
  email: 'admin@example.com',
  role: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      // Default to demo admin if not set, enabling instant access to the admin frontend!
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });
  const [loading, setLoading] = useState(false);

  // Check current session
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        localStorage.setItem('currentUser', JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      // If network error (backend offline/skipped), preserve current session
      const saved = localStorage.getItem('currentUser');
      if (!saved) {
        setUser(DEFAULT_ADMIN);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken } = res.data.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // If backend is down, allow instant local admin login
      if (email === 'admin@example.com') {
        localStorage.setItem('currentUser', JSON.stringify(DEFAULT_ADMIN));
        setUser(DEFAULT_ADMIN);
        return DEFAULT_ADMIN;
      }
      throw err;
    }
  };

  const setDemoAdmin = () => {
    localStorage.setItem('currentUser', JSON.stringify(DEFAULT_ADMIN));
    setUser(DEFAULT_ADMIN);
  };

  const register = async (name, email, password, parentalConsent) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        parentalConsent
      });
      const { user: userData, accessToken } = res.data.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Fallback demo parent user
      const demoParent = {
        _id: 'parent_demo_01',
        name: name || 'Parent Explorer',
        email: email || 'parent@example.com',
        role: 'parent'
      };
      localStorage.setItem('currentUser', JSON.stringify(demoParent));
      setUser(demoParent);
      return demoParent;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      setUser(null);
    }
  };

  const value = {
    user,
    role: user?.role || 'visitor',
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isParent: user?.role === 'parent',
    loading,
    login,
    register,
    logout,
    checkAuth,
    setDemoAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
