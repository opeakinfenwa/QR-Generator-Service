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
exports.findUserQRCodes = exports.incrementScanCount = exports.createQRCode = void 0;
const db_1 = require("../config/db");
const createQRCode = (data, imageUrl, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`INSERT INTO qr_codes (data, image_url, user_id) VALUES ($1, $2, $3) RETURNING *`, [data, imageUrl, userId]);
    return result.rows[0];
});
exports.createQRCode = createQRCode;
const incrementScanCount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
});
exports.incrementScanCount = incrementScanCount;
const findUserQRCodes = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * FROM qr_codes WHERE user_id = $1`, [
        userId,
    ]);
    return result.rows;
});
exports.findUserQRCodes = findUserQRCodes;
//# sourceMappingURL=qrRepository.js.map