import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session, Profile } from "next-auth";
import connectToDatabase from "@/lib/dbconnect";
import { validateAndPrepareGoogleUser } from "@/lib/models/user";

// Strictly type custom properties on the user session interface
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      username?: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    // Removed the unused 'account' property to satisfy the strict ESLint rule
    async signIn({ profile }: { profile?: Profile & { picture?: string } }) {
      if (!profile || !profile.email) {
        console.error("Sign in failed: No profile data returned from Google.");
        return false;
      }

      try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email: profile.email.toLowerCase() });

        if (!existingUser) {
          const preparedUser = validateAndPrepareGoogleUser({
            name: profile.name || "Google User",
            email: profile.email,
            image: profile.picture || "",
          });

          await usersCollection.insertOne(preparedUser);
          console.log(`New Google user registered successfully: ${profile.email}`);
        } else {
          console.log(`Existing user logged in: ${profile.email}`);
        }

        return true; 
      } catch (error) {
        console.error("Database error during Google sign-in processing:", error);
        return false; 
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        
        try {
          const { db } = await connectToDatabase();
          const userData = await db.collection("users").findOne({ email: session.user.email?.toLowerCase() });
          if (userData) {
            session.user.role = userData.role || "client";
            session.user.username = userData.username;
          }
        } catch (err) {
          console.error("Failed to append user profile fields to session context:", err);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
