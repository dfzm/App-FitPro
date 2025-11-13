"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Star,
  // MessageSquare, // Removed as messages are moved
  // Clock, // Removed as messages are moved
} from "lucide-react";
import { useState, useEffect } from "react";
// import { getMessagesForTrainer, markMessageAsRead } from "@/services/api"; // Removed as messages are moved
import { useRouter } from "next/navigation";

// interface Message { ... } // Removed as messages are moved

export function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth(); // Use authLoading to avoid conflict
  const router = useRouter();
  // const [messages, setMessages] = useState<Message[]>([]); // Removed as messages are moved
  const [loading, setLoading] = useState(true); // Keep loading for initial auth check

  // Redirigir si no está logueado
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    setLoading(authLoading); // Set loading based on auth context loading
  }, [authLoading]);

  // const handleMarkAsRead = async (messageId: string) => { ... }; // Removed as messages are moved

  // const formatDate = (dateString: string) => { ... }; // Removed as messages are moved

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!isLoggedIn ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <p>Redirigiendo...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user?.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge
                          variant={
                            user?.type === "trainer" ? "default" : "secondary"
                          }
                        >
                          {user?.type === "trainer"
                            ? "Entrenador Personal"
                            : "Cliente"}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{user?.email}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        Ubicación
                      </div>
                      <p className="font-medium">Cáceres, Extremadura</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Miembro desde
                      </div>
                      <p className="font-medium">Enero 2024</p>
                    </div>

                    {user?.type === "trainer" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4" />
                          Valoración
                        </div>
                        <p className="font-medium">4.8/5 (24 reseñas)</p>
                      </div>
                    )}
                  </div>

                  {user?.type === "trainer" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Especialidades</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Pérdida de peso</Badge>
                        <Badge>Fuerza</Badge>
                        <Badge>Funcional</Badge>
                        <Badge>Rehabilitación</Badge>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-semibold">Estadísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {user?.type === "trainer" ? "156" : "12"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user?.type === "trainer"
                            ? "Sesiones impartidas"
                            : "Sesiones completadas"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {user?.type === "trainer" ? "42" : "3"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user?.type === "trainer"
                            ? "Clientes activos"
                            : "Entrenadores favoritos"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">6</p>
                        <p className="text-sm text-gray-600">Meses activo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          98%
                        </p>
                        <p className="text-sm text-gray-600">Satisfacción</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">Editar Perfil</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Configuración
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
