import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./queryClient";

export type AuthUser = {
  id: string;
  username: string;
  role: "admin" | "customer";
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });
      const data = typeof response === 'object' ? response : response;
      setUser(data as AuthUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/signup", {
        username,
        password,
      });
      const data = typeof response === 'object' ? response : response;
      setUser(data as AuthUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
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
