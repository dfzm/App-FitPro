"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, MessageSquare } from "lucide-react";
import { Navigation } from "@/components/Navigation";


import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrainerById } from "@/services/api";

export function ClientDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeContract, setActiveContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActiveBooking();
    }
  }, [user]);

  const loadActiveBooking = async () => {
    try {
      // Get booking info
      const response = await fetch(`/api/user/active-booking?userId=${user?.id}`);
      const data = await response.json();

      if (data.success && data.hasActiveBooking) {
        const booking = data.booking;
        
        // Get trainer details (we need specialty logic or fetch trainer again)
        // Since booking has trainerName but not specialty, we might want to fetch trainer or just mock specialty for now if not stored.
        // Let's try to fetch trainer details to get specialty.
        let trainerDetails = { specialties: ["Entrenamiento Personal"] };
        try {
           const trainerData = await getTrainerById(booking.trainerId);
           if(trainerData) trainerDetails = trainerData;
        } catch(e) {
           console.log("Could not fetch full trainer details");
        }

        setActiveContract({
          id: booking.id,
          trainerId: booking.trainerId, // Add trainerId
          trainerName: booking.trainerName,
          trainerSpecialty: trainerDetails.specialties[0] || "General",
          planName: `Sesión: ${booking.type}`,
          startDate: new Date(booking.date).toLocaleDateString(),
          endDate: "N/A", // This is a single session booking system mainly
          status: "active",
          nextSession: `${booking.date} ${booking.time}`,
          sessionsLeft: 1, // Logic for packages not fully impl yet
          progress: 0,
        });
      } else {
        // Redirect if no active booking (double check safety)
        router.push("/");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando dashboard...</div>;
  }

  if (!activeContract) {
    return null; // Should redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Active Contract Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Entrenador Actual
          </h2>
          
          <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{activeContract.trainerName}</h3>
                      <p className="text-blue-600 font-medium">{activeContract.trainerSpecialty}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Activo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Plan Actual</p>
                        <p className="font-medium text-gray-900">{activeContract.planName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Próxima Sesión</p>
                        <p className="font-medium text-gray-900">{activeContract.nextSession}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/contact/${activeContract.trainerId}`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Plan de Entrenamiento
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-600"
                    onClick={() => router.push(`/client-dashboard/contract/${activeContract.id}`)}
                  >
                    Detalles del Contrato
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sesiones Restantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeContract.sessionsLeft}</div>
              <p className="text-xs text-gray-500 mt-1">De 30 sesiones totales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Días Restantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">85</div>
              <p className="text-xs text-gray-500 mt-1">Hasta {activeContract.endDate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Progreso del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeContract.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${activeContract.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
