"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Send, User, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MessageClientPageProps {
  clientId: string;
  clientName?: string;
}

export function MessageClientPage({ clientId, clientName }: MessageClientPageProps) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [displayName, setDisplayName] = useState(clientName || "Cliente");
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ subject: "", message: "" });

  useEffect(() => {
    const loadClientName = async () => {
      if (!clientName && user?.id) {
        try {
          const response = await fetch(`/api/bookings?userId=${user.id}&role=trainer`);
          const data = await response.json();
          if (data.success) {
            const booking = data.bookings.find((b: any) => b.clientId === clientId);
            if (booking) {
              setDisplayName(booking.clientName);
            }
          }
        } catch (error) {
          console.error("Error loading client name:", error);
        }
      }
    };
    loadClientName();
  }, [clientId, clientName, user?.id]);

  const validateForm = () => {
    const newErrors = { subject: "", message: "" };
    let isValid = true;

    if (!subject.trim()) {
      newErrors.subject = "El asunto es requerido";
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = "El mensaje es requerido";
      isValid = false;
    } else if (message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !user) {
      alert("Debes iniciar sesión para enviar mensajes");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          messageData: {
            senderId: user.id,
            senderName: user.name,
            receiverId: clientId,
            receiverName: displayName,
            subject,
            message,
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
      } else {
        throw new Error(data.error || "Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Debes iniciar sesión para enviar mensajes.</p>
              <Button onClick={() => router.push("/")}>Volver al inicio</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h2>
              <p className="text-gray-600 mb-6">
                Tu mensaje ha sido enviado a {displayName}.
              </p>
              <Button onClick={() => router.push("/trainer-dashboard/reservations")}>
                Volver a Reservas
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Enviar mensaje a {displayName}</CardTitle>
                  <p className="text-sm text-gray-500">Cliente</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    placeholder="Ej: Sobre tu próxima sesión..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
