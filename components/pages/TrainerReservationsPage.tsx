"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MessageSquare, Check, X, FileText } from "lucide-react";
import { Booking } from "@/lib/local-bookings";
import { Navigation } from "@/components/Navigation";


export function TrainerReservationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user?.id]);

  const loadBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${user?.id}&role=trainer`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: "accepted" | "rejected") => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          id: bookingId,
          status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status } : b
        ));
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando reservas...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <Navigation />
      <main className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8">Gestión de Reservas</h1>

       <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No tienes reservas pendientes.
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{booking.clientName}</h3>
                          <p className="text-sm text-gray-500">Cliente</p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          booking.status === "accepted" ? "default" : 
                          booking.status === "rejected" ? "destructive" : "secondary"
                        }
                      >
                        {booking.status === "accepted" ? "Aceptada" : 
                         booking.status === "rejected" ? "Rechazada" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Tipo:</span>
                        <span className="capitalize">{booking.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Precio:</span>
                        <span>{booking.price}€</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                        <span className="font-medium">Notas:</span> {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    {booking.status === "pending" && (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(booking.id, "accepted")}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aceptar
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleStatusUpdate(booking.id, "rejected")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/message-client/${booking.clientId}`)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Mensaje
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-gray-600"
                      onClick={() => router.push(`/trainer-dashboard/contract/${booking.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Detalles del contrato
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
       </div>
      </main>
    </div>
  );
}
