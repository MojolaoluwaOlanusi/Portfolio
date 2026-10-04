---
title: Snitch
summary: A full-stack real-time social platform with posts, reposts, live chat, push notifications, full-text search, media uploads and an admin dashboard.
live: https://snitch-social-frontend.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Snitch
problem: Social apps usually trade away the thing that makes them social. Every platform I used asked for my data before it showed me a conversation, and none of them held up when traffic arrived. I wanted to prove that a real-time social product could be built on infrastructure that scales without a monolith, and that messaging, publishing and moderation could share one backend cleanly.
process: I spent about six months on Snitch and it was the project where I learned to build faster. The backend is Express and MongoDB Atlas, with Redis handling caching and pub/sub so WebSocket fan-out does not hammer the database. Media goes to Cloudflare R2 with presigned uploads so large files bypass the server entirely and cost nothing in egress. Full-text search runs on Atlas Search, notifications use Web Push with VAPID keys, and the admin dashboard lives as a separate app. I deployed the front end and admin to Vercel and the API to Fly.io with autoscaling and secrets managed through flyctl.
result: Snitch shipped as a working PWA that holds real-time messaging, posting, reposting and search together, with an admin dashboard for moderation. It is the project I point to when I talk about shipping production infrastructure, and it taught me to work faster with AI tooling while still reviewing what I take from it.
featured: true
order: 1
stack: [React, TypeScript, Node.js, Express, MongoDB Atlas, Redis, Socket.IO, Cloudflare R2, Web Push, Tailwind CSS, Vercel, Fly.io]
---
Snitch is a full-stack social media PWA built around real-time conversation and content sharing. It is the largest project I have shipped, and the one that pushed me from writing features to designing the systems underneath them.
