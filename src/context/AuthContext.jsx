import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = لسه بنتأكد

  const checkAuth = async () => {
    try {
      await axiosInstance.get("/auth/me");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setIsAuthenticated(false);
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
