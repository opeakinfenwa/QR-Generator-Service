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
const env = process.env.NODE_ENV || 'development';
console.log(`Running migration in ${env} environment...`);
let connectionString = process.env.DATABASE_URL;
if (env === 'production')
    connectionString = process.env.DATABASE_URL_PROD;
else if (env === 'test')
    connectionString = process.env.DATABASE_URL_TEST;
const client = new pg_1.Client({ connectionString });
const historyFile = (0, path_1.join)(__dirname, 'migration.history.json');
function getMigrationHistory() {
    if (!(0, fs_1.existsSync)(historyFile))
        (0, fs_1.writeFileSync)(historyFile, JSON.stringify([]));
    return JSON.parse((0, fs_1.readFileSync)(historyFile, 'utf8'));
}
function saveMigrationHistory(history) {
    (0, fs_1.writeFileSync)(historyFile, JSON.stringify(history, null, 2));
}
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        yield client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      run_on TIMESTAMP DEFAULT now()
    );
  `);
        const { rows } = yield client.query('SELECT filename FROM migrations');
        const dbApplied = new Set(rows.map((r) => r.filename));
        const localApplied = getMigrationHistory();
        const upDir = (0, path_1.join)(__dirname, 'up');
        const files = (0, fs_1.readdirSync)(upDir)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        for (const file of files) {
            if (dbApplied.has(file) || localApplied.includes(file)) {
                console.log(`Already applied: ${file}`);
                continue;
            }
            const sql = (0, fs_1.readFileSync)((0, path_1.join)(upDir, file), 'utf8');
            console.log(`Running migration: ${file}`);
            try {
                yield client.query('BEGIN');
                yield client.query(sql);
                yield client.query(`INSERT INTO migrations (filename) VALUES ($1)`, [
                    file,
                ]);
                yield client.query('COMMIT');
                localApplied.push(file);
                saveMigrationHistory(localApplied);
                console.log(`Applied Migration: ${file}`);
                console.log('All migrations completed.');
            }
            catch (err) {
                yield client.query('ROLLBACK');
                console.error(`Migration failed: ${file}`, err);
                break;
            }
        }
        yield client.end();
    });
}
function rollbackLastMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const localHistory = getMigrationHistory();
        const lastMigration = localHistory[localHistory.length - 1];
        if (!lastMigration) {
            console.log('No migration to rollback.');
            return yield client.end();
        }
        const downDir = (0, path_1.join)(__dirname, 'down');
        const rollbackFile = (0, path_1.join)(downDir, lastMigration);
        if (!(0, fs_1.existsSync)(rollbackFile)) {
            console.error(`No rollback SQL file found for: ${lastMigration}`);
            return yield client.end();
        }
        const sql = (0, fs_1.readFileSync)(rollbackFile, 'utf8');
        try {
            console.log(`Rolling back: ${lastMigration}`);
            yield client.query('BEGIN');
            yield client.query(sql);
            yield client.query(`DELETE FROM migrations WHERE filename = $1`, [
                lastMigration,
            ]);
            yield client.query('COMMIT');
            localHistory.pop();
            saveMigrationHistory(localHistory);
            console.log(`Rolled back: ${lastMigration}`);
            console.log('Rollback completed.');
        }
        catch (err) {
            yield client.query('ROLLBACK');
            console.error(`Rollback failed for: ${lastMigration}`, err);
        }
        finally {
            yield client.end();
        }
    });
}
const action = process.argv[2];
if (action === 'rollback')
    rollbackLastMigration();
else
    runMigrations();
//# sourceMappingURL=migration-runner.js.map