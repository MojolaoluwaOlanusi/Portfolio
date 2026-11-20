---
title: Tudu
kind: Collaborative task workspace
summary: An open-source Kanban workspace on the PERN stack, with real-time sync, AI task breakdown, natural-language capture, a Pomodoro timer, analytics and a public REST API.
role: Solo full-stack developer
status: Live, open source (AGPL-3.0)
live: https://tudu-kanban.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Tudu
screens: [tudu.png]
problem: Todo apps track tasks but they do not help you finish them. Mine either became a write-only list or a rigid tracker that broke the moment a task was not a single checkbox. I wanted a workspace where a rough idea could become an organised plan: type "ship the landing page friday 3pm #work" and have it parsed into a real task with a due date and priority, then move it across a board as I actually work.
process: I treated this as an engineering project rather than a CRUD exercise. The API is Express on PostgreSQL (raw SQL, no ORM) with JWT auth and Google and GitHub OAuth, and a Socket.IO server on the same HTTP server pushes updates into per-user rooms so a board updates on every open device instantly. The React and Vite client sits on TanStack Query and Zustand, with dnd-kit for the board and Chart.js for analytics. I wrote the tests as part of the build: Jest and Supertest on the API, Vitest on components, integration tests against a real Postgres instance, and Playwright end-to-end specs, including one that fails if the layout overflows at 320px.
result: Tudu became a real product rather than a demo. Real-time collaboration, shared lists and AI breakdown turn it into a team workspace, the analytics dashboard shows completion rate and time spent instead of a bare task count, and the Playwright suite guards the responsiveness and onboarding bugs I already fixed once. It is released under AGPL-3.0 with self-hosting docs.
featured: true
order: 1
stack: [React, TypeScript, Vite, Node.js, Express, PostgreSQL, Socket.IO, TanStack Query, Zustand, Tailwind CSS, dnd-kit, Chart.js, Zod, Playwright, Vitest, Jest, Vercel, Render, Neon]
---
Tudu is a Kanban task workspace with a brush-stroke aesthetic, built to show range across a full PERN stack: authentication, real-time collaboration, AI-assisted planning, focus tooling, analytics and a public API, with a test suite treated as part of the product rather than an afterthought.

## Highlights
- Drag-and-drop Kanban boards with multi-card dragging and live synchronisation across devices
- Natural-language quick capture: "ship the landing page friday 3pm #work" becomes a dated, prioritised task
- AI task breakdown into sub-tasks with pluggable providers (Gemini, Groq or local Ollama)
- Pomodoro timer that keeps counting in the background, plus an analytics dashboard with completion rate and time spent
- Shared lists, invitations by email and an activity log of every action
- Installable PWA with offline caching and browser push notifications

## Under the hood
- Public REST API (/api/v1) with personal access tokens, Zod validation and rate limiting
- Outbound webhooks with signature verification and a 6-attempt retry policy
- GitHub and Slack integrations and Paystack subscription billing
- Postgres connection pool with raw SQL, and Socket.IO layered onto the same HTTP server
- Unit, integration (real Postgres) and Playwright end-to-end tests
- Ed25519-signed offline licence verification for self-hosted installs
