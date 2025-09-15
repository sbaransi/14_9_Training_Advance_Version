# FULL-STACK EXAM GUIDE - Node.js + React + MySQL + TypeScript + Vite + Docker

## PROJECT STRUCTURE

```
your-project-name/
├── api/                    # Node.js + TypeScript API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation
│   │   ├── logger/         # Logging system
│   │   └── utils/          # Helper functions
│   ├── seed/               # Database seeding
│   ├── test/               # API tests
│   ├── package.json        # API dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── .env                # Environment variables
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   ├── package.json        # Client dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── vite.config.ts      # Vite configuration
├── db/                     # Database setup
│   ├── init/
│   │   └── init.sql        # Database schema
│   └── docker-compose.yml  # MySQL container
└── package.json            # Root project management
```

## SETUP COMMANDS

```bash
# 1. Create project structure
mkdir your-project-name && cd your-project-name
mkdir api db
mkdir api/src api/src/controllers api/src/middleware api/src/logger api/src/utils
mkdir api/seed api/test
mkdir db/init
# Note: client folder will be created by Vite initialization

# 2. Initialize projects
cd api && npm init -y && cd ..
npm init -y

# 3. Install API dependencies
cd api && npm install express mysql2 jsonwebtoken bcrypt cors helmet dotenv axios @types/express @types/node @types/cors @types/jsonwebtoken @types/bcrypt typescript ts-node nodemon concurrently mocha chai @types/mocha @types/chai
cd .. && npm install

npx tsc --init

# 3. Start database
cd db && docker-compose up -d

# 4. Seed database
npm run seed

# 5. Start development (API + Client)
npm run dev

# 6. Run tests
npm test
```

## DATABASE SETUP

### db/docker-compose.yml

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: shift_management
    ports:
      - "3306:3306"
    volumes:
      - ./init:/docker-entrypoint-initdb.d
volumes:
  mysql_data:
```

### db/init/init.sql

```sql
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP DATABASE IF EXISTS shift_management;
CREATE DATABASE IF NOT EXISTS shift_management DEFAULT CHARACTER SET utf8mb4;
USE shift_management;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('user') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (name) VALUES ('admin') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (name) VALUES ('manager') ON DUPLICATE KEY UPDATE name=name;

CREATE TABLE IF NOT EXISTS users_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  role_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  job_title VARCHAR(50),
  department VARCHAR(50),
  hire_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shifts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  description TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## API SETUP

### api/package.json scripts section

```json
"scripts": {
  "compile": "tsc --watch",
  "dev": "nodemon ./dist/index.js",
  "all": "concurrently --names \"TSCompiler,Node_js_API\" --prefix-colors \"red,green\" \"npm run compile\" \"npm run dev\"",
  "start": "node ./dist/index.js",
  "test": "mocha \"test/**/*.ts\""
}
```

### Complete api/package.json

```json
{
  "name": "api_1",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "compile": "tsc --watch",
    "dev": "nodemon ./dist/index.js",
    "all": "concurrently --names \"TSCompiler,Node_js_API\" --prefix-colors \"red,green\" \"npm run compile\" \"npm run dev\"",
    "start": "node ./dist/index.js",
    "test": "mocha \"test/**/*.ts\"",
    "seedRoles": "ts-node ./seed/seedRoles.ts",
    "seedUsers": "ts-node ./seed/seedUsers.ts",
    "seedUsersRoles": "ts-node ./seed/seedUsersRoles.ts",
    "seedEmployees": "ts-node ./seed/seedEmployees.ts",
    "seedShifts": "ts-node ./seed/seedShifts.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "concurrently": "^7.6.0",
    "mocha": "^10.2.0",
    "chai": "^4.3.10",
    "@types/mocha": "^10.0.6",
    "@types/chai": "^4.3.11"
  }
}
```

### api/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "seed/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Create tsconfig.json

```bash
# In api folder
New-Item -Name "tsconfig.json" -ItemType "file"
# Then add the configuration content above
```

### Create .env file

```bash
# In api folder
New-Item -Name ".env" -ItemType "file"
# Or use the "New File" button in VS Code/Cursor
```

