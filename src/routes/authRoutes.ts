import { Router } from "express";
import {
  loginController,
  logoutController,
  resetPasswordController,
  changePasswordController,
} from "../controllers/authController";
import { isAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", loginController);
router.post("/logout", isAuth, logoutController);
router.post("/reset-password", resetPasswordController);
router.put("/change-password", isAuth, changePasswordController);

export default router;
