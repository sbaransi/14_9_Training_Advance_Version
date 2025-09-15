"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lecturesRouter = void 0;
const express_1 = require("express");
const db_js_1 = require("../db.js");
exports.lecturesRouter = (0, express_1.Router)();
// GET all lectures - Protected route with authentication
exports.lecturesRouter.get("/", async (req, res) => {
    try {
        // Debug logging
        console.log("=== GET /lectures ===");
        console.log("Request params:", req.params);
        console.log("Request query:", req.query);
        // Get user ID from authenticated request
        const userId = req.user?.userId;
        console.log("User ID from token:", userId);
        // Basic test query - just get all tasks
        const query = `SELECT 
                            l.id, l.name, l.email, l.age, l.courses_count, 
                            k.domain, k.level
                            FROM Lecturers l
                            LEFT JOIN KnowledgeLevels k ON l.id = k.lecturer_id
                            ORDER BY l.id;`;
        const [rows] = await db_js_1.db.execute(query);
        console.log("Lectures query result:", rows);
        res.json(rows);
    }
    catch (error) {
        console.error("Error fetching lectures:", error);
        res.status(500).json({ error: "Failed to fetch lectures" });
    }
});
exports.lecturesRouter.put("/:id/knowledge", async (req, res) => {
    try {
        // Debug logging
        console.log("=== PUT /tasks/:id ===");
        console.log("Request body:", req.body);
        console.log("Request params:", req.params);
        const id = req.params.id;
        const { domain, level } = req.body;
        if (!domain || !level) {
            return res.status(400).json({ error: "Domain and level are required" });
        }
        console.log("UPDATE parameters:", { domain, level, id });
        // Update knowledge level
        const [result] = await db_js_1.db.execute("UPDATE KnowledgeLevels SET level = ? WHERE lecturer_id = ? AND domain = ?", [level.trim(), id, domain.trim()]);
        // Check if knowledge level exists
        if (result.affectedRows === 0) {
            await db_js_1.db.execute("INSERT INTO KnowledgeLevels (lecturer_id, domain, level) VALUES (?, ?, ?)", [id, domain.trim(), level.trim()]);
            return res
                .status(201)
                .json({ message: "Knowledge level created successfully" });
        }
        res.status(200).json({ message: "Knowledge level updated successfully" });
    }
    catch (error) {
        console.error("Error updating knowledge level:", error);
        res.status(500).json({ error: "Failed to update knowledge level" });
    }
});
// Additional routes (POST, DELETE, etc.) can be added here following the same pattern
