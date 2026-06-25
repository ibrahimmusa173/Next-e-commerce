import connectToDatabase from "@/lib/dbconnect"; // Adjust this path if needed

export async function GET() {
  try {
    // 1. Fire up your cached connection
    const { db } = await connectToDatabase();

    // 2. Insert a temporary document into a test collection
    await db.collection("test_collection").insertOne({ 
      message: "Hello MongoDB!",
      createdAt: new Date() 
    });

    return Response.json({ success: true, message: "Database created!" });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
