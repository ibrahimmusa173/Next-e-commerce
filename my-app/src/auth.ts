import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session, Profile } from "next-auth";
import connectToDatabase from "@/lib/dbconnect";
import { validateAndPrepareGoogleUser } from "@/lib/models/user";

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
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
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
    
    // ADD THIS CALLBACK: Extracts role from DB during token generation/checks for Middleware
   async jwt({ token }) {
      if (token.email) {
        try {
          const { db } = await connectToDatabase();
          const userData = await db.collection("users").findOne({ email: token.email.toLowerCase() });
          if (userData) {
            token.role = userData.role || "client";
            token.username = userData.username;
          }
        } catch (err) {
          console.error("Failed to query role for middleware JWT token:", err);
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        // Read directly from the updated token instead of hitting the DB a second time
        session.user.role = (token.role as string) || "client";
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
