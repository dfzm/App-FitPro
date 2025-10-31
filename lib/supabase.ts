import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://paiqikzlfygzlbawqfus.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaXFpa3psZnlnemxiYXdxZnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTM0NDAsImV4cCI6MjA3MzAyOTQ0MH0.keF4RHJnA5DAQt0PUP52khsshh2vr7XoGxq9pJ0--nY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
