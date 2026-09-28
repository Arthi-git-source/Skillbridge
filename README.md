# SkillBridge

SkillBridge is a web application that helps connect students with suitable tasks based on their skills.

## Features

* Student registration
* Student skill management
* Task creation and management
* Rule-based skill matching
* Matching percentage
* Student-task assignment
* MySQL data storage
* React frontend connected with Flask APIs

## Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** Python, Flask
* **Database:** MySQL
* **Tools:** Git, GitHub, VS Code, MySQL Workbench

## How It Works

```text
React Frontend
      ↓
  Flask APIs
      ↓
 MySQL Database
      ↓
Skill Matching
      ↓
Task Assignment
```

The matching system compares the skills required for a task with the student's skills and calculates a matching percentage.

## Project Structure

```text
Skillbridge/
├── flask-backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── api.js
│   ├── main.jsx
│   └── index.css
├── database.sql
├── package.json
├── vite.config.js
└── README.md
```

## Setup

### Database

Run `database.sql` in MySQL.

### Backend

```bash
cd flask-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

```env
DB_PASSWORD=your_mysql_password
```

Run:

```bash
python app.py
```

### Frontend

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the Flask backend runs on `http://localhost:5000`.

## Matching

The project uses a simple rule-based matching system.

```text
Matching % = (Matching Skills / Required Skills) × 100
```


