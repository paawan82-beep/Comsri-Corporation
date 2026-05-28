import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize Supabase safely. Using fallback placeholders prevents compile/runtime
// crash if the user hasn't supplied environment variables yet.
export const supabase = createClient(
  supabaseUrl || "https://placeholder-id.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Helper function to check if Supabase environment variables are configured.
export const hasSupabaseConfig = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
