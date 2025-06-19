import { Request, Response, NextFunction } from "express";
import {
  signupService,
  updateUserService,
  getUserService,
  deleteUserService,
} from "../services/userService";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, securityQuestion, securityAnswer } = req.body;

    const user = await signupService(
      email,
      password,
      name,
      securityQuestion,
      securityAnswer
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    console.error("Error Signing Up User:", error);
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const updatedUser = await updateUserService(userId, { name, email });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error Signing Up User:", error);
    next(error);
  }
};

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getUserService(userId);

    return res.json({
      success: true,
      message: "User details successfully fetched",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deletedUser = await deleteUserService(userId);

    return res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};