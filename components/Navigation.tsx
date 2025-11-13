"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Calendar,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

export function Navigation() {
  const { isLoggedIn, logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Redirigir al home después del logout
    router.push("/");
  };

  let navItems = [];

  if (isLoggedIn) {
    if (user?.type === "trainer") {
      navItems = [
        {
          href: "/trainer-dashboard",
          icon: LayoutDashboard,
          label: "Dashboard",
        },
        { href: "/booking", icon: Calendar, label: "Reservas" },
        { href: "/trainer-messages", icon: MessageSquare, label: "Mensajes" },
        { href: "/profile", icon: User, label: "Perfil" },
      ];
    } else {
      // Client user
      navItems = [
        { href: "/", icon: Home, label: "Inicio" },
        { href: "/search", icon: Search, label: "Buscar" },
        { href: "/booking", icon: Calendar, label: "Reservas" },
        { href: "/profile", icon: User, label: "Perfil" },
      ];
    }
  } else {
    navItems = [
      { href: "/", icon: Home, label: "Inicio" },
      { href: "/search", icon: Search, label: "Buscar" },
    ];
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              FitPro Connect
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Acceder
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-white">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 text-xs ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
