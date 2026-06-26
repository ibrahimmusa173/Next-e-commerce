import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "replace-with-a-secure-secret";
const JWT_EXPIRES_IN = "7d";

export function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. Use a strong secret in production.");
  }

  return JWT_SECRET;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createAuthToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}
