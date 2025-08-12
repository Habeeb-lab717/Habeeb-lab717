# Adaptive Numeracy Playground (MVP)

A full-stack, Dockerized web app for adaptive math practice in classrooms.

## Features
- Student login via class code (no OAuth)
- Adaptive math engine (questions get harder/easier)
- Teacher dashboard: class progress
- Modern UI (React + Tailwind CSS)
- Node.js + Express backend, SQLite DB
- Docker + docker-compose for easy deployment

## Quick Start (Docker)

```bash
git clone <your-repo-url>
cd adaptive-numeracy-playground
docker-compose up --build
```
- Client: http://localhost:5173
- Server: http://localhost:4000

## Local Dev (no Docker)

### Server
```bash
cd server
npm install
node src/index.js
```

### Client
```bash
cd client
npm install
npm run dev
```

## How the Adaptive Engine Works
- Each student’s last 5 answers are checked.
- More correct answers = harder questions (add, subtract, multiply, divide).
- Teachers can view all student progress by class code.

## Extending the Engine
- Add more question types in `server/src/index.js`.
- Add user authentication, avatars, or leaderboards.
- Connect to a persistent DB (Postgres, MySQL) for production.

## Push to GitHub
```bash
git init
git add .
git commit -m "Initial MVP"
git remote add origin <your-repo-url>
git push -u origin main
```

---
Built with ❤️ for modern classrooms.