### api/.env content

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=shift_management
DB_PORT=3306
JWT_SECRET=supersecret
PORT=3000
```

### Add scripts to package.json

```json
"scripts": {
  "compile": "tsc --watch",
  "dev": "nodemon ./dist/index.js",
  "all": "concurrently --names \"TSCompiler,Node_js_API\" --prefix-colors \"red,green\" \"npm run compile\" \"npm run dev\"",
  "start": "node ./dist/index.js",
  "test": "mocha \"test/**/*.ts\""
}
```

### Add scripts to tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": false, // Set to false if you don't need .js.map files
    "declaration": false, // Set to false to avoid .d.ts files
    "declarationMap": false // Set to false to avoid .d.ts.map files
  },
  "include": ["src/**/*", "seed/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Create database connection file

```bash
# In api folder
mkdir src
# Navigate to src folder
cd src
# Create db.ts file (now in api/src folder)
New-Item -Name "db.ts" -ItemType "file"
```

### src/db.ts content

```typescript
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
};

export const db = mysql.createConnection(dbConfig);
```

### Create main server file

```bash
# In api/src folder
New-Item -Name "index.ts" -ItemType "file"
```

### src/index.ts content

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Task Management API is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Test the API

```bash
# 1. Start database (in db folder)
cd db
docker-compose up -d

# 2. Run API with TypeScript compilation (in api folder)
cd ../api
npm run all
# Should see: "Server running on port 3000"
# This runs both TypeScript compilation and server

# 3. Test health endpoint
# Open browser: http://localhost:3000/api/health
# Or use Postman: GET http://localhost:3000/api/health
```

### Create controllers

```bash
# In api/src folder
mkdir controllers
# Create tasks controller
New-Item -Path "controllers" -Name "tasks.ts" -ItemType "file"
# Create users controller
New-Item -Path "controllers" -Name "users.ts" -ItemType "file"
# Create categories controller
New-Item -Path "controllers" -Name "categories.ts" -ItemType "file"
```

## CLIENT SETUP

### Initialize React Vite client

```bash
# In root project folder
npm create vite@latest client -- --template react-ts
# Navigate to client folder
cd client
# Install basic dependencies
npm install
# Install additional dependencies
npm install react-router-dom @mui/material @emotion/react @emotion/styled axios recharts
```

### Router Pattern (Scalable Foundation)

```typescript
// src/controllers/tasks.ts - Router pattern ready for auth/roles
import { Router } from "express";
import { db } from "../db.js";
import type { Request, Response } from "express";
// import { authenticateJWT } from '../middleware/auth.js'; // Ready for auth
// import { requireRole } from '../middleware/role.js'; // Ready for roles

export const tasksRouter = Router();

// GET all tasks - Ready for auth: add authenticateJWT middleware
tasksRouter.get("/", async (req: Request, res: Response) => {
  // Ready for user filtering: const userId = req.user?.id;
  const [rows] = await db.execute("SELECT * FROM tasks");
  res.json(rows);
});

// POST create task - Ready for auth and validation
tasksRouter.post("/", async (req: Request, res: Response) => {
  const {
    title,
    description,
    status,
    priority,
    due_date,
    user_id,
    category_id,
  } = req.body;
  // Ready for user context: const userId = req.user?.id || user_id;
  const [result] = await db.execute(
    "INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      description,
      status || "pending",
      priority || "medium",
      due_date,
      user_id,
      category_id,
    ]
  );
  res
    .status(201)
    .json({ id: result.insertId, message: "Task created successfully" });
});

// PUT update task - Ready for auth and ownership checks
tasksRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, category_id } =
    req.body;
  // Ready for ownership check: const userId = req.user?.id;
  await db.execute(
    "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category_id = ? WHERE id = ?",
    [title, description, status, priority, due_date, category_id, id]
  );
  res.json({ message: "Task updated successfully" });
});

// DELETE task - Ready for auth and ownership checks
tasksRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ready for ownership check: const userId = req.user?.id;
  await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
  res.json({ message: "Task deleted successfully" });
});
```

### Update index.ts for Router pattern

```typescript
// src/index.ts - Ready for multiple routers
import { tasksRouter } from "./controllers/tasks.js";
// Ready for more routers:
// import { usersRouter } from './controllers/users.js';
// import { categoriesRouter } from './controllers/categories.js';
// import { authRouter } from './controllers/auth.js';

