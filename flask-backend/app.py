from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.getenv("DB_PASSWORD"),
        database="skillbridge"
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    try:
        connection = get_db_connection()
        connection.close()

        return jsonify({
            "status": "ok",
            "service": "skillbridge-flask-api",
            "database": "connected"
        })

    except mysql.connector.Error as error:

        return jsonify({
            "status": "error",
            "database": "disconnected",
            "message": str(error)
        }), 500


# ============================================================
# STUDENT REGISTRATION
# ============================================================

@app.post("/api/students")
def register_student():

    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({
            "error": "name is required"
        }), 400

    if not data.get("email"):
        return jsonify({
            "error": "email is required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO students
            (
                name,
                email,
                role,
                city,
                rating,
                completed_tasks,
                availability
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data["name"],
                data["email"],
                data.get("role"),
                data.get("city"),
                data.get("rating", 0),
                data.get("completed_tasks", 0),
                data.get("availability")
            )
        )

        student_id = cursor.lastrowid

        skills = data.get("skills", [])

        for skill in skills:

            cursor.execute(
                """
                INSERT INTO skills (name)
                VALUES (%s)
                ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
                """,
                (skill,)
            )

            skill_id = cursor.lastrowid

            cursor.execute(
                """
                INSERT INTO student_skills
                (
                    student_id,
                    skill_id
                )
                VALUES (%s, %s)
                """,
                (
                    student_id,
                    skill_id
                )
            )

        connection.commit()

        return jsonify({
            "message": "Student registered successfully",
            "student_id": student_id
        }), 201

    except mysql.connector.Error as error:

        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        cursor.close()
        connection.close()


# ============================================================
# CREATE TASK
# ============================================================

@app.post("/api/tasks")
def create_task():

    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({
            "error": "title is required"
        }), 400

    if not data.get("description"):
        return jsonify({
            "error": "description is required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        required_skills = data.get("required_skills", [])

        if isinstance(required_skills, list):
            required_skills = ",".join(required_skills)

        cursor.execute(
            """
            INSERT INTO tasks
            (
                title,
                description,
                category,
                budget,
                deadline,
                required_skills
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                data["title"],
                data["description"],
                data.get("category"),
                data.get("budget"),
                data.get("deadline"),
                required_skills
            )
        )

        task_id = cursor.lastrowid

        connection.commit()

        return jsonify({
            "message": "Task created successfully",
            "task_id": task_id
        }), 201

    except mysql.connector.Error as error:

        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        cursor.close()
        connection.close()


# ============================================================
# GET ALL TASKS
# ============================================================

@app.get("/api/tasks")
def get_tasks():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT *
            FROM tasks
            ORDER BY created_at DESC
            """
        )

        tasks = cursor.fetchall()

        return jsonify({
            "data": tasks,
            "total": len(tasks)
        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# GET ONE TASK
# ============================================================

@app.get("/api/tasks/<int:task_id>")
def get_task(task_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT *
            FROM tasks
            WHERE id = %s
            """,
            (task_id,)
        )

        task = cursor.fetchone()

        if not task:

            return jsonify({
                "error": "Task not found"
            }), 404

        return jsonify({
            "data": task
        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# UPDATE TASK
# ============================================================

@app.put("/api/tasks/<int:task_id>")
def update_task(task_id):

    data = request.get_json()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        required_skills = data.get("required_skills", [])

        if isinstance(required_skills, list):
            required_skills = ",".join(required_skills)

        cursor.execute(
            """
            UPDATE tasks
            SET
                title = %s,
                description = %s,
                category = %s,
                budget = %s,
                deadline = %s,
                required_skills = %s
            WHERE id = %s
            """,
            (
                data.get("title"),
                data.get("description"),
                data.get("category"),
                data.get("budget"),
                data.get("deadline"),
                required_skills,
                task_id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Task not found"
            }), 404

        connection.commit()

        return jsonify({
            "message": "Task updated successfully"
        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# DELETE TASK
# ============================================================

@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            DELETE FROM tasks
            WHERE id = %s
            """,
            (task_id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Task not found"
            }), 404

        connection.commit()

        return jsonify({
            "message": "Task deleted successfully"
        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# RULE-BASED STUDENT MATCHING
# ============================================================

@app.get("/api/tasks/<int:task_id>/matches")
def match_students(task_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # ----------------------------------------------------
        # Get task
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                category,
                required_skills
            FROM tasks
            WHERE id = %s
            """,
            (task_id,)
        )

        task = cursor.fetchone()

        if not task:

            return jsonify({
                "error": "Task not found"
            }), 404

        # ----------------------------------------------------
        # Convert required skills into a list
        # ----------------------------------------------------

        required_skills = [
            skill.strip().lower()
            for skill in (task["required_skills"] or "").split(",")
            if skill.strip()
        ]

        if not required_skills:

            return jsonify({
                "error": "No required skills defined for this task"
            }), 400

        # ----------------------------------------------------
        # Get students + their skills
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                s.id,
                s.name,
                s.email,
                s.role,
                s.city,
                s.rating,
                s.completed_tasks,
                s.availability,
                sk.name AS skill
            FROM students s
            LEFT JOIN student_skills ss
                ON s.id = ss.student_id
            LEFT JOIN skills sk
                ON sk.id = ss.skill_id
            ORDER BY s.id
            """
        )

        rows = cursor.fetchall()

        # ----------------------------------------------------
        # Group skills by student
        # ----------------------------------------------------

        students = {}

        for row in rows:

            student_id = row["id"]

            if student_id not in students:

                students[student_id] = {
                    "id": student_id,
                    "name": row["name"],
                    "email": row["email"],
                    "role": row["role"],
                    "city": row["city"],
                    "rating": float(row["rating"] or 0),
                    "completed_tasks": row["completed_tasks"] or 0,
                    "availability": row["availability"],
                    "skills": []
                }

            if row["skill"]:

                students[student_id]["skills"].append(
                    row["skill"]
                )

        # ----------------------------------------------------
        # Calculate match percentage
        # ----------------------------------------------------

        matches = []

        for student in students.values():

            student_skills = {
                skill.lower()
                for skill in student["skills"]
            }

            matching_skills = [
                skill
                for skill in required_skills
                if skill in student_skills
            ]

            match_percentage = round(
                (
                    len(matching_skills)
                    / len(required_skills)
                ) * 100,
                2
            )

            student["matching_skills"] = matching_skills

            student["match_percentage"] = match_percentage

            matches.append(student)

        # ----------------------------------------------------
        # Highest match first
        # ----------------------------------------------------

        matches.sort(
            key=lambda student:
            student["match_percentage"],
            reverse=True
        )

        return jsonify({

            "task": {
                "id": task["id"],
                "title": task["title"],
                "category": task["category"],
                "required_skills": required_skills
            },

            "matches": matches

        })

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        cursor.close()
        connection.close()


# ============================================================
# CREATE TASK ASSIGNMENT
# ============================================================

@app.post("/api/assignments")
def create_assignment():

    data = request.get_json()

    task_id = data.get("task_id")
    student_id = data.get("student_id")

    if not task_id or not student_id:

        return jsonify({
            "error": "task_id and student_id are required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        # Check task
        cursor.execute(
            """
            SELECT id
            FROM tasks
            WHERE id = %s
            """,
            (task_id,)
        )

        if not cursor.fetchone():

            return jsonify({
                "error": "Task not found"
            }), 404

        # Check student
        cursor.execute(
            """
            SELECT id
            FROM students
            WHERE id = %s
            """,
            (student_id,)
        )

        if not cursor.fetchone():

            return jsonify({
                "error": "Student not found"
            }), 404

        # Calculate matching percentage
        cursor.execute(
            """
            SELECT required_skills
            FROM tasks
            WHERE id = %s
            """,
            (task_id,)
        )

        task = cursor.fetchone()

        required_skills = [
            skill.strip().lower()
            for skill in (task[0] or "").split(",")
            if skill.strip()
        ]

        cursor.execute(
            """
            SELECT sk.name
            FROM student_skills ss
            JOIN skills sk
                ON sk.id = ss.skill_id
            WHERE ss.student_id = %s
            """,
            (student_id,)
        )

        student_skills = {
            row[0].lower()
            for row in cursor.fetchall()
        }

        matching_skills = [
            skill
            for skill in required_skills
            if skill in student_skills
        ]

        match_percentage = round(
            (
                len(matching_skills)
                / len(required_skills)
                * 100
            ),
            2
        ) if required_skills else 0

        # Insert assignment
        cursor.execute(
            """
            INSERT INTO task_assignments
            (
                task_id,
                student_id,
                match_percentage,
                status
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                task_id,
                student_id,
                match_percentage,
                "Assigned"
            )
        )

        assignment_id = cursor.lastrowid

        connection.commit()

        return jsonify({

            "message": "Task assigned successfully",

            "assignment_id": assignment_id,

            "task_id": task_id,

            "student_id": student_id,

            "match_percentage": match_percentage,

            "status": "Assigned"

        }), 201

    except mysql.connector.Error as error:

        connection.rollback()

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        cursor.close()
        connection.close()


# ============================================================
# GET ALL ASSIGNMENTS
# ============================================================

@app.get("/api/assignments")
def get_assignments():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                ta.id,
                ta.task_id,
                t.title AS task_title,
                ta.student_id,
                s.name AS student_name,
                ta.match_percentage,
                ta.status,
                ta.assigned_at
            FROM task_assignments ta
            JOIN tasks t
                ON t.id = ta.task_id
            JOIN students s
                ON s.id = ta.student_id
            ORDER BY ta.assigned_at DESC
            """
        )

        assignments = cursor.fetchall()

        return jsonify({
            "data": assignments,
            "total": len(assignments)
        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# START FLASK SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )