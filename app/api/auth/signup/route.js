import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ success: false, message: "User already exists" }), {
        status: 400,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return new Response(JSON.stringify({ success: true, message: "User created successfully" }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