// API Routes - Ready for expansion
app.use("/api/tasks", tasksRouter);
// Ready for more routes:
// app.use('/api/users', usersRouter);
// app.use('/api/categories', categoriesRouter);
// app.use('/api/auth', authRouter);
```

### api/.gitignore

```gitignore
node_modules/
dist/
*.js
*.js.map
.env
.env.local
logs
*.log
.vscode/
.idea/
```

## CLIENT SETUP

### client/package.json

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@mui/material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.2",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### client/vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### client/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### client/tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## ROOT PROJECT SETUP

### package.json (Root)

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "Full-stack project",
  "scripts": {
    "dev": "concurrently --names \"API,Client\" --prefix-colors \"blue,green\" \"cd api && npm run all\" \"cd client && npm run dev\"",
    "start": "concurrently --names \"API,Client\" --prefix-colors \"blue,green\" \"cd api && npm start\" \"cd client && npm run build && npm run preview\"",
    "build": "cd api && npm run compile && cd ../client && npm run build",
    "test": "cd api && npm test",
    "seed": "cd api && npx ts-node ./seed/seedRoles.ts && npx ts-node ./seed/seedUsers.ts && npx ts-node ./seed/seedUsersRoles.ts && npx ts-node ./seed/seedEmployees.ts && npx ts-node ./seed/seedShifts.ts",
    "install-all": "cd api && npm install && cd ../client && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

## DEVELOPMENT COMMANDS

### Start Everything

```bash
npm run install-all    # Install all dependencies
cd db && docker-compose up -d    # Start database
npm run seed           # Seed database
npm run dev            # Start API + Client
npm test               # Run tests
```

### Individual Commands

```bash
# API only
cd api
npm run all            # Start API with TypeScript compilation
npm test               # Run tests
npm run seedRoles      # Run individual seeds

# Client only
cd client
npm run dev            # Start Vite dev server
npm run build          # Build for production

# Database only
cd db
docker-compose up -d   # Start MySQL
docker-compose down    # Stop MySQL
docker-compose logs    # View logs
```

## KEY FILES TO CREATE

### Essential API Files

- `api/src/index.ts` - Main server file
- `api/src/db.ts` - Database connection
- `api/src/controllers/` - Route handlers (auth, users, employees, shifts)
- `api/src/middleware/` - Authentication, validation
- `api/seed/` - Database seeding scripts
- `api/test/` - Test files

### Essential Client Files

- `client/src/main.tsx` - App entry point
- `client/src/App.tsx` - Main app component
- `client/src/context/AuthContext.tsx` - Authentication context
- `client/src/pages/` - Page components (Login, Register, Dashboard, etc.)
- `client/src/components/` - Reusable components (DataTable, Modal, etc.)

## EXAM TIPS

1. **Start with database schema** - Design tables first
2. **Create API endpoints** - CRUD operations
3. **Add authentication** - JWT + middleware
4. **Build client components** - Forms, tables, modals
5. **Add testing** - Unit tests for API
6. **Seed data** - Sample data for testing
7. **Test everything** - Manual + automated testing

## PORTS & CONNECTIONS

- **API Server**: http://localhost:3000
- **Client (Vite)**: http://localhost:5173
- **MySQL Database**: localhost:3306
- **MySQL Workbench**: Connect to localhost:3306, user: root, password: root

## MYSQL WORKBENCH GUIDE

### Connecting to Database

1. **Open MySQL Workbench**
2. **Click "+" to create new connection**
3. **Connection Settings:**
   - Connection Name: `Local MySQL`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: `root`
4. **Click "Test Connection"** - should show "Successfully made the MySQL connection"
5. **Click "OK"** to save connection
6. **Double-click connection** to connect

### Using Workbench

1. **View Database Schema:**

   - Expand `shift_management` database
   - View tables: `users`, `roles`, `users_roles`, `employees`, `shifts`, `audit_log`

2. **Run SQL Queries:**

   - Click "SQL" tab or press `Ctrl+T`
   - Type SQL commands:

   ```sql
   SELECT * FROM users;
   SELECT * FROM employees;
   SELECT * FROM shifts;
   ```

3. **View Table Data:**

   - Right-click table → "Select Rows - Limit 1000"
   - Or use: `SELECT * FROM table_name LIMIT 100;`

4. **Create/Modify Tables:**

   - Right-click table → "Alter Table"
   - Or use SQL: `ALTER TABLE users ADD COLUMN phone VARCHAR(20);`

5. **Import/Export Data:**
   - Right-click table → "Table Data Export Wizard"
   - Right-click table → "Table Data Import Wizard"

## POSTMAN GUIDE

### Setup Postman

1. **Download Postman** from postman.com
2. **Create new workspace** for your project
3. **Create new collection** called "Shift Management API"

### Environment Setup

1. **Create Environment:**

   - Click gear icon → "Manage Environments"
   - Click "Add" → Name: "Local Development"
   - Add variables:
     - `base_url`: `http://localhost:3000`
     - `token`: (leave empty, will be set after login)

