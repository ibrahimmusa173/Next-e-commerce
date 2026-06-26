"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/dbconnect";
import {
  comparePassword,
  hashPassword,
  validateLoginPayload,
  validateUserPayload,
} from "@/lib/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-123";

export async function signupAction(formData: FormData) {
  let success = false;
  let errorMessage = "";

  try {
    const rawData = Object.fromEntries(formData.entries());
    const payload = validateUserPayload(rawData);
    const isAdmin = formData.get("isAdmin") === "on";

    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection("users").findOne({
      $or: [{ username: payload.username }, { email: payload.email }],
    });

    if (existingUser) {
      errorMessage = "Username or email already exists";
    } else {
      const hashedPassword = await hashPassword(payload.password);
      await db.collection("users").insertOne({
        username: payload.username,
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: isAdmin ? "admin" : "client",
        createdAt: new Date(),
      });
      success = true;
    }
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Could not create account.";
  }

  if (success) {
    redirect("/login?message=Account+created+successfully");
  } else {
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
  }
}

export async function loginAction(formData: FormData) {
  let targetRoute = "";
  let errorMessage = "";

  try {
    const rawData = Object.fromEntries(formData.entries());
    const payload = validateLoginPayload(rawData);
    
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ username: payload.username });

    if (!user || !(await comparePassword(payload.password, user.password as string))) {
      errorMessage = "Invalid username or password";
    } else {
      const token = jwt.sign(
        { sub: user._id.toString(), username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      targetRoute = user.role === "admin" ? "/admin-dashboard" : "/client-dashboard";
    }
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Login failed.";
  }

  if (targetRoute) {
    redirect(targetRoute);
  } else {
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
}