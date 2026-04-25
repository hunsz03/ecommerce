import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, use Supabase
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: "user-" + Date.now(),
      email,
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "customer",
    };
    setUser(mockUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser: User = {
      id: "user-" + Date.now(),
      email,
      name,
      role: "customer",
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
