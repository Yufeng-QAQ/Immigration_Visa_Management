import { createContext, useContext } from "react";
import type { UserItem } from "../../../api";

interface AuthContextType {
  user: UserItem | null;
  login: (user: UserItem) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
