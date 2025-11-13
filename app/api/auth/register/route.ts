import { NextResponse } from "next/server";
import { readUsers, writeUsers } from "@/lib/local-storage";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { name, email, password, type } = await request.json();

    const users = await readUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password,
      type,
    };
    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("API Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Error inesperado durante el registro" },
      { status: 500 }
    );
  }
}
