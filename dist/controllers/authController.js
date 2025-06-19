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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.changePasswordController = exports.logoutController = exports.loginController = void 0;
const authService_1 = require("../services/authService");
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { token, user } = yield (0, authService_1.loginService)(email, password);
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
    }
    catch (error) {
        console.error("Error Signing Up User:", error);
        next(error);
    }
});
exports.loginController = loginController;
const logoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.error("Error Login Out User:", error);
        next(error);
    }
});
exports.logoutController = logoutController;
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        yield (0, authService_1.changePasswordService)(req.user.id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Error Login Out User:", error);
        next(error);
    }
});
exports.changePasswordController = changePasswordController;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, securityQuestionAnswer } = req.body;
    try {
        yield (0, authService_1.resetPasswordService)(email, newPassword, securityQuestionAnswer);
        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    }
    catch (error) {
        console.error("Error Login Out User:", error);
        next(error);
    }
});
exports.resetPasswordController = resetPasswordController;
//# sourceMappingURL=authController.js.map