"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

interface AuthContextType {
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const token = localStorage.getItem("accessToken");
    return token;
  });

  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      signOut().then(() => {
        localStorage.removeItem("cart");
        router.push("/");
      });
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
};
