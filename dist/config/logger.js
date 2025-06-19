"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(__dirname, "../../logs");
const errorLog = path_1.default.join(logDir, "error.log");
const combinedLog = path_1.default.join(logDir, "combined.log");
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })),
    transports: [
        new winston_1.default.transports.File({ filename: errorLog, level: "error" }),
        new winston_1.default.transports.File({ filename: combinedLog }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({ format: winston_1.default.format.simple() }));
}
logger.exceptions.handle(new winston_1.default.transports.File({ filename: path_1.default.join(logDir, "exceptions.log") }));
process.on("unhandledRejection", (reason) => {
    throw reason;
});
exports.default = logger;
//# sourceMappingURL=logger.js.map