# SkillBridge API

Express REST API for the SkillBridge demo. It ships with local mock data and writes newly posted problems and task applications to `data/store.json`; no database, keys, or cloud services are required.

## Run

```bash
cd backend
npm install
npm run dev
```

The API starts at `http://localhost:4000`.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/tasks?q=&category=` | Browse/filter tasks |
| GET | `/api/tasks/:id` | Task details |
| GET | `/api/students?q=&skill=` | Browse/filter students |
| GET | `/api/students/:id` | Student profile |
| GET | `/api/businesses` | Businesses |
| POST | `/api/matches` | Rule-based AI-style matching |
| POST | `/api/problems` | Save a newly posted problem and return analysis |
| GET/POST | `/api/applications` | Read/create applications |

Example matching request:

```json
POST /api/matches
{"title":"Need a bakery sales dashboard","description":"I need to analyse six months of sales data."}
```

## Production path

Replace `data.js` and the JSON store with a PostgreSQL repository layer, add authentication middleware, and connect a real LLM/extraction service in `matcher.js`. The HTTP contracts can remain unchanged.
