"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export type User = {
  email: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  fetchUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  fetchUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o usuário logado
  async function fetchUser() {
    setLoading(true);
    try {
      const res = await authenticatedFetch("/api/auth/profile", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401) {
        setUser(null); 
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const publicPaths = ["/login", "/sign", "/", "/onboarding"]; 
    if (!publicPaths.includes(pathname) && !user) {
      fetchUser();
    } else {
      setLoading(false); // garante que loading não trava em rotas públicas
    }
  }, [pathname, user]);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
