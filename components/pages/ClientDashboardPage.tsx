"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, MessageSquare } from "lucide-react";
import { Navigation } from "@/components/Navigation";


export function ClientDashboardPage() {
  // Mock data for active hiring/contract
  const activeContract = {
    id: "1",
    trainerName: "Carlos Rodríguez",
    trainerSpecialty: "Entrenamiento Funcional & Hipertrofia",
    planName: "Plan Premium - 3 Meses",
    startDate: "15 Nov 2023",
    endDate: "15 Feb 2024",
    status: "active",
    nextSession: "Mañana, 10:00 AM",
    sessionsLeft: 24,
    progress: 15, // percentage
  };

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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Plan de Entrenamiento
                  </Button>
                  <Button variant="ghost" className="w-full text-gray-600">
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
