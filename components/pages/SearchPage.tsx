"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getTrainers } from "@/services/api";
import { MapPin, Star, Euro } from "lucide-react";
import Link from "next/link";

interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  location: string;
  rating: number;
  price: number;
  experience: number;
  image: string;
}

export function SearchPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrainers = async () => {
      const data = await getTrainers();
      setTrainers(data);
      setLoading(false);
    };
    loadTrainers();
  }, []);

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Buscar Entrenadores
          </h1>
          <Input
            placeholder="Buscar por nombre, ubicación o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Cargando entrenadores...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <Card
                key={trainer.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trainer.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{trainer.rating}</span>
                    <span className="text-sm text-gray-600">
                      • {trainer.experience} años exp.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {trainer.price}€/sesión
                      </span>
                    </div>
                    <Link href={`/trainer/${trainer.id}`}>
                      <Button size="sm">Ver Perfil</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTrainers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No se encontraron entrenadores con esos criterios.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
