import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { NextAuthOptions } from "next-auth";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && supabaseUrl) {
        const supabase = getSupabase();
        await supabase?.from("users").upsert(
          {
            email: user.email,
            name: user.name || "",
            avatar: user.image || "",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email && supabaseUrl) {
        const supabase = getSupabase();
        if (!supabase) return session;
        const { data } = await supabase
          .from("users")
          .select("plan, plan_expires_at")
          .eq("email", session.user.email)
          .single();

        if (data) {
          (session.user as any).plan = data.plan || "free";
          (session.user as any).planExpiresAt = data.plan_expires_at;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
