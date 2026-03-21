import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore user from localStorage on reload
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('halleyx_user')) || null; }
    catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('halleyx_token', data.token);
    localStorage.setItem('halleyx_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('halleyx_token', data.token);
    localStorage.setItem('halleyx_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('halleyx_token');
    localStorage.removeItem('halleyx_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const merged = { ...user, ...updates };
    localStorage.setItem('halleyx_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
