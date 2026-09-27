# SkillBridge – Student Task Matching Platform

SkillBridge is a web-based platform that connects students with tasks and projects based on their skills.

The application allows users to post tasks, stores student and task information in MySQL, and uses a rule-based matching system to calculate how well a student's skills match the required skills for a task.

## Features

- Student registration
- Task creation and management
- MySQL database integration
- Flask REST API backend
- Rule-based student-task matching
- Matching percentage calculation
- Student assignment to tasks
- Persistent data storage
- React-based frontend
- Responsive user interface

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Python
- Flask
- Flask-CORS
- REST APIs

### Database
- MySQL 8.0

### Tools
- Git
- GitHub
- VS Code
- MySQL Workbench

---

## Project Structure

```text
Skillbridge/
│
├── backend/                  # Original Express backend
│
├── flask-backend/
│   ├── app.py                # Flask API server
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variable template
│
├── src/
│   ├── api.js                # Frontend API integration
│   ├── main.jsx
│   └── index.css
│
├── database.sql              # MySQL database schema
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
└── README.md
