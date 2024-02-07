import { NextFunction, Request, Response } from "express";
import { HTTP } from "./routes/user";
const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
  decodedValue?: any;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(HTTP.FORBIDDEN)
      .json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.decodedValue = decoded;
    next();
  } catch (err) {
    return res.status(HTTP.FORBIDDEN).json({});
  }
};

// module.exports = {
//   authMiddleware
// };
export default authMiddleware;