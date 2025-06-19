"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/signup", userController_1.signupController);
router.put("/update-user", authMiddleware_1.isAuth, userController_1.updateUserController);
router.get("/me", authMiddleware_1.isAuth, userController_1.getUserController);
router.delete("/me", authMiddleware_1.isAuth, userController_1.deleteUserController);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map