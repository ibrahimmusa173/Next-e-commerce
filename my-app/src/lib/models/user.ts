import bcrypt from "bcryptjs";

export type UserRole = "client" | "admin";

// Existing payload for standard Email/Password signups
export interface UserPayload {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
}

// NEW: Interface specifically for users logging in via Google OAuth
export interface GoogleUserPayload {
  name: string;
  email: string;
  image?: string;
}

export function validateUserPayload(input: UserPayload) {
  const username = input.username?.trim() || "";
  const name = input.name?.trim() || "";
  const email = input.email?.trim().toLowerCase() || "";
  const password = input.password || "";

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    throw new Error("Username must be 3-20 characters (letters, numbers, underscores).");
  }
  if (name.length < 2) {
    throw new Error("Name must be at least 2 characters long.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  return { username, name, email, password };
}

// NEW: Sanitizes and prepares incoming Google profile data for your database
export function validateAndPrepareGoogleUser(input: GoogleUserPayload) {
  const email = input.email.trim().toLowerCase();
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid Google email received.");
  }

  // Generate a safe fallback username from their email prefix since Google doesn't provide one
  const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
  const fallbackUsername = `${emailPrefix}_gg`; 

  return {
    username: fallbackUsername,
    name: input.name.trim() || "Google User",
    email,
    image: input.image || "",
    role: "client" as UserRole,
    authProvider: "google", // Helps differentiate from standard credential users
    createdAt: new Date(),
  };
}

export function validateLoginPayload(input: { username?: string; password?: string }) {
  const username = input.username?.trim() || "";
  const password = input.password || "";

  if (!username) throw new Error("Username is required.");
  if (!password) throw new Error("Password is required.");

  return { username, password };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Sanitizes the user object by removing the password field.
 * This version avoids creating unused variables to satisfy strict ESLint rules.
 */
export function sanitizeUser(user: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password")
  );
}