2. **Set Environment:**
   - Click environment dropdown → Select "Local Development"

### API Testing

#### 1. Health Check

- **Method:** GET
- **URL:** `{{base_url}}/api/health`
- **Expected:** `{"message": "API is running!"}`

#### 2. User Registration

- **Method:** POST
- **URL:** `{{base_url}}/api/users/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

#### 3. User Login

- **Method:** POST
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **Save Token:** In Tests tab, add:

```javascript
if (pm.response.code === 200) {
  pm.environment.set("token", pm.response.json().token);
}
```

#### 4. Get All Users (Admin Only)

- **Method:** GET
- **URL:** `{{base_url}}/api/users`
- **Headers:** `Authorization: Bearer {{token}}`

#### 5. Create Employee

- **Method:** POST
- **URL:** `{{base_url}}/api/employees`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "user_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "job_title": "Developer",
  "department": "IT",
  "hire_date": "2025-01-01"
}
```

#### 6. Get All Employees

- **Method:** GET
- **URL:** `{{base_url}}/api/employees`
- **Headers:** `Authorization: Bearer {{token}}`

#### 7. Create Shift

- **Method:** POST
- **URL:** `{{base_url}}/api/shifts`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "employee_id": 1,
  "start_time": "2025-01-15 09:00:00",
  "end_time": "2025-01-15 17:00:00",
  "description": "Morning shift"
}
```

#### 8. Get All Shifts

- **Method:** GET
- **URL:** `{{base_url}}/api/shifts`
- **Headers:** `Authorization: Bearer {{token}}`

#### 9. Update Employee

- **Method:** PUT
- **URL:** `{{base_url}}/api/employees/1`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "job_title": "Senior Developer"
}
```

#### 10. Delete Employee

- **Method:** DELETE
- **URL:** `{{base_url}}/api/employees/1`
- **Headers:** `Authorization: Bearer {{token}}`

### Postman Tips

1. **Save requests** in collection for reuse
2. **Use environment variables** for dynamic values
3. **Set up pre-request scripts** for automatic token refresh
4. **Use tests** to validate responses
5. **Export collection** to share with team

### Common Headers

- `Content-Type: application/json` (for POST/PUT requests)
- `Authorization: Bearer {{token}}` (for protected routes)
- `Accept: application/json` (optional)

### Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## TECH STACK SUMMARY

- **Backend**: Node.js + Express + TypeScript + MySQL2 + JWT + bcrypt
- **Frontend**: React + Vite + TypeScript + Material-UI + Axios + Recharts
- **Database**: MySQL + Docker + MySQL Workbench
- **Testing**: Mocha + Chai + 30 comprehensive tests
- **API Testing**: Postman
- **Authentication**: JWT + Role-based access control
- **Features**: CRUD operations, seeding, analytics, charts

What's Included:
✅ Complete project structure diagram
✅ All setup commands (step-by-step)
✅ Database configuration (docker-compose.yml + init.sql)
✅ API setup (package.json, tsconfig.json, .env)
✅ Client setup (package.json, vite.config.ts, tsconfig files)
✅ Root project management (package.json)
✅ Development commands (start, test, seed)
✅ Key files to create
✅ Exam tips
✅ Ports & connections
✅ Tech stack summary
The guide is compact and printer-friendly with minimal spacing, perfect for copying to Word and printing for your exam! 🚀
