import { promises as fs } from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "lib", "local-auth.json");

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // For local testing, we'll store password directly
  type: "client" | "trainer";
}

export async function readUsers(): Promise<LocalUser[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File does not exist, return empty array
      await fs.writeFile(USERS_FILE, "[]", "utf8");
      return [];
    }
    console.error("Error reading users file:", error);
    throw error;
  }
}

export async function writeUsers(users: LocalUser[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing users file:", error);
    throw error;
  }
}
