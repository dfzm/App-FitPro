import { NextResponse } from "next/server";
import { readBookings } from "@/lib/local-bookings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  try {
    const bookings = await readBookings();
    
    // Find if the user has any accepted booking
    // This defines if they have an "Active Trainer" relationship
    const activeBooking = bookings.find(
      (b) => b.clientId === userId && b.status === "accepted"
    );

    return NextResponse.json({ 
      success: true, 
      hasActiveBooking: !!activeBooking,
      booking: activeBooking || null 
    });

  } catch (error) {
    console.error("Error checking active booking:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
