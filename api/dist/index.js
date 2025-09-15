"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const lectures_1 = require("./controllers/lectures");
// Ready for more routers:
// import { usersRouter } from './controllers/users.js';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check route
app.get("/api/health", (req, res) => {
    res.json({ message: "Task Management API is running!" });
});
// API Routes - Ready for expansion
app.use('/api/lectures', lectures_1.lecturesRouter); // Authentication routes (login/register)
//app.use('/api/tasks', tasksRouter); // Task routes (protected)
//app.use('/api/categories', categoriesRouter); // Category routes (protected)
// Ready for more routes:
// app.use('/api/users', usersRouter);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`Tasks API: http://localhost:${PORT}/api/tasks`);
    console.log(`Categories API: http://localhost:${PORT}/api/categories`);
});
