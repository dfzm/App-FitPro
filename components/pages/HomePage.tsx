"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { TrainerCard } from "@/components/TrainerCard"
import Link from "next/link"
import { MapPin, Star, Users, Calendar, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { getTrainers } from "@/services/api"

export function HomePage() {
  const { user, isLoggedIn } = useAuth()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainerData = await getTrainers()
        setTrainers(trainerData.slice(0, 6)) // Show first 6 trainers
      } catch (error) {
        console.error("Error loading trainers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrainers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          {isLoggedIn ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {user?.name}!</h1>
              <p className="text-gray-600">Encuentra el entrenador personal perfecto en Extremadura</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">FitPro Connect</h1>
              <p className="text-xl text-gray-600 mb-4">
                Conecta con los mejores entrenadores personales de Extremadura
              </p>
              <p className="text-gray-500">
                Explora nuestros entrenadores certificados en Cáceres, Badajoz y toda la región
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Entrenadores Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">12+</p>
              <p className="text-sm text-gray-600">En Cáceres y Badajoz</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Valoración Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
              <p className="text-sm text-gray-600">Basado en reseñas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Ubicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">8</p>
              <p className="text-sm text-gray-600">Ciudades cubiertas</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Entrenadores Destacados</h2>
            <Link href="/search">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Search className="h-4 w-4" />
                Ver todos
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buscar Entrenadores</CardTitle>
                <CardDescription>Encuentra el entrenador perfecto para tus objetivos</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/search">
                  <Button className="w-full">Explorar Entrenadores</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mis Reservas</CardTitle>
                <CardDescription>Gestiona tus sesiones programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/booking">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Reservas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
