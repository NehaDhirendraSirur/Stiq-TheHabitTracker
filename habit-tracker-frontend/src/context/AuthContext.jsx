import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("stiq_token");
    const savedUser  = localStorage.getItem("stiq_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveSession = (token, user) => {
    localStorage.setItem("stiq_token", token);
    localStorage.setItem("stiq_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data.data;
    saveSession(token, user);
    return user;
  };

  const register = async ({ email, password, displayName, timezone }) => {
    const res = await authApi.register({ email, password, displayName, timezone });
    const { token, user } = res.data.data;
    saveSession(token, user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("stiq_token");
    localStorage.removeItem("stiq_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!token,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}