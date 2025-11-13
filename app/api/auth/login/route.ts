import { NextResponse } from "next/server";
import { readUsers } from "@/lib/local-storage";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const users = await readUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // In a real application, you would generate a token here
      const { password: _, ...userWithoutPassword } = foundUser; // Exclude password from response
      return NextResponse.json(
        { success: true, user: userWithoutPassword },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("API Login error:", error);
    return NextResponse.json(
      { success: false, error: "Error inesperado durante el login" },
      { status: 500 }
    );
  }
}
