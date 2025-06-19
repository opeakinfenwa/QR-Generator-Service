import { Router } from "express";
import {
  getUserController,
  signupController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController";
import { isAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signupController);
router.put("/update-user", isAuth, updateUserController);
router.get("/me", isAuth, getUserController);
router.delete("/me", isAuth, deleteUserController);

export default router;