import { NextResponse } from "next/server";
import { createMessage, getMessagesForUser, markMessageAsRead } from "@/lib/local-messages";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === "create") {
      const message = await createMessage(body.messageData);
      return NextResponse.json({ success: true, message });
    }
    
    if (body.action === "mark_read") {
      const message = await markMessageAsRead(body.messageId);
      return NextResponse.json({ success: true, message });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Message API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
  }

  const messages = await getMessagesForUser(userId);
  return NextResponse.json({ success: true, messages });
}
