# SkillBridge

SkillBridge is a web application that connects students with tasks based on their skills.

## Features

* Student registration through Flask API
* Student skill management
* Create, view, update and delete tasks
* Rule-based skill matching
* Matching percentage
* Student-task assignment
* MySQL data storage
* React frontend connected to Flask APIs

## Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** Python, Flask
* **Database:** MySQL

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

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Matching

The project uses rule-based skill matching.

```text
Matching % = (Matching Skills / Required Skills) × 100
```

