import { NextResponse } from "next/server";
import { createBooking, getBookingsForUser, readBookings, updateBookingStatus } from "@/lib/local-bookings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === "create") {
      const booking = await createBooking(body.booking);
      return NextResponse.json({ success: true, booking });
    }
    
    if (body.action === "update_status") {
      const booking = await updateBookingStatus(body.id, body.status);
      return NextResponse.json({ success: true, booking });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
  }

  const allBookings = await readBookings();
  let bookings = [];

  if (role === "trainer") {
    bookings = allBookings.filter(b => b.trainerId === userId);
  } else {
    bookings = allBookings.filter(b => b.clientId === userId);
  }

  return NextResponse.json({ success: true, bookings });
}
