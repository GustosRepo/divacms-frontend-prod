import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔑 Decoded user:", decoded);

    // Normalize so req.user always has `id`
    req.user = {
      id: decoded.userId || decoded.id, // ✅ for compatibility
      role: decoded.role,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}