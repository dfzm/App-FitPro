"use client";

import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected";
  type: "online" | "in-person";
  notes?: string;
  location?: string;
  price?: number;
}

export function BookingPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push("/");
      return;
    }

    const loadBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?userId=${user.id}`);
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

    loadBookings();
  }, [isLoggedIn, user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona tus sesiones de entrenamiento
          </p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {booking.trainerName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.time}</span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {booking.price}€
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === "accepted" && (
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  )}
                  {booking.status === "pending" && (
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  )}
                  {booking.status === "rejected" && (
                    <Button size="sm" variant="destructive">
                      Eliminar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No tienes reservas programadas
              </p>
              <Button onClick={() => router.push("/search")}>
                Buscar Entrenadores
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
