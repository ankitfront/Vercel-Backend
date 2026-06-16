import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const token = authHeader.split(" ")[1]; // ✅ extract token

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = token_decode.id;

    next();
  }
  
  catch (error) {
    res.json({ success: false, message: error.message });
  }
  // console.log("AUTH HEADER:", req.headers.authorization);
};

export default authUser;
