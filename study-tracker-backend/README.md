# ProgressIQ — Backend

Node.js/Express + MongoDB API for the Study Tracker app.

## Setup

```bash
npm install
npm run dev             # starts with nodemon on http://localhost:5000
```

## What's built so far (Phase 2)

- Folder structure: `src/config`, `src/models`, `src/middleware`, `src/controllers`, `src/routes`, `src/utils`
- All 7 Mongoose models from the ERD: `User`, `Topic`, `Roadmap`, `Progress`, `Quiz`, `Question`, `Attempt`
- Full authentication: register, login, `GET /api/auth/me`
- Password hashing with bcrypt, JWT issuing + verification middleware (`protect`), role-based `authorize` middleware
- Centralized error handling (bad ObjectId, duplicate email, validation errors)
- Health check at `GET /api/health`

## Testing the auth endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shivaranjani","email":"shiv@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shiv@example.com","password":"password123"}'

# Get current user (replace TOKEN with the token from login/register response)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Next up (Phase 3)

- Topic + Roadmap CRUD routes
- Progress tracking endpoints
- Rule-based roadmap recommendation (`GET /api/roadmaps/recommend?goal=`)


# ProgressIQ

A full-stack study tracker built with the MERN stack (MongoDB, Express, React, Node.js). ProgressIQ lets you work through curated learning roadmaps topic by topic, test yourself with an automatic self-check quiz the moment you mark a topic complete, and track your consistency with streaks, bookmarks, notes, and a progress analytics dashboard.

**Live demo:** _coming soon_
**Tech stack:** React · React Router · Node.js · Express · MongoDB · Mongoose · JWT Auth

## Features
- 10 curated roadmaps across 115 topics (Frontend, Backend, Full Stack MERN, DSA & Interview Prep, DevOps, and more)
- Self-assessment quiz engine — 92 questions across 23 topics, scored server-side with instant feedback
- Streak tracking, topic bookmarking, and per-topic notes
- Progress analytics dashboard with completion breakdowns by category and roadmap
- JWT-based authentication with protected routes and bcrypt password hashing
