"use server";

import { signIn, signOut } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Built-in Node.js module
import { connectToDatabase } from "@/lib/dbconnect";
import { sendEmail } from "@/lib/mailer"; // Your mailer utility
import {
  comparePassword,
  hashPassword,
  validateLoginPayload,
  validateUserPayload,
} from "@/lib/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-123";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// --- SIGNUP ACTION ---
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
      const verificationToken = crypto.randomBytes(32).toString("hex");

      await db.collection("users").insertOne({
        username: payload.username,
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: isAdmin ? "admin" : "client",
        isVerified: false, // User starts unverified
        verificationToken,
        createdAt: new Date(),
      });

      // Send Verification Email
      const verifyUrl = `${BASE_URL}/verify-email?token=${verificationToken}&email=${payload.email}`;
      await sendEmail(
        payload.email,
        "Verify your Email - Next E-Commerce",
        `<h1>Welcome ${payload.name}!</h1>
         <p>Please click the link below to verify your account:</p>
         <a href="${verifyUrl}">${verifyUrl}</a>`
      );

      success = true;
    }
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : "Could not create account.";
  }

  if (success) {
    redirect("/login?message=Account+created.+Please+check+your+email+to+verify.");
  } else {
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
  }
}

// --- LOGIN ACTION ---
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
    } else if (!user.isVerified) {
      // Check if user is verified
      errorMessage = "Please verify your email before logging in.";
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

// --- FORGOT PASSWORD ACTION ---
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      await db.collection("users").updateOne(
        { email },
        { $set: { resetToken, resetExpiry } }
      );

      const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}&email=${email}`;
      await sendEmail(
        email,
        "Password Reset Request",
        `<p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
         <a href="${resetUrl}">${resetUrl}</a>`
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
  }

  // We redirect with a success message regardless of whether the email exists for security
  redirect("/login?message=If+an+account+exists,+a+reset+link+has+been+sent.");
}

// --- RESET PASSWORD ACTION ---
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function resetPasswordAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase(); // Normalize email
  const token = formData.get("token") as string;
  const newPassword = formData.get("password") as string;

  try {
    const { db } = await connectToDatabase();
    
    // 1. Find the user with matching token and check if expiry is still in the future
    const user = await db.collection("users").findOne({ 
      email, 
      resetToken: token, 
      resetExpiry: { $gt: new Date() } 
    });

    if (!user) {
      redirect("/login?error=Invalid+or+expired+reset+link.");
    }

    // 2. Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // 3. Update the password and clear the reset fields
    await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetExpiry: "" } 
      }
    );

    // 4. Success redirect
    redirect("/login?message=Password+successfully+updated.+You+can+now+login.");

  } catch (error: unknown) {
    // Check if the thrown error is an internal Next.js redirect
    if (isRedirectError(error)) {
      throw error;
    }
    
    console.error("Reset Password Error:", error);
    redirect("/login?error=Something+went+wrong+during+password+reset.");
  }
}



export async function loginWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/client-dashboard" });
  } catch (error) {
    // Next.js redirect errors need to be thrown normally
    throw error;
  }
}

// --- LOGOUT ACTION ---
export async function logout() {
  // 1. Delete the custom credentials token cookie layout completely
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  // 2. Clear Google OAuth profiles sessions cleanly through NextAuth
  await signOut({ redirectTo: "/login" });
}
