import express from "express";
import cors from "cors";
import { lecturesRouter } from "./controllers/lectures";

// Ready for more routers:
// import { usersRouter } from './controllers/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Task Management API is running!" });
});

// API Routes - Ready for expansion
app.use('/api/lectures', lecturesRouter);  // Authentication routes (login/register)
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
