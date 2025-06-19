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
exports.deleteUserController = exports.getUserController = exports.updateUserController = exports.signupController = void 0;
const userService_1 = require("../services/userService");
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, securityQuestion, securityAnswer } = req.body;
        const user = yield (0, userService_1.signupService)(email, password, name, securityQuestion, securityAnswer);
        res.status(201).json({
            success: true,
            message: "Signup successful",
            data: user,
        });
    }
    catch (error) {
        console.error("Error Signing Up User:", error);
        next(error);
    }
});
exports.signupController = signupController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        const updatedUser = yield (0, userService_1.updateUserService)(userId, { name, email });
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Error Signing Up User:", error);
        next(error);
    }
});
exports.updateUserController = updateUserController;
const getUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = yield (0, userService_1.getUserService)(userId);
        return res.json({
            success: true,
            message: "User details successfully fetched",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserController = getUserController;
const deleteUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const deletedUser = yield (0, userService_1.deleteUserService)(userId);
        return res.json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserController = deleteUserController;
//# sourceMappingURL=userController.js.map