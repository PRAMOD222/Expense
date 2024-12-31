import { verifyToken } from "@/lib/auth"; // Import JWT utility

export async function GET(req) {
  // Extract the JWT token from the request headers (Authorization Bearer Token)
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

  // If token is valid, proceed with the request (e.g., fetching user data)
  // Here, we'll return a mock response for demonstration.
  return new Response(
    JSON.stringify({ success: true, message: "You have access to this data" }),
    { status: 200 }
  );
}
