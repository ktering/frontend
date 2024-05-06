"use client";

import { useRouter, usePathname } from "next/navigation";
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
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // console.log(token, pathname);
    if (!token && !["/fetch-user"].includes(pathname)) {
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
