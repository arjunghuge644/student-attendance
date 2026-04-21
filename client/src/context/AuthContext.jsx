import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_DOMAIN || "moderncoe.edu.in";
const STORAGE_KEY = "attendx_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).user : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).token : null;
    } catch {
      return null;
    }
  });
  const [authError, setAuthError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setAuthError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Authentication failed");
      }

      const data = await response.json(); // { user, token }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setUser(data.user);
      setToken(data.token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const generateGuestLogin = async (role) => {
    setAuthError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Guest authentication failed");
      }

      const data = await response.json();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setUser(data.user);
      setToken(data.token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const loginAsGuest = () => generateGuestLogin('admin');
  const loginAsFaculty = () => generateGuestLogin('faculty');





  const handleGoogleError = () => {
    setAuthError("Google Sign-In failed. Please try again.");
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  const getAuthHeader = () => ({
    "Authorization": `Bearer ${token}`
  });

  return (
    <AuthContext.Provider
      value={{ user, token, authError, handleGoogleSuccess, handleGoogleError, logout, loginAsGuest, loginAsFaculty, clearError, ALLOWED_DOMAIN, getAuthHeader }}
    >

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

