"use server";

import { cookies } from "next/headers";
import { connectToLocalDatabase } from "../../lib/dbconnect";
import { createAuthToken, hashPassword, verifyPassword } from "../../lib/auth";

type ActionResult = {
  success: boolean;
  message: string;
};

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

function validateEmail(value: unknown): string {
  if (!value || typeof value !== "string") {
    throw new Error("Please provide a valid email.");
  }

  const email = value.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("Please provide a valid email.");
  }

  return email;
}

function validatePassword(value: unknown): string {
  if (!value || typeof value !== "string") {
    throw new Error("Please provide a valid password.");
  }

  const password = value.trim();
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  return password;
}

function validateName(value: unknown): string {
  if (!value || typeof value !== "string") {
    throw new Error("Please provide your name.");
  }

  const name = value.trim();
  if (!name) {
    throw new Error("Please provide your name.");
  }

  return name;
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const name = validateName(formData.get("name"));
  const email = validateEmail(formData.get("email"));
  const password = validatePassword(formData.get("password"));

  const { db } = await connectToLocalDatabase();
  const users = db.collection("users");
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return {
      success: false,
      message: "A user with that email already exists.",
    };
  }

  const passwordHash = await hashPassword(password);
  const result = await users.insertOne({
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  });

  const token = createAuthToken({
    userId: result.insertedId.toString(),
    email,
  });

  setAuthCookie(token);

  return {
    success: true,
    message: "Signup successful. You are now logged in.",
  };
}

export async function signinAction(formData: FormData): Promise<ActionResult> {
  const email = validateEmail(formData.get("email"));
  const password = validatePassword(formData.get("password"));

  const { db } = await connectToLocalDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user || typeof user.passwordHash !== "string") {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const token = createAuthToken({
    userId: user._id.toString(),
    email,
  });

  setAuthCookie(token);

  return {
    success: true,
    message: "Signin successful. You are now logged in.",
  };
}
