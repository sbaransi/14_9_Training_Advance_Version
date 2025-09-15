import { Router } from "express";
import { db } from "../db.js";
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export const lecturesRouter = Router();

// GET all lectures - Protected route with authentication
lecturesRouter.get("/", async (req: Request, res: Response) => {
    try {
      // Debug logging
      console.log("=== GET /lectures ===");
      console.log("Request params:", req.params);
      console.log("Request query:", req.query);

      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      console.log("User ID from token:", userId);

      // Basic test query - just get all tasks
      const query = `SELECT 
                            l.id, l.name, l.email, l.age, l.courses_count, 
                            k.domain, k.level
                            FROM Lecturers l
                            LEFT JOIN KnowledgeLevels k ON l.id = k.lecturer_id
                            ORDER BY l.id;`;

      const [rows] = await db.execute<RowDataPacket[]>(query);
      console.log("Lectures query result:", rows);

      res.json(rows);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      res.status(500).json({ error: "Failed to fetch lectures" });
    }
  }
);

lecturesRouter.put("/:id/knowledge", async (req: Request, res: Response) => {
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
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE KnowledgeLevels SET level = ? WHERE lecturer_id = ? AND domain = ?",
      [level.trim(), id, domain.trim()]
    );

    // Check if knowledge level exists
    if (result.affectedRows === 0) {
      await db.execute<ResultSetHeader>(
        "INSERT INTO KnowledgeLevels (lecturer_id, domain, level) VALUES (?, ?, ?)",
        [id, domain.trim(), level.trim()]
      );
      return res
        .status(201)
        .json({ message: "Knowledge level created successfully" });
    }
    res.status(200).json({ message: "Knowledge level updated successfully" });
  } catch (error) {
    console.error("Error updating knowledge level:", error);
    res.status(500).json({ error: "Failed to update knowledge level" });
  }
});

// Additional routes (POST, DELETE, etc.) can be added here following the same pattern
