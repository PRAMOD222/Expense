import { connectToDatabase } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { verifyToken } from "@/lib/auth"; // Import JWT verification function

export async function POST(req) {
  try {
    // Extract token from request headers (Authorization: Bearer <token>)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Extract expense data from the request body
    const { description, amount, type, date } = await req.json();

    // Validate the expense data
    if (!description || !amount || !type || !date) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Create a new expense entry
    const newExpense = new Expense({
      userId: decoded.userId, // Associate expense with the authenticated user
      description,
      amount,
      type,
      date,
    });

    // Save the expense to the database
    await newExpense.save();

    return new Response(
      JSON.stringify({ success: true, message: "Expense added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
