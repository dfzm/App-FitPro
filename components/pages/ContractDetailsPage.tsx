"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ContractDetailsPageProps {
  bookingId: string;
}

export function ContractDetailsPage({ bookingId }: ContractDetailsPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/bookings?userId=${user?.id}`);
        const data = await response.json();
        if (data.success) {
          const foundBooking = data.bookings.find((b: any) => b.id === bookingId);
          setBooking(foundBooking);
        }
      } catch (error) {
        console.error("Error loading booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && bookingId) {
      loadBooking();
    }
  }, [user?.id, bookingId]);

  const handleDownloadPDF = () => {
    // Use browser's native print functionality - user can save as PDF
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando contrato...</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center text-red-600">No se encontró el contrato.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
          <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-12 min-h-[800px] bg-white text-gray-900">
            <div className="flex items-center justify-between border-b pb-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                   <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">FitPro Connect</h1>
                  <p className="text-sm text-gray-500">Contrato de Servicio</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">REFERENCIA</p>
                <p className="text-gray-500 text-sm">#{booking.id}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wide">Acuerdo de Entrenamiento</h2>
                <p className="text-gray-500 mt-2">Fecha de emisión: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-semibold text-gray-500 uppercase mb-2">Cliente</div>
                  <div className="font-bold text-lg">{user?.name || "Cliente"}</div>
                  <div className="text-gray-600">{user?.email}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-500 uppercase mb-2">Entrenador</div>
                  <div className="font-bold text-lg">{booking.trainerName}</div>
                  <div className="text-gray-600">ID: {booking.trainerId}</div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mt-8">
                <div className="bg-gray-100 p-4 font-semibold grid grid-cols-4 gap-4">
                  <div className="col-span-2">Concepto</div>
                  <div>Fecha</div>
                  <div className="text-right">Precio</div>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4 border-t">
                  <div className="col-span-2">
                    <div className="font-medium">Sesión: {booking.type}</div>
                    <div className="text-sm text-gray-500">{booking.notes || "Sin notas adicionales"}</div>
                  </div>
                  <div className="text-gray-600">{booking.date} {booking.time}</div>
                  <div className="text-right font-bold">{booking.price}€</div>
                </div>
              </div>

              <div className="mt-12 text-sm text-gray-500 text-justify">
                <h3 className="font-bold text-gray-900 mb-2">Términos y Condiciones</h3>
                <p>
                  1. Este documento sirve como comprobante de la reserva realizada a través de la plataforma FitPro Connect.
                  2. El cliente se compromete a asistir a la sesión en la fecha y hora indicadas.
                  3. Las cancelaciones deben realizarse con al menos 24 horas de antelación.
                  4. El entrenador se compromete a prestar el servicio de entrenamiento acordado durante el tiempo estipulado.
                </p>
              </div>

              <div className="mt-20 grid grid-cols-2 gap-12 text-center">
                 <div>
                    <div className="border-b border-gray-300 mb-4 h-12"></div>
                    <p className="font-medium">Firma del Cliente</p>
                 </div>
                 <div>
                    <div className="border-b border-gray-300 mb-4 h-12"></div>
                    <p className="font-medium">Firma del Entrenador</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
