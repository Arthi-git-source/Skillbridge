# SkillBridge

**Real problems. Real skills. Real experience.** SkillBridge is a polished frontend demo that connects common people and small businesses with students who can complete practical, affordable projects. Its key interaction is a local, rule-inspired AI matching experience that turns a plain-language need into a category, skills, budget range, and suitable student recommendations—without an API key.

## Features

- Responsive startup-style landing page and verified-experience narrative
- AI-style problem-posting workflow and matching results
- Searchable, category-filterable marketplace with 15 Indian-context tasks
- 10 student profiles, plus realistic business and common-user workflows
- Student, business, and common-user demo dashboards
- CareerFinder concept panel linking career readiness to real tasks
- Interactive applications, reviews, modal states, notifications, progress indicators, and demo role switching
- `localStorage` persistence for role selection and task applications

## Tech stack

React, Vite, JavaScript, Tailwind CSS, and Lucide React. The app is intentionally frontend-only so it deploys on Vercel without environment variables or a backend.

## Folder structure

```
src/main.jsx       # pages, components, mock data, local state
src/index.css      # Tailwind setup and reusable styles
package.json       # scripts and dependencies
vite.config.js     # Vite configuration
```

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints. To create a production build:

```bash
npm run build
```

## Optional local API

The frontend works without a backend, but a ready-to-run Express API is included in `backend/` for tasks, students, AI-style matching, posted problems, and applications.

```bash
cd backend
npm install
npm run dev
```

It runs at `http://localhost:4000`; see [`backend/README.md`](backend/README.md) for the routes and request examples.

## Deploy to Vercel

1. Push this folder to a Git repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Vite automatically. Keep the build command `npm run build` and output directory `dist`.
4. Click **Deploy**. No environment variables are needed.

## Future architecture

The frontend is ready to replace mock arrays and `localStorage` with a REST or typed API. A future implementation can use FastAPI/Flask with PostgreSQL for users, tasks, applications, portfolios, and payments. A matching service can combine LLM extraction (problem → skills/scope) with deterministic scoring from verified skills, availability, similarity, rating, and budget. Authentication and payment webhooks should stay server-side.
