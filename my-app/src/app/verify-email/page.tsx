import { connectToDatabase } from "@/lib/dbconnect";
import { redirect } from "next/navigation";

// Define a safe type interface for the search params
interface SearchParamsProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: SearchParamsProps) {
  // Await the promise safely
  const { token, email } = await searchParams;

  // Prevent database query if tokens are missing
  if (!token || !email) {
    return <div className="text-white p-10 text-center">Invalid or expired link.</div>;
  }

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email, verificationToken: token });

  if (!user) {
    return <div className="text-white p-10 text-center">Invalid or expired link.</div>;
  }

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { isVerified: true }, $unset: { verificationToken: "" } }
  );

  redirect("/login?message=Email+verified+successfully!+You+can+now+login.");
}
