"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send(`<a href="/auth/google"> Authenticate with Google</a>`);
});
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect("/auth/failure");
    }
    if ("token" in req.user && "user" in req.user) {
        const { token, user } = req.user;
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return res.redirect(`/auth/dashboard?token=${token}`);
    }
    else {
        return res.redirect("/auth/failure");
    }
});
router.get("/dashboard", authMiddleware_1.isAuth, (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to your dashboard!",
        user: req.user,
    });
});
router.get("/failure", (req, res) => {
    return res.status(401).json({
        success: false,
        message: "Authentication failed. Please try again.",
    });
});
exports.default = router;
//# sourceMappingURL=googleRoutes.js.map