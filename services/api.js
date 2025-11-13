import { supabase } from "@/lib/supabase";
import { demoTrainers } from "@/lib/demo-trainers";

const useDemoData =
  process.env.NEXT_PUBLIC_USE_DEMO_DATA === "true" ||
  !process.env.NEXT_PUBLIC_USE_DEMO_DATA;

const toTrainerCard = (trainer) => ({
  id: trainer.id,
  name: trainer.name,
  specialties: trainer.specialties || [],
  location: trainer.location || "Extremadura",
  rating:
    typeof trainer.rating === "number"
      ? trainer.rating
      : typeof trainer.review_score === "number"
      ? trainer.review_score
      : 4.8,
  reviews:
    typeof trainer.review_count === "number"
      ? trainer.review_count
      : typeof trainer.reviews === "number"
      ? trainer.reviews
      : 24,
  price: `${trainer.price_per_session ?? trainer.price ?? 35}€/sesión`,
  image: trainer.avatar_url || trainer.image || "/placeholder.svg",
  experience: `${trainer.experience_years ?? trainer.experience ?? 5} años`,
  description:
    trainer.bio ||
    trainer.description ||
    "Entrenador personal especializado en programas personalizados.",
});

const getDemoTrainerCards = () => demoTrainers.map(toTrainerCard);

// Get all trainers
export const getTrainers = async () => {
  if (useDemoData) {
    return getDemoTrainerCards();
  }

  try {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching trainers:", error);
      return [];
      return getDemoTrainerCards();
    }

    if (!data || data.length === 0) {
      return getDemoTrainerCards();
    }

    return data.map(toTrainerCard);
  } catch (error) {
    console.error("Error in getTrainers:", error);
    return getDemoTrainerCards();
  }
};

// Get trainer by ID
export const getTrainerById = async (id) => {
  if (useDemoData) {
    const trainer = getDemoTrainerCards().find(
      (demoTrainer) => demoTrainer.id === id
    );
    return trainer || null;
  }

  try {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching trainer:", error);
      return null;
      return getTrainerByIdFromDemo(id);
    }

    return toTrainerCard(data);
  } catch (error) {
    console.error("Error in getTrainerById:", error);
    return getTrainerByIdFromDemo(id);
  }
};

const getTrainerByIdFromDemo = (id) =>
  getDemoTrainerCards().find((trainer) => trainer.id === id) || null;

// Search trainers with filters
export const searchTrainers = async (filters = {}) => {
  if (useDemoData) {
    return searchDemoTrainers(filters);
  }

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
      return searchDemoTrainers(filters);
    }

    if (!data) {
      return searchDemoTrainers(filters);
    }

    return data.map(toTrainerCard);
  } catch (error) {
    console.error("Error in searchTrainers:", error);
    return searchDemoTrainers(filters);
  }
};

const searchDemoTrainers = (filters = {}) => {
  const normalizedLocation = filters.location?.toLowerCase() || "";
  const normalizedSpecialty = filters.specialty?.toLowerCase() || "";

  return getDemoTrainerCards().filter((trainer) => {
    const matchesLocation = normalizedLocation
      ? trainer.location.toLowerCase().includes(normalizedLocation)
      : true;

    const matchesSpecialty = normalizedSpecialty
      ? trainer.specialties.some((specialty) =>
          specialty.toLowerCase().includes(normalizedSpecialty)
        )
      : true;

    return matchesLocation && matchesSpecialty;
  });
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
