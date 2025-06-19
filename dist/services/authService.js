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
exports.resetPasswordService = exports.changePasswordService = exports.loginService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = require("../repositories/userRepository");
const authUtils_1 = require("../utils/authUtils");
const userValidation_1 = require("../validations/userValidation");
const customErrors_1 = require("../errors/customErrors");
dotenv_1.default.config();
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = userValidation_1.validatelogin.validate({ email, password });
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(", "));
    }
    const user = yield (0, userRepository_1.getUserByEmail)(email);
    if (!user) {
        throw new customErrors_1.UnauthorizedError("Invalid email");
    }
    const isPasswordCorrect = yield (0, authUtils_1.comparePassword)(password, user.password);
    if (!isPasswordCorrect) {
        throw new customErrors_1.UnauthorizedError("Invalid password");
    }
    const token = yield (0, authUtils_1.generateAuthToken)({ id: user.id, email: user.email });
    return { token, user };
});
exports.loginService = loginService;
const changePasswordService = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentPassword || !newPassword) {
        throw new customErrors_1.UnauthorizedError("Please Provide Old And New Passwords");
    }
    const user = yield (0, userRepository_1.getUserById)(userId);
    if (!user) {
        throw new customErrors_1.NotFoundError("User not found");
    }
    const isMatch = yield (0, authUtils_1.comparePassword)(currentPassword, user.password);
    if (!isMatch) {
        throw new customErrors_1.UnauthorizedError("Current password is incorrect");
    }
    const newHashedPassword = yield (0, authUtils_1.hashPassword)(newPassword);
    const updatedUser = yield (0, userRepository_1.updateUserPassword)(user.id, newHashedPassword);
    return updatedUser;
});
exports.changePasswordService = changePasswordService;
const resetPasswordService = (email, newPassword, securityQuestionAnswer) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !newPassword || !securityQuestionAnswer) {
        throw new customErrors_1.UnauthorizedError("Please provide Email, New Password, and Security Question Answer");
    }
    const user = yield (0, userRepository_1.getUserByEmail)(email);
    if (!user) {
        throw new customErrors_1.NotFoundError("User not found");
    }
    const isAnswerCorrect = yield (0, authUtils_1.compareSecurityAnswer)(securityQuestionAnswer, user.security_answer);
    if (!isAnswerCorrect) {
        throw new customErrors_1.UnauthorizedError("Security question answer is incorrect");
    }
    const newHashedPassword = yield (0, authUtils_1.hashPassword)(newPassword);
    const updatedUser = yield (0, userRepository_1.updateUserPassword)(user.id, newHashedPassword);
    return updatedUser;
});
exports.resetPasswordService = resetPasswordService;
//# sourceMappingURL=authService.js.map