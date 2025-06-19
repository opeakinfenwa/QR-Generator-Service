"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/login", authController_1.loginController);
router.post("/logout", authMiddleware_1.isAuth, authController_1.logoutController);
router.post("/reset-password", authController_1.resetPasswordController);
router.put("/change-password", authMiddleware_1.isAuth, authController_1.changePasswordController);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map