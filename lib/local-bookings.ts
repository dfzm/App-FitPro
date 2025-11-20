import { promises as fs } from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "lib", "local-bookings.json");

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  trainerId: string;
  trainerName: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  price: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export async function readBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
      return [];
    }
    console.error("Error reading bookings file:", error);
    return [];
  }
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  try {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing bookings file:", error);
    throw error;
  }
}

export async function createBooking(booking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  const bookings = await readBookings();
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  await writeBookings(bookings);
  return newBooking;
}

export async function updateBookingStatus(id: string, status: "accepted" | "rejected"): Promise<Booking | null> {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index].status = status;
  await writeBookings(bookings);
  return bookings[index];
}
