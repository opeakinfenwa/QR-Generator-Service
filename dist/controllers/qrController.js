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
exports.getMyQRCodesController = exports.trackQRCodeScanController = exports.generateQRCodeController = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const qrRepository_1 = require("../repositories/qrRepository");
const generateQRCodeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data)
            return res
                .status(400)
                .json({ success: false, message: "Missing 'data'" });
        const qrCodeDataUrl = yield qrcode_1.default.toDataURL(data);
        const userId = req.user.id || null;
        const qr = yield (0, qrRepository_1.createQRCode)(data, qrCodeDataUrl, userId);
        res.status(201).json({ success: true, qr });
    }
    catch (error) {
        next(error);
    }
});
exports.generateQRCodeController = generateQRCodeController;
const trackQRCodeScanController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const qr = yield (0, qrRepository_1.incrementScanCount)(id);
        if (!qr) {
            return res
                .status(404)
                .json({ success: false, message: "QR Code not found" });
        }
        return res.json({ success: true, qrCode: qr });
    }
    catch (error) {
        next(error);
    }
});
exports.trackQRCodeScanController = trackQRCodeScanController;
const getMyQRCodesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const qrCodes = yield (0, qrRepository_1.findUserQRCodes)(userId);
        return res.json({ success: true, qrCodes });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyQRCodesController = getMyQRCodesController;
//# sourceMappingURL=qrController.js.map