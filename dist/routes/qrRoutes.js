"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrController_1 = require("../controllers/qrController");
const qrController_2 = require("../controllers/qrController");
const qrController_3 = require("../controllers/qrController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/generate", qrController_1.generateQRCodeController);
router.post("/scan/:id", qrController_2.trackQRCodeScanController);
router.get("/my-codes", authMiddleware_1.isAuth, qrController_3.getMyQRCodesController);
exports.default = router;
//# sourceMappingURL=qrRoutes.js.map