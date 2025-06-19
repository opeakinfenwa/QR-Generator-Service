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
require("dotenv/config");
const pg_1 = require("pg");
const fs_1 = require("fs");
const path_1 = require("path");
const env = process.env.NODE_ENV || "development";
console.log(`Running seeds in ${env} environment...`);
let connectionString = process.env.DATABASE_URL;
if (env === "production")
    connectionString = process.env.DATABASE_URL_PROD;
else if (env === "test")
    connectionString = process.env.DATABASE_URL_TEST;
const client = new pg_1.Client({ connectionString });
const seedDir = (0, path_1.join)(__dirname);
const sqlDir = (0, path_1.join)(seedDir, "sql");
const undoDir = (0, path_1.join)(seedDir, "undo");
const historyFile = (0, path_1.join)(seedDir, "seeder.history.json");
function getSeedHistory() {
    if (!(0, fs_1.existsSync)(historyFile))
        return [];
    const content = (0, fs_1.readFileSync)(historyFile, "utf8");
    return content.trim() ? JSON.parse(content) : [];
}
function saveSeedHistory(history) {
    (0, fs_1.writeFileSync)(historyFile, JSON.stringify(history, null, 2));
}
function runSeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const appliedSeeds = getSeedHistory();
            const files = (0, fs_1.readdirSync)(sqlDir).filter((f) => f.endsWith(".sql"));
            for (const file of files) {
                if (appliedSeeds.includes(file)) {
                    console.log(`Already seeded: ${file}`);
                    continue;
                }
                const sql = (0, fs_1.readFileSync)((0, path_1.join)(sqlDir, file), "utf8");
                console.log(`Seeding: ${file}`);
                yield client.query("BEGIN");
                yield client.query(sql);
                yield client.query("COMMIT");
                appliedSeeds.push(file);
                saveSeedHistory(appliedSeeds);
                console.log(`Seeded: ${file}`);
            }
            console.log("All seeders executed.");
        }
        catch (err) {
            console.error("Seeding failed:", err);
            yield client.query("ROLLBACK");
        }
        finally {
            yield client.end();
        }
    });
}
function rollbackSeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const history = getSeedHistory().reverse();
            for (const file of history) {
                const undoPath = (0, path_1.join)(undoDir, file);
                if (!(0, fs_1.existsSync)(undoPath)) {
                    console.warn(`No undo file found for: ${file}`);
                    continue;
                }
                const undoSql = (0, fs_1.readFileSync)(undoPath, "utf8");
                console.log(`Undoing seed: ${file}`);
                yield client.query("BEGIN");
                yield client.query(undoSql);
                yield client.query("COMMIT");
                history.pop();
                saveSeedHistory([...history].reverse());
                console.log(`Seed Undone: ${file}`);
            }
            console.log("All seeders rolled back.");
        }
        catch (err) {
            console.error("Rollback failed:", err);
            yield client.query("ROLLBACK");
        }
        finally {
            yield client.end();
        }
    });
}
const command = process.argv[2];
if (command === "undo") {
    rollbackSeeds();
}
else {
    runSeeds();
}
//# sourceMappingURL=seeder-runner.js.map