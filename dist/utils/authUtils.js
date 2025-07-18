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
exports.compareSecurityAnswer = exports.generateAuthToken = exports.comparePassword = exports.hashSecurityAnswer = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashed = yield bcrypt_1.default.hash(password, 10);
    return hashed;
});
exports.hashPassword = hashPassword;
const hashSecurityAnswer = (answer) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedAnswer = yield bcrypt_1.default.hash(answer, 10);
    return hashedAnswer;
});
exports.hashSecurityAnswer = hashSecurityAnswer;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
});
exports.comparePassword = comparePassword;
const generateAuthToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
});
exports.generateAuthToken = generateAuthToken;
const compareSecurityAnswer = (providedAnswer, storedHashedAnswer) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedAnswer = providedAnswer.trim().toLowerCase();
    const isMatch = yield bcrypt_1.default.compare(normalizedAnswer, storedHashedAnswer);
    return isMatch;
});
exports.compareSecurityAnswer = compareSecurityAnswer;
//# sourceMappingURL=authUtils.js.map