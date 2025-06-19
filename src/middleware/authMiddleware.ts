import Jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/customErrors";

dotenv.config();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      throw new UnauthorizedError("Unauthorized User");
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    req.user = {
      id: decoded.id.toString(),
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    console.error("Error Authenticating User:", error);
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return next();
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    if (decoded) {
      req.user = {
        id: decoded.id.toString(),
        email: decoded.email,
        name: decoded.name,
      };
    }

    next();
  } catch (error) {
    next();
  }
};