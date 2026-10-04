---
title: Tudu
summary: A Kanban-based task workspace on the PERN stack with drag and drop boards, real-time sync, shared lists, AI task breakdown, a Pomodoro timer and an analytics dashboard.
live: https://tudu-kanban.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Tudu
problem: Todo apps track tasks but they do not help you finish them. Mine either became a write-only list or a rigid tracker that broke the moment a task was not a single checkbox. I wanted a workspace where a rough idea could become an organised plan: type "ship the landing page friday 3pm #work" and have it parsed into a real task with a due date and priority, then move it across a board as I actually work.
process: I treated this as an engineering project rather than a CRUD exercise. The backend is Express on PostgreSQL with JWT auth, Google and GitHub OAuth, and Socket.IO so a board updates on every open device instantly. Lists can be shared with other users by email and every action is written to an activity log. On the front end, React and Vite sit on TanStack Query and Zustand, with dnd-kit for the Kanban board, Chart.js for analytics and a natural-language parser for quick capture. I wrote the tests as part of the build: Jest and Supertest on the API, Vitest and React Testing Library on the components, and Playwright end-to-end specs including one that fails if the layout overflows at 320px.
result: Tudu became a real product rather than a demo. Real-time collaboration, shared lists and AI breakdown turn it into a team workspace, the analytics dashboard shows completion rate and time spent instead of a bare task count, and the Playwright suite now guards the responsiveness and onboarding bugs I already fixed once.
featured: true
order: 2
stack: [React, TypeScript, Vite, Node.js, Express, PostgreSQL, Socket.IO, TanStack Query, Zustand, Tailwind CSS, dnd-kit, Chart.js, Jest, Vitest, Playwright]
---
Tudu is a Kanban task workspace with a brush-stroke aesthetic, built to show range across a full PERN stack. It covers authentication, real-time collaboration, AI-assisted planning, focus tooling and analytics, and it is one of the few projects where the test suite is treated as part of the product rather than an afterthought.