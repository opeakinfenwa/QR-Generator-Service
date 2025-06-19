"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.getUserService = exports.updateUserService = exports.signupService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = require("../repositories/userRepository");
const authUtils_1 = require("../utils/authUtils");
const securityQuestions_1 = require("../utils/securityQuestions");
const userValidation_1 = require("../validations/userValidation");
const customErrors_1 = require("../errors/customErrors");
dotenv_1.default.config();
const signupService = (email, password, name, securityQuestion, securityAnswer) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation_1.validateUser.validate({
        email,
        name,
        password,
        securityQuestion,
        securityAnswer,
    });
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(", "));
    }
    const googleUser = yield (0, userRepository_1.googleUserCheck)(email);
    if (googleUser) {
        throw new customErrors_1.ConflictError("This email is already registered with Google login");
    }
    const existingUser = yield (0, userRepository_1.getUserByEmail)(email);
    if (existingUser) {
        throw new customErrors_1.ConflictError("User already exists with this email");
    }
    if (!securityQuestions_1.SECURITY_QUESTIONS.includes(securityQuestion)) {
        throw new customErrors_1.UnauthorizedError("Invalid security question");
    }
    const hashedAnswer = yield (0, authUtils_1.hashSecurityAnswer)(securityAnswer);
    const hashedPassword = yield (0, authUtils_1.hashPassword)(password);
    const user = yield (0, userRepository_1.createUser)(email, name, hashedPassword, securityQuestion, hashedAnswer);
    return user;
});
exports.signupService = signupService;
const updateUserService = (userId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = updates;
    if (!name && !email) {
        throw new customErrors_1.BadRequestError("At least one of name or email must be provided for update");
    }
    const updatedUser = yield (0, userRepository_1.updateUserDetails)(userId, { name, email });
    return updatedUser;
});
exports.updateUserService = updateUserService;
const getUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userRepository_1.getUserById)(id);
    return user;
});
exports.getUserService = getUserService;
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield (0, userRepository_1.deleteUserById)(id);
    return deletedUser;
});
exports.deleteUserService = deleteUserService;
//# sourceMappingURL=userService.js.map