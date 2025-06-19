"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("./authRoutes"));
const googleRoutes_1 = __importDefault(require("./googleRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const qrRoutes_1 = __importDefault(require("./qrRoutes"));
const registerRoutes = function (app) {
    app.use("/user", userRoutes_1.default);
    app.use("/auth", authRoutes_1.default);
    app.use("/qr", qrRoutes_1.default);
    app.use("/auth", googleRoutes_1.default);
};
exports.default = registerRoutes;
//# sourceMappingURL=index.js.map