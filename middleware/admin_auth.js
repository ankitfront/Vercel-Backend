import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // ✅ debug

    if (!authHeader) {
      return res.json({ success: false, message: "No token provided" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Invalid token format" });
    }

    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
    );

    if (!token) {
      return res.json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Invalid admin" });
    }

    next();
  } catch (error) {
    console.log("ADMIN AUTH ERROR:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
