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
exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../config/logger"));
dotenv_1.default.config();
const getDatabaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
        return process.env.DATABASE_URL_PROD || "";
    }
    else if (process.env.NODE_ENV === "test") {
        return process.env.DATABASE_URL_TEST || "";
    }
    else {
        return process.env.DATABASE_URL || "";
    }
};
exports.pool = new pg_1.Pool({
    connectionString: getDatabaseUrl(),
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield exports.pool.connect();
        client.release();
        logger_1.default.info(`Connected to PostgreSQL [${process.env.NODE_ENV || "development"}]`);
    }
    catch (error) {
        console.error("PostgreSQL Connection Error:", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
const shutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received ${signal}. Closing PostgreSQL connection...`);
    yield exports.pool.end();
    console.log("PostgreSQL pool disconnected");
    process.exit(0);
});
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
});
//# sourceMappingURL=db.js.map