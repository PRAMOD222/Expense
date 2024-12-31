import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { generateToken } from "@/lib/auth"; // Import JWT utility

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 400 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid password" }),
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    return new Response(
      JSON.stringify({ success: true, token }), // Send the token to the client
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
