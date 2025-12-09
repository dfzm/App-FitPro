"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
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

interface TrainerCardProps {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"booking" | null>(null);
  const router = useRouter();

  // Handle pending action after login
  if (isLoggedIn && pendingAction === "booking") {
    setShowBookingModal(true);
    setPendingAction(null);
  }

  const handleBooking = () => {
    if (!isLoggedIn) {
      setPendingAction("booking");
      setShowLoginModal(true);
    } else {
      setShowBookingModal(true);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={trainer.image || "/placeholder.svg"}
              alt={trainer.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90">
                {trainer.price}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{trainer.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{trainer.rating}</span>
              <span className="text-sm text-gray-500">({trainer.reviews})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{trainer.location}</span>
            <Clock className="h-4 w-4 text-gray-500 ml-2" />
            <span className="text-sm text-gray-600">{trainer.experience}</span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {trainer.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {trainer.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleBooking} className="flex-1">
              Reservar
            </Button>
            <Link href={`/trainer/${trainer.id}`}>
              <Button variant="outline" className="flex-1 bg-transparent">
                Ver Perfil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          trainerId={trainer.id}
          trainerName={trainer.name}
          pricePerSession={parseInt(trainer.price.replace(/\D/g, "")) || 35}
        />
    </>
  );
}
