import { connectToAtlasDatabase } from "@/lib/dbconnect";

export async function GET() {
  try {
    await connectToAtlasDatabase();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
