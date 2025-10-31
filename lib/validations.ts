import { z } from "zod";

// User registration schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  email: z
    .string()
    .email("Ingresa un email válido")
    .min(1, "El email es requerido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
    ),
  userType: z.enum(["client", "trainer"], {
    required_error: "Debes seleccionar un tipo de usuario",
  }),
});

// User login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Ingresa un email válido")
    .min(1, "El email es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Contact form schema
export const contactSchema = z.object({
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "El mensaje no puede exceder 500 caracteres")
    .refine(
      (message) =>
        !/(telefono|teléfono|email|correo|móvil|movil|dirección|address)/i.test(
          message
        ),
      "No incluyas datos personales como teléfono, email o dirección en tu mensaje"
    ),
});

// Booking form schema
export const bookingSchema = z.object({
  trainerId: z.string().min(1, "Debes seleccionar un entrenador"),
  date: z.date({
    required_error: "Debes seleccionar una fecha",
    invalid_type_error: "Fecha inválida",
  }),
  time: z.string().min(1, "Debes seleccionar una hora"),
  type: z.enum(["online", "in-person"], {
    required_error: "Debes seleccionar el tipo de sesión",
  }),
  notes: z
    .string()
    .max(200, "Las notas no pueden exceder 200 caracteres")
    .optional(),
});

// Trainer profile schema (for trainers to complete their profile)
export const trainerProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  specialties: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos una especialidad")
    .max(5, "No puedes seleccionar más de 5 especialidades"),
  location: z.string().min(1, "La ubicación es requerida"),
  pricePerSession: z
    .number()
    .min(10, "El precio mínimo es 10€")
    .max(200, "El precio máximo es 200€"),
  experienceYears: z
    .number()
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(50, "Los años de experiencia no pueden exceder 50"),
  bio: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(300, "La descripción no puede exceder 300 caracteres"),
});

// Review schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "La valoración mínima es 1 estrella")
    .max(5, "La valoración máxima es 5 estrellas"),
  comment: z
    .string()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(200, "El comentario no puede exceder 200 caracteres")
    .optional(),
});

// Search filters schema
export const searchFiltersSchema = z.object({
  location: z.string().optional(),
  specialty: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(0).max(5).optional(),
});

// Type exports for form data
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type TrainerProfileFormData = z.infer<typeof trainerProfileSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>;
