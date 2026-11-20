---
title: Snitch
kind: Real-time social platform
summary: A full-stack social network with live chat, posts and reposts, push notifications, full-text search, media uploads and a separate admin dashboard, built to scale past a single server.
role: Solo full-stack developer
status: Live PWA
duration: About 6 months
live: https://snitch-social-frontend.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Snitch
screens: [snitch.png]
problem: Social apps usually trade away the thing that makes them social. Every platform I used asked for my data before it showed me a conversation, and none of them held up when traffic arrived. I wanted to prove that a real-time social product could be built on infrastructure that scales without a monolith, and that messaging, publishing and moderation could share one backend cleanly.
process: The backend is Express and MongoDB Atlas, with Redis handling caching and pub/sub so WebSocket messages reach users on any backend instance without hammering the database. Media goes straight from the browser to Cloudflare R2 through presigned URLs, so large files bypass the server and cost nothing in egress, and BullMQ queues handle background jobs. Full-text search covers users, posts and hashtags, notifications use Web Push, and the admin dashboard lives as its own app. I deployed the front end and admin to Vercel and the API to Fly.io.
result: Snitch shipped as a working PWA that holds real-time messaging, posting, reposting and search together, with an admin dashboard for moderation and analytics. It is the project I point to when I talk about shipping production infrastructure, and it taught me to work faster with AI tooling while still reviewing everything I take from it.
featured: true
order: 2
stack: [React, TypeScript, Vite, Node.js, Express, MongoDB Atlas, Redis, Socket.IO, BullMQ, Cloudflare R2, Web Push, Tailwind CSS, Zustand, Framer Motion, Vercel, Fly.io]
---
Snitch is a full-stack social media PWA built around real-time conversation and content sharing. It is the largest project I have shipped, and the one that pushed me from writing features to designing the systems underneath them.

## Highlights
- Real-time chat with typing indicators, read receipts and reactions
- Posts, reposts, an algorithmic feed and user discovery
- Group conversations and rich media uploads
- Web Push notifications that reach users when the app is closed
- Full-text search across users, posts and hashtags
- Separate admin dashboard for user management, content moderation and platform analytics

## Under the hood
- Redis Pub/Sub keeps chat in sync across multiple backend instances
- Presigned Cloudflare R2 uploads: direct browser-to-storage, zero server bandwidth
- BullMQ queues for background jobs
- JWT authentication and rate limiting on the API
- Three apps (client, admin, API) with shared TypeScript conventions
- Frontend and admin on Vercel, API on Fly.io
