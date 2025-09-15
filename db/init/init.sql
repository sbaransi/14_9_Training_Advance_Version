
-- Lecture Management System Database Schema
CREATE DATABASE IF NOT EXISTS Lecture_Management;
USE Lecture_Management;

CREATE TABLE IF NOT EXISTS Lecturers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT NOT NULL,
  courses_count INT NOT NULL
);

CREATE TABLE IF NOT EXISTS KnowledgeLevels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lecturer_id INT,
  domain VARCHAR(255) NOT NULL,
  level ENUM('No knowledge', 'Low', 'Medium', 'Expert') NOT NULL,
  FOREIGN KEY (lecturer_id) REFERENCES Lecturers(id),
  UNIQUE KEY (lecturer_id, domain) -- Ensures one rating per domain per lecturer
);


INSERT INTO Lecturers (name, email, age, courses_count) VALUES
('admin', 'admin@taskmanager.com', 30, 5),
('john_doe', 'john@example.com', 25, 3),
('jane_smith', 'jane@example.com', 28, 4);

INSERT INTO KnowledgeLevels (lecturer_id, domain, level) VALUES
(1, 'Full Stack Dev', 'Expert'),
(1, 'AI Tools', 'Medium'),
(2, 'n8n', 'Low'),
(2, 'MongoDB', 'No knowledge'),
(3, 'Node.js', 'Medium');

-- Lecturers (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(255),
--   email VARCHAR(255),
--   age INT,
--   courses_count INT
-- )
-- KnowledgeLevels (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   lecturer_id INT,
--   domain VARCHAR(255), -- e.g., 'AI Tools', 'Full Stack Dev'
--   level ENUM('No knowledge', 'Low', 'Medium', 'Expert'),
--   FOREIGN KEY (lecturer_id) REFERENCES Lecturers(id)
-- )

-- CREATE TABLE IF NOT EXISTS Lecturers (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   username VARCHAR(50) UNIQUE NOT NULL,
--   email VARCHAR(100) UNIQUE,
--   age INT NOT NULL,
--   courses_count INT NOT NULL,
-- );

-- CREATE TABLE IF NOT EXISTS KnowledgeLevels (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   lecturer_id INT,
--   domain VARCHAR(255), -- e.g., 'AI Tools', 'Full Stack Dev'
--   level ENUM('No knowledge', 'Low', 'Medium', 'Expert'),
--   FOREIGN KEY (lecturer_id) REFERENCES Lecturers(id)
-- );
