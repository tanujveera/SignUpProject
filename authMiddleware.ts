import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";


interface AuthRequest extends Request {
  userId: string
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
  const decoded: any = jwt.verify(token, JWT_SECRET);

  req.userId = decoded;

  next();
  } catch (err) {
    return res.json({error:"Error Occured"});
  }
};

export { authMiddleware, AuthRequest };