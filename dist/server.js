"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const logger_1 = __importDefault(require("./config/logger"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const PORT = process.env.PORT || 3001;
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map