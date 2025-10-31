"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { getTrainerById, sendMessage } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contactSchema, type ContactFormData } from "@/lib/validations";

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

interface ContactPageProps {
  trainerId: string;
}

export function ContactPage({ trainerId }: ContactPageProps) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

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
  }, [trainerId, isLoggedIn, router]);

  const onSubmit = async (data: ContactFormData) => {
    if (!user || !trainer) return;

    setSending(true);
    setError(null);

    try {
      await sendMessage({
        trainerId: trainer.id,
        trainerName: trainer.name,
        clientId: user.id,
        clientName: user.name,
        message: data.message,
      });

      setSuccess(true);
      reset();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <p>Cargando información del entrenador...</p>
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
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <p className="text-red-600">Entrenador no encontrado</p>
                  <Link href="/">
                    <Button className="mt-4">
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Mensaje enviado!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tu mensaje ha sido enviado a {trainer.name}. Te
                    redirigiremos al inicio en unos segundos.
                  </p>
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Contactar Entrenador
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Información del entrenador */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Entrenador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={trainer.image || "/placeholder.svg"}
                    alt={trainer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{trainer.name}</h3>
                    <p className="text-sm text-gray-600">{trainer.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Especialidades:</strong>{" "}
                    {trainer.specialties.join(", ")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Experiencia:</strong> {trainer.experience}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Precio:</strong> {trainer.price}
                  </p>
                </div>

                <p className="text-sm text-gray-700">{trainer.description}</p>
              </CardContent>
            </Card>

            {/* Formulario de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Enviar Mensaje
                </CardTitle>
                <CardDescription>
                  Envía un mensaje a {trainer.name} para iniciar una
                  conversación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="clientName">Tu nombre</Label>
                    <Input
                      id="clientName"
                      value={user?.name || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> No incluyas datos personales
                      como teléfono, correo electrónico o dirección en tu
                      mensaje. Esta información está prohibida por motivos de
                      seguridad y privacidad.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={sending || !isValid}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
