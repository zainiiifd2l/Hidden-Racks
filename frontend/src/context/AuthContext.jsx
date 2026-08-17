import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hr_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("hr_jwt_token") || null);

  const login = async (email, password) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    if (res.access_token) {
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem("hr_jwt_token", res.access_token);
      localStorage.setItem("hr_user", JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    if (res.access_token) {
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem("hr_jwt_token", res.access_token);
      localStorage.setItem("hr_user", JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hr_jwt_token");
    localStorage.removeItem("hr_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
