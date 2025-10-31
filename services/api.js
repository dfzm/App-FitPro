import { supabase } from "@/lib/supabase";

// Initialize default trainers if database is empty
const initializeDefaultTrainers = async () => {
  try {
    const { data: existingTrainers } = await supabase
      .from("trainers")
      .select("id")
      .limit(1);

    if (existingTrainers && existingTrainers.length > 0) {
      return; // Already initialized
    }

    // Create default trainers
    const defaultTrainers = [
      {
        name: "Carlos Rodríguez",
        specialties: ["Pérdida de peso", "Fuerza"],
        location: "Cáceres",
        price_per_session: 35.0,
        experience_years: 5,
        bio: "Especialista en transformaciones corporales y entrenamiento funcional.",
        avatar_url: "/fitness-trainer-man.png",
      },
      {
        name: "María González",
        specialties: ["Yoga", "Pilates"],
        location: "Badajoz",
        price_per_session: 30.0,
        experience_years: 7,
        bio: "Instructora certificada en yoga y pilates con enfoque holístico.",
        avatar_url: "/yoga-instructor-woman.png",
      },
      {
        name: "Javier Martín",
        specialties: ["CrossFit", "Funcional"],
        location: "Cáceres",
        price_per_session: 40.0,
        experience_years: 4,
        bio: "Entrenador de CrossFit nivel 2, especializado en acondicionamiento físico.",
        avatar_url: "/crossfit-trainer-man.jpg",
      },
      {
        name: "Ana Fernández",
        specialties: ["Rehabilitación", "Tercera edad"],
        location: "Mérida",
        price_per_session: 32.0,
        experience_years: 8,
        bio: "Fisioterapeuta y entrenadora especializada en rehabilitación deportiva.",
        avatar_url: "/physiotherapy-trainer-woman.jpg",
      },
      {
        name: "David López",
        specialties: ["Boxeo", "Defensa personal"],
        location: "Badajoz",
        price_per_session: 38.0,
        experience_years: 6,
        bio: "Entrenador de boxeo y artes marciales con experiencia competitiva.",
        avatar_url: "/boxing-trainer-man.jpg",
      },
      {
        name: "Laura Sánchez",
        specialties: ["Nutrición deportiva", "Fitness"],
        location: "Plasencia",
        price_per_session: 35.0,
        experience_years: 5,
        bio: "Nutricionista deportiva y entrenadora personal certificada.",
        avatar_url: "/nutrition-fitness-trainer-woman.jpg",
      },
    ];

    const { data, error } = await supabase
      .from("trainers")
      .insert(defaultTrainers)
      .select();

    if (error) {
      console.error("Error initializing trainers:", error);
    } else {
      console.log("Default trainers initialized successfully");
    }
  } catch (error) {
    console.error("Error in initializeDefaultTrainers:", error);
  }
};

// Get all trainers
export const getTrainers = async () => {
  try {
    await initializeDefaultTrainers();

    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching trainers:", error);
      return [];
    }

    return data.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      specialties: trainer.specialties,
      location: trainer.location,
      rating: trainer.rating,
      reviews: trainer.review_count,
      price: `${trainer.price_per_session}€/sesión`,
      image: trainer.avatar_url || "/placeholder.svg",
      experience: `${trainer.experience_years} años`,
      description: trainer.bio,
    }));
  } catch (error) {
    console.error("Error in getTrainers:", error);
    return [];
  }
};

// Get trainer by ID
export const getTrainerById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching trainer:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      specialties: data.specialties,
      location: data.location,
      rating: data.rating,
      reviews: data.review_count,
      price: `${data.price_per_session}€/sesión`,
      image: data.avatar_url || "/placeholder.svg",
      experience: `${data.experience_years} años`,
      description: data.bio,
    };
  } catch (error) {
    console.error("Error in getTrainerById:", error);
    return null;
  }
};

// Search trainers with filters
export const searchTrainers = async (filters = {}) => {
  try {
    let query = supabase.from("trainers").select("*");

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.specialty) {
      query = query.contains("specialties", [filters.specialty]);
    }

    const { data, error } = await query.order("rating", { ascending: false });

    if (error) {
      console.error("Error searching trainers:", error);
      return [];
    }

    return data.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      specialties: trainer.specialties,
      location: trainer.location,
      rating: trainer.rating,
      reviews: trainer.review_count,
      price: `${trainer.price_per_session}€/sesión`,
      image: trainer.avatar_url || "/placeholder.svg",
      experience: `${trainer.experience_years} años`,
      description: trainer.bio,
    }));
  } catch (error) {
    console.error("Error in searchTrainers:", error);
    return [];
  }
};

// Send message
export const sendMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: messageData.clientId,
        receiver_id: messageData.trainerId, // This should be the trainer's user_id
        trainer_id: messageData.trainerId,
        content: messageData.message,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return {
      id: data.id,
      trainer_id: data.trainer_id,
      trainer_name: messageData.trainerName,
      client_id: data.sender_id,
      client_name: messageData.clientName,
      message: data.content,
      read: data.is_read,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

// Get messages for trainer
export const getMessagesForTrainer = async (trainerId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!sender_id(name)
      `
      )
      .eq("trainer_id", trainerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data.map((msg) => ({
      id: msg.id,
      trainer_id: msg.trainer_id,
      trainer_name: "Entrenador", // You might want to get this from trainers table
      client_id: msg.sender_id,
      client_name: msg.sender?.name || "Usuario",
      message: msg.content,
      read: msg.is_read,
      created_at: msg.created_at,
    }));
  } catch (error) {
    console.error("Error in getMessagesForTrainer:", error);
    return [];
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    throw error;
  }
};

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        client_id: bookingData.clientId,
        trainer_id: bookingData.trainerId,
        session_date: bookingData.date,
        session_time: bookingData.time,
        session_type: bookingData.type,
        notes: bookingData.notes,
        price: bookingData.price,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};

// Get bookings for user
export const getBookingsForUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        trainer:trainers(name, avatar_url)
      `
      )
      .eq("client_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }

    return data.map((booking) => ({
      id: booking.id,
      trainerId: booking.trainer_id,
      trainerName: booking.trainer?.name || "Entrenador",
      clientId: booking.client_id,
      clientName: "Usuario", // You might want to get this from profiles
      date: booking.session_date,
      time: booking.session_time,
      status: booking.status,
      type: booking.session_type,
      notes: booking.notes,
    }));
  } catch (error) {
    console.error("Error in getBookingsForUser:", error);
    return [];
  }
};
