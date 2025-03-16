"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";

interface AuthContextType {
  token: string | null;
  id: string | null;
  setToken: (token: string | null) => void;
  setId: (id: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  id:null,
  setToken: () => { },
  setId: () => { },
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  });
  const [id, setIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("id");
    }
    return null;
  });
  const router = useRouter();

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
    } else {
      localStorage.removeItem("auth_token");
      deleteCookie("auth_token");
    }
  };

  const setId = (newId: string | null) => {
    setIdState(newId);
    if (newId) {
      localStorage.setItem("id", newId);
    } else {
      localStorage.removeItem("id");
      deleteCookie("id");
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      setCookie("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
      deleteCookie("auth_token");
    }
    if (id) {
      localStorage.setItem("id", id);
      setCookie("id", id);
    } else {
      localStorage.removeItem("id");
      deleteCookie("id");
    }
  }, [token, id]);

  const isAuthenticated = !!token;

  const logout = () => {
    setToken(null);
    localStorage.removeItem("auth_token");
    deleteCookie("auth_token");
    router.push("/sign-in");
  };

  const value = {
    token,
    setToken,
    id,
    setId,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
