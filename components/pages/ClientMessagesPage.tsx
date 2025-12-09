"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function ClientMessagesPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.type !== "client")) {
      router.push("/");
      return;
    }

    if (isLoggedIn && user?.type === "client") {
      fetchMessages();
    }
  }, [isLoggedIn, user, loading, router]);

  const fetchMessages = async () => {
    if (!user?.id) return;
    setMessagesLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Filter to only show messages sent TO the client (from trainers)
        const receivedMessages = data.messages.filter(
          (msg: any) => msg.receiverId === user.id
        );
        setMessages(receivedMessages);
      } else {
        throw new Error(data.error || "Error loading messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Error al cargar los mensajes.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_read",
          messageId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (err) {
      console.error("Error marking message as read:", err);
      setError("Error al marcar el mensaje como leído.");
    }
  };

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.type !== "client") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Mensajes</h1>
        
        {error && (
          <Card className="mb-4 border-red-500 bg-red-50">
            <CardContent className="p-4 text-red-700">{error}</CardContent>
          </Card>
        )}

        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-600">
              No tienes mensajes de entrenadores.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={
                  message.read ? "bg-gray-50" : "bg-white border-blue-200"
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span>De: {message.senderName}</span>
                      <p className="text-sm font-normal text-gray-500 mt-1">{message.subject}</p>
                    </div>
                    {!message.read && (
                      <span className="text-sm font-medium text-blue-600">
                        Nuevo
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{message.message}</p>
                  {!message.read && (
                    <Button
                      onClick={() => handleMarkAsRead(message.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como leído
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
