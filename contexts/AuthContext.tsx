"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
// import { readUsers, writeUsers } from "@/lib/local-storage";
// import { v4 as uuidv4 } from "uuid";
// import { supabase } from "@/lib/supabase";
// import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string;
  email: string;
  type: "client" | "trainer";
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    type: "client" | "trainer"
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate session check for local auth
    setLoading(false);
  }, []);

  // const loadUserProfile = async (userId: string) => {
  //   try {
  //     // Get user profile from profiles table
  //     const { data: profile, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();

  //     if (error) {
  //       console.error("Error loading user profile:", error);
  //       setLoading(false);
  //       return;
  //     }

  //     if (profile) {
  //       setUser({
  //         id: profile.id,
  //         name: profile.name,
  //         email: profile.email,
  //         type: profile.user_type,
  //       });
  //       setIsLoggedIn(true);
  //     }
  //   } catch (error) {
  //     console.error("Error loading user profile:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        // Store user data in session storage for client-side persistence
        sessionStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Credenciales incorrectas",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error inesperado durante el login" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    type: "client" | "trainer"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, type }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        // Store user data in session storage for client-side persistence
        sessionStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Error en el registro" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Error inesperado durante el registro" };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsLoggedIn(false);
      sessionStorage.removeItem("user"); // Clear user data from session storage
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Add a useEffect to load user from session storage on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (isLoggedIn && user) {
        if (user.type === "trainer") {
          router.push("/trainer-dashboard");
        } else {
          router.push("/");
        }
      } else {
        router.push("/"); // Redirect to home if not logged in
      }
    }
  }, [isLoggedIn, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, login, register, logout }}
    >
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
