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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const customErrors_1 = require("../errors/customErrors");
dotenv_1.default.config();
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) ||
            (((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer "))
                ? req.headers.authorization.split(" ")[1]
                : null);
        if (!token) {
            throw new customErrors_1.UnauthorizedError("Unauthorized User");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
        req.user = {
            id: decoded.id.toString(),
            email: decoded.email,
            name: decoded.name,
        };
        next();
    }
    catch (error) {
        console.error("Error Authenticating User:", error);
        next(error);
    }
});
exports.isAuth = isAuth;
//# sourceMappingURL=authMiddleware.js.map