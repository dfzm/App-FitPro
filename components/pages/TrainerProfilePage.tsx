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
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Award,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle,
  Heart,
  Share2,
} from "lucide-react";
import { getTrainerById } from "@/services/api";
import { LoginModal } from "@/components/auth/LoginModal";
import { BookingModal } from "@/components/booking/BookingModal";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  experience: string;
  description: string;
}

interface TrainerProfilePageProps {
  trainerId: string;
}

export function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"booking" | "message" | null>(null);

  useEffect(() => {
    const loadTrainer = async () => {
      try {
        const trainerData = await getTrainerById(trainerId);
        setTrainer(trainerData);
      } catch (error) {
        console.error("Error loading trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainer();
  }, [trainerId]);

  useEffect(() => {
    if (isLoggedIn && pendingAction) {
      if (pendingAction === "booking") {
        setShowBookingModal(true);
      } else if (pendingAction === "message") {
        router.push(`/contact/${trainerId}`);
      }
      setPendingAction(null);
    }
  }, [isLoggedIn, pendingAction, trainerId, router]);

  const handleContact = () => {
    if (!isLoggedIn) {
      setPendingAction("message");
      setShowLoginModal(true);
      return;
    }
    router.push(`/contact/${trainerId}`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aquí podrías guardar en localStorage o base de datos
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${trainer?.name}`,
        text: `Mira el perfil de ${trainer?.name} en FitPro Connect`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      setPendingAction("booking");
      setShowLoginModal(true);
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Cargando perfil del entrenador...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Entrenador no encontrado</p>
                  <Link href="/">
                    <Button>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver al inicio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con navegación */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>

          {/* Perfil principal */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <img
                    src={trainer.image || "/placeholder.svg"}
                    alt={trainer.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {trainer.name}
                      </h1>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {trainer.rating}
                          </span>
                          <span className="text-blue-100">
                            ({trainer.reviews} reseñas)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{trainer.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{trainer.experience}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFavorite}
                        className={`${
                          isFavorite
                            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                            : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            isFavorite ? "fill-current" : ""
                          }`}
                        />
                        Favorito
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                    </div>
                  </div>

                  <p className="text-blue-100 text-lg leading-relaxed">
                    {trainer.description}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Especialidades */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="text-sm"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Precio por Sesión
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {trainer.price}
                  </p>
                  <p className="text-sm text-gray-600">Sesión individual</p>
                </div>

                {/* Acciones */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contactar
                  </h3>
                  <div className="space-y-2">
                    <Button onClick={handleContact} className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleBooking}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar Sesión
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sobre el entrenador */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre {trainer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Certificaciones</p>
                      <p className="text-sm text-gray-600">
                        Entrenador Personal Certificado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Clientes Atendidos</p>
                      <p className="text-sm text-gray-600">
                        Más de {trainer.reviews * 2} clientes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Experiencia</p>
                      <p className="text-sm text-gray-600">
                        {trainer.experience} de experiencia
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horarios y disponibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Lunes - Viernes</span>
                    <span className="text-sm text-gray-600">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Sábados</span>
                    <span className="text-sm text-gray-600">9:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Domingos</span>
                    <span className="text-sm text-gray-600">Cerrado</span>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Disponible para sesiones online y presenciales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reseñas (placeholder) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Reseñas de Clientes ({trainer.reviews})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {trainer.name} tiene una valoración promedio de{" "}
                  {trainer.rating}/5 estrellas
                </p>
                <p className="text-sm text-gray-500">
                  Las reseñas detalladas estarán disponibles próximamente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {trainer && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          trainerId={trainer.id}
          trainerName={trainer.name}
          pricePerSession={parseInt(trainer.price.replace(/\D/g, "")) || 35}
        />
      )}
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
