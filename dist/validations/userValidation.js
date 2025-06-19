"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatelogin = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const securityQuestions_1 = require("../utils/securityQuestions");
exports.validateUser = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.base": "Email should be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    name: joi_1.default.string().min(3).max(100).required().messages({
        "string.base": "Name should be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot be longer than 100 characters",
        "any.required": "Name is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
    }),
    securityQuestion: joi_1.default.string()
        .valid(...securityQuestions_1.SECURITY_QUESTIONS)
        .required()
        .messages({
        "string.base": "Security question should be a string",
        "any.only": "Invalid security question",
        "any.required": "Security question is required",
    }),
    securityAnswer: joi_1.default.string().min(3).required().messages({
        "string.base": "Security answer should be a string",
        "string.empty": "Security answer cannot be empty",
        "string.min": "Security answer must be at least 3 characters long",
        "any.required": "Security answer is required",
    }),
});
exports.validatelogin = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.base": "Email should be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
    }),
});
//# sourceMappingURL=userValidation.js.map