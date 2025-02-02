import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    role: "farmer" | "buyer"
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get<{ success: boolean; user: User }>("/auth/me")
        .then((response) => {
          if (response.data.success) {
            setUser(response.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: "farmer" | "buyer"
  ) => {
    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
      fullName,
      role,
    });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
