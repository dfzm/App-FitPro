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
  MessageSquare,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getMessagesForTrainer, markMessageAsRead } from "@/services/api";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  message: string;
  timestamp: string;
  read: boolean;
  createdAt: string;
}

export function ProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user?.type === "trainer") {
      const loadMessages = async () => {
        try {
          const trainerMessages = await getMessagesForTrainer(user.id);
          setMessages(trainerMessages);
        } catch (error) {
          console.error("Error loading messages:", error);
        } finally {
          setLoading(false);
        }
      };
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

              {/* Sección de mensajes para entrenadores */}
              {user?.type === "trainer" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mensajes de Clientes
                      {messages.filter((msg) => !msg.read).length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {messages.filter((msg) => !msg.read).length} nuevos
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Mensajes de clientes interesados en tus servicios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">
                        <p>Cargando mensajes...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No tienes mensajes aún</p>
                        <p className="text-sm text-gray-500">
                          Los mensajes de clientes aparecerán aquí
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`p-4 rounded-lg border ${
                                !message.read
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {message.clientName}
                                  </h4>
                                  {!message.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(message.createdAt)}
                                </div>
                              </div>

                              <p className="text-gray-700 mb-3">
                                {message.message}
                              </p>

                              {!message.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsRead(message.id)}
                                  className="text-xs"
                                >
                                  Marcar como leído
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
