import { useState, useEffect } from "react";
import type { UserItem } from "../../../api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserItem | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  try {
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  } catch (e) {
    console.error("Failed to parse user JSON:", e);
    localStorage.removeItem("user");
  }
}, []);

  const login = (userData: UserItem) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};