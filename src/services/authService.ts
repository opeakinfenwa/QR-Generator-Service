import dotenv from "dotenv";
import {
  updateUserPassword,
  getUserById,
  getUserByEmail,
} from "../repositories/userRepository";
import {
  comparePassword,
  generateAuthToken,
  hashPassword,
  compareSecurityAnswer,
} from "../utils/authUtils";

import { validatelogin } from "../validations/userValidation";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors";

dotenv.config();

export const loginService = async (email: string, password: string) => {
  const { error } = validatelogin.validate({ email, password });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid password");
  }

  const token = await generateAuthToken({ id: user.id, email: user.email });

  return { token, user };
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  if (!currentPassword || !newPassword) {
    throw new UnauthorizedError("Please Provide Old And New Passwords");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const newHashedPassword = await hashPassword(newPassword);
  const updatedUser = await updateUserPassword(user.id, newHashedPassword);

  return updatedUser;
};

export const resetPasswordService = async (
  email: string,
  newPassword: string,
  securityQuestionAnswer: string
) => {
  if (!email || !newPassword || !securityQuestionAnswer) {
    throw new UnauthorizedError(
      "Please provide Email, New Password, and Security Question Answer"
    );
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isAnswerCorrect = await compareSecurityAnswer(
    securityQuestionAnswer,
    user.security_answer
  );
  if (!isAnswerCorrect) {
    throw new UnauthorizedError("Security question answer is incorrect");
  }

  const newHashedPassword = await hashPassword(newPassword);
  const updatedUser = await updateUserPassword(user.id, newHashedPassword);

  return updatedUser;
};