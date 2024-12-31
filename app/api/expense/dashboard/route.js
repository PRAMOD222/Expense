import { connectToDatabase } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { verifyToken } from "@/lib/auth"; // Import the JWT verification function

export async function GET(req) {
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

    const userId = decoded.userId;

    // Get the current month and year
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Query the expense data for the current month and user
    const expenses = await Expense.find({
      userId: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate statistics
    let totalEarnings = 0;
    let totalSpent = 0;
    let totalGiven = 0;
    let totalBorrowed = 0;

    expenses.forEach((expense) => {
      switch (expense.type) {
        case "credit":
          totalEarnings += expense.amount;
          break;
        case "debit":
          totalSpent += expense.amount;
          break;
        case "given":
          totalGiven += expense.amount;
          break;
        case "borrowed":
          totalBorrowed += expense.amount;
          break;
        default:
          break;
      }
    });

    // Calculate the remaining balance
    const remainingBalance = totalEarnings - totalSpent - totalGiven + totalBorrowed;

    // Return the calculated data
    return new Response(
      JSON.stringify({
        success: true,
        totalEarnings,
        totalSpent,
        totalGiven,
        totalBorrowed,
        remainingBalance,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
