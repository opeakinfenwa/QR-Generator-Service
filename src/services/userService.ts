import dotenv from "dotenv";
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserDetails,
  googleUserCheck,
  deleteUserById,
} from "../repositories/userRepository";
import { hashPassword, hashSecurityAnswer } from "../utils/authUtils";
import { SECURITY_QUESTIONS } from "../utils/securityQuestions";
import { validateUser } from "../validations/userValidation";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../errors/customErrors";

dotenv.config();

export const signupService = async (
  email: string,
  password: string,
  name: string,
  securityQuestion: string,
  securityAnswer: string
) => {
  const { error } = validateUser.validate({
    email,
    name,
    password,
    securityQuestion,
    securityAnswer,
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  const googleUser = await googleUserCheck(email);
  if (googleUser) {
    throw new ConflictError(
      "This email is already registered with Google login"
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("User already exists with this email");
  }

  if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
    throw new UnauthorizedError("Invalid security question");
  }

  const hashedAnswer = await hashSecurityAnswer(securityAnswer);
  const hashedPassword = await hashPassword(password);

  const user = await createUser(
    email,
    name,
    hashedPassword,
    securityQuestion,
    hashedAnswer
  );

  return user;
};

export const updateUserService = async (
  userId: string,
  updates: { name?: string; email?: string }
) => {
  const { name, email } = updates;

  if (!name && !email) {
    throw new BadRequestError(
      "At least one of name or email must be provided for update"
    );
  }

  const updatedUser = await updateUserDetails(userId, { name, email });
  return updatedUser;
};

export const getUserService = async (id: string) => {
  const user = await getUserById(id);
  return user;
};

export const deleteUserService = async (id: string) => {
  const deletedUser = await deleteUserById(id);
  return deletedUser;
};