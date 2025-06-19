import Joi from "joi";
import { SECURITY_QUESTIONS } from "../utils/securityQuestions";

export const validateUser = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name should be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot be longer than 100 characters",
    "any.required": "Name is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  securityQuestion: Joi.string()
    .valid(...SECURITY_QUESTIONS)
    .required()
    .messages({
      "string.base": "Security question should be a string",
      "any.only": "Invalid security question",
      "any.required": "Security question is required",
    }),
  securityAnswer: Joi.string().min(3).required().messages({
    "string.base": "Security answer should be a string",
    "string.empty": "Security answer cannot be empty",
    "string.min": "Security answer must be at least 3 characters long",
    "any.required": "Security answer is required",
  }),
});

export const validatelogin = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
});