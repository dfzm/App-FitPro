"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Navigation } from "@/components/Navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Home,
  MessageSquare,
  Calendar,
  User,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function TrainerDashboardPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.type !== "trainer")) {
      router.push("/");
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

  if (!isLoggedIn || user?.type !== "trainer") {
    return null; // Or a redirecting message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto" style={{ marginTop: "2rem" }}>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Activity className="h-4 w-4 text-gray-500" />
                Resumen de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">
                Sesiones completadas este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Calendar className="h-4 w-4 text-gray-500" />
                Próximas Sesiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">
                Tienes 3 sesiones programadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                Mensajes Nuevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500">
                2 mensajes sin leer de clientes
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Estadísticas de Rendimiento
              </CardTitle>
              <CardDescription>
                Visión general de tu progreso como entrenador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>Clientes activos: 42</li>
                <li>Valoración media: 4.8/5</li>
                <li>Sesiones totales: 156</li>
              </ul>
              <Button className="mt-4 w-full" variant="outline">
                Ver Estadísticas Detalladas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Últimas Actividades
              </CardTitle>
              <CardDescription>
                Tus interacciones recientes con clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>Sesión con Juan Pérez - 10/11/2025</li>
                <li>Mensaje de María García - 09/11/2025</li>
                <li>Nueva reserva de Carlos Ruiz - 08/11/2025</li>
              </ul>
              <Button className="mt-4 w-full" variant="outline">
                Ver Historial Completo
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Gestión de Perfil
              </CardTitle>
              <CardDescription>
                Actualiza tu información y disponibilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Mantén tu perfil actualizado para atraer a más clientes.
              </p>
              <Link href="/profile">
                <Button className="w-full">Editar Perfil</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
