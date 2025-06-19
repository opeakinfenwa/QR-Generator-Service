import { Router } from "express";
import {
  generateQRCodeController,
  trackQRCodeScanController,
  getMyQRCodesController,
  deleteQRCodeController,
} from "../controllers/qrController";
import { isAuth, optionalAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/generate", optionalAuth, generateQRCodeController);
router.post("/scan/:id", optionalAuth, trackQRCodeScanController);
router.get("/my-codes", isAuth, getMyQRCodesController);
router.delete("/:id", isAuth, deleteQRCodeController);

export default router;