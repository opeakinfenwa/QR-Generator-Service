import { Request, Response, NextFunction } from "express";
import {
  loginService,
  changePasswordService,
  resetPasswordService,
} from "../services/authService";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginService(email, password);

    res
      .setHeader("Authorization", `Bearer ${token}`)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    console.error("Error Signing Up User:", error);
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .setHeader("Authorization", "")
      .json({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.error("Error Login Out User:", error);
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    await changePasswordService(req.user.id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error Login Out User:", error);
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, newPassword, securityQuestionAnswer } = req.body;

  try {
    await resetPasswordService(email, newPassword, securityQuestionAnswer);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error Login Out User:", error);
    next(error);
  }
};