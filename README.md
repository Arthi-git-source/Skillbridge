# SkillBridge – Student Task Matching Platform

SkillBridge is a web-based platform that connects students with tasks and projects based on their skills.

The application allows users to post tasks, stores student and task information in MySQL, and uses a rule-based matching system to calculate how well a student's skills match the required skills for a task.

## Features

- Student registration through Flask API
- Task creation and management
- MySQL database integration
- Flask REST API backend
- Rule-based student-task matching
- Matching percentage calculation
- Student assignment to tasks
- Duplicate assignment prevention
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
```

---

# Setup and Installation

## 1. Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.x
- MySQL 8.0
- MySQL Workbench
- Git

Make sure the MySQL server is running.

---

## 2. Clone the Repository

```bash
git clone https://github.com/Arthi-git-source/Skillbridge.git
cd Skillbridge
```

---

## 3. MySQL Database Setup

Open MySQL Workbench and connect to your MySQL server.

Open the `database.sql` file from the project root and execute the complete script.

The script creates the `skillbridge` database and the following tables:

- `students`
- `skills`
- `student_skills`
- `tasks`
- `task_assignments`

Make sure the MySQL server is running before starting the Flask backend.

---

## 4. Flask Backend Setup

Open a terminal inside the Flask backend folder:

```bash
cd flask-backend
```

Create a Python virtual environment.

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

## 5. Configure Environment Variables

Inside the `flask-backend` folder, create a file named:

```text
.env
```

Use `.env.example` as the template.

Add:

```env
DB_PASSWORD=your_mysql_password
```

Replace `your_mysql_password` with the password for your local MySQL `root` user.

The `.env` file contains local credentials and should not be committed to GitHub.

---

## 6. Start the Flask Backend

From the `flask-backend` folder, with the virtual environment activated:

```bash
python app.py
```

The Flask API runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

A successful health check returns the API status and MySQL connection status.

---

## 7. Frontend Setup

Open a new terminal in the project root:

```bash
cd Skillbridge
```

Install the frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

The frontend communicates with the Flask backend through `src/api.js`.

By default, the frontend uses:

```text
http://localhost:5000/api
```

A different backend URL can be configured using the `VITE_API_URL` environment variable.

---

## 8. Running the Complete Application

Start MySQL first.

Then use two terminals.

### Terminal 1 – Flask Backend

```bash
cd flask-backend
venv\Scripts\activate
python app.py
```

### Terminal 2 – React Frontend

```bash
cd Skillbridge
npm run dev
```

Open the frontend URL shown by Vite, normally:

```text
http://localhost:5173
```

---

# API Endpoints

### Health Check

```http
GET /api/health
```

### Student Registration

```http
POST /api/students
```

### Create Task

```http
POST /api/tasks
```

### Get All Tasks

```http
GET /api/tasks
```

### Get One Task

```http
GET /api/tasks/<task_id>
```

### Update Task

```http
PUT /api/tasks/<task_id>
```

### Delete Task

```http
DELETE /api/tasks/<task_id>
```

### Get Matching Students

```http
GET /api/tasks/<task_id>/matches
```

### Assign Student to Task

```http
POST /api/assignments
```

### Get Assignments

```http
GET /api/assignments
```

---

# Matching Logic

SkillBridge uses a rule-based matching algorithm.

The required skills of a task are compared with the skills associated with each student.

The matching percentage is calculated as:

```text
Matching Percentage =
(Number of Matching Skills / Number of Required Skills) × 100
```

The matching students are returned in descending order of their matching percentage.

---

# Duplicate Assignment Prevention

Before creating an assignment, the Flask API checks whether the same student is already assigned to the same task.

If a duplicate assignment is attempted, the API returns a `409 Conflict` response instead of creating another assignment.

---

# Data Persistence

Student, skill, task, and assignment data are stored in MySQL.

Because the data is stored in the database rather than only in browser local storage, it remains available after restarting the Flask application, as long as the MySQL database is running.

---

# Notes

- MySQL must be running before starting the Flask backend.
- The `.env` file should not be committed to GitHub.
- Use `.env.example` as the template for configuring the environment.
- The frontend communicates with the Flask backend through `src/api.js`.
- The default local backend API URL is `http://localhost:5000/api`.
- The Vercel frontend deployment requires a publicly accessible backend URL rather than the local `localhost` URL for production API calls.
