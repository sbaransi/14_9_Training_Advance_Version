"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = require("../db.js");
const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;
        const decoded = jsonwebtoken_1.default.verify(token, db_js_1.jwtConfig.secret);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            username: decoded.username
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Authorization check failed'
            });
        }
    };
};
exports.requireRole = requireRole;
