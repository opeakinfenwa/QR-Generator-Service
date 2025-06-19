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
exports.deleteUserById = exports.getUserByGoogleId = exports.getUserById = exports.updateUserPassword = exports.updateUserDetails = exports.createUser = exports.googleUserCheck = exports.getUserByEmail = void 0;
const db_1 = require("../config/db");
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    return result.rows[0];
});
exports.getUserByEmail = getUserByEmail;
const googleUserCheck = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM users WHERE email = $1 AND google_id IS NOT NULL", [email]);
    return result.rows[0];
});
exports.googleUserCheck = googleUserCheck;
const createUser = (email, name, password, securityQuestion, securityAnswer) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("INSERT INTO users (email, name, password, security_question, security_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *", [email, name, password, securityQuestion, securityAnswer]);
    return result.rows[0];
});
exports.createUser = createUser;
const updateUserDetails = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const setFields = [];
    const values = [];
    if (updates.name) {
        setFields.push("name = $" + (values.length + 1));
        values.push(updates.name);
    }
    if (updates.email) {
        setFields.push("email = $" + (values.length + 1));
        values.push(updates.email);
    }
    if (setFields.length === 0) {
        throw new Error("At least one field (name or email) must be provided for update");
    }
    const query = `UPDATE users SET ${setFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);
    const result = yield db_1.pool.query(query, values);
    return result.rows[0];
});
exports.updateUserDetails = updateUserDetails;
const updateUserPassword = (id, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [hashedPassword, id]);
    return result.rows[0];
});
exports.updateUserPassword = updateUserPassword;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    }
    catch (error) {
        throw new Error("Database query failed");
    }
});
exports.getUserById = getUserById;
const getUserByGoogleId = (googleId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query("SELECT * FROM users WHERE google_id = $1", [
        googleId,
    ]);
    return result.rows[0];
});
exports.getUserByGoogleId = getUserByGoogleId;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            throw new Error("User not found or already deleted");
        }
        return result.rows[0];
    }
    catch (error) {
        throw new Error("Database deletion failed");
    }
});
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=userRepository.js.map