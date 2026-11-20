---
title: Reeli
kind: Movie and TV discovery
summary: A fast movie, TV and anime discovery app with live search, trailers, watch-provider info and personalised regional picks, built on the TMDB API.
role: Solo full-stack developer
status: Live
live: https://reeli-movies.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Reeli
screens: [reeli.png]
problem: Finding something to watch was a chore. Every streaming site wanted me to sign in before showing me a title, and the free ones buried search under ten navigation layers. I wanted the opposite: type a title, cast member or genre and see real results in under a second, with the trailer, cast, rating and where to watch already on the page instead of three tabs away.
process: I rebuilt my first movie app from scratch as a discovery product instead of a catalogue. I moved the TMDB calls behind an Express API layer so keys never reach the browser, kept the client on React and Vite for fast rendering, and used Appwrite for Google sign-in and a per-user interaction table protected by row-level security. Those interactions feed a weighted ranking that pushes what you actually watch above what is merely popular in your region, and it falls back to regional TMDB popularity until you have any history.
result: Reeli now answers "what should I watch next" in one screen. Live search covers titles, cast and crew, title pages are shareable at stable routes, and the regional Top Picks board personalises itself from real behaviour. The rewrite also fixed the caching and cold-start issues that made the old version feel sluggish on mobile data.
featured: false
order: 3
stack: [React, Vite, React Router, Tailwind CSS, Node.js, Express, TMDB API, AniList GraphQL, Appwrite, Vercel]
---
Reeli is a movie and TV discovery experience built around a single question: what should I watch next? It replaces browsing with searching, and puts the trailer, cast and where-to-watch on the same page.

## Highlights
- Live search across titles, cast and crew
- Personalised "Top Picks" that weight watch-provider clicks above page views and favour recent activity
- Genre shelves, shareable title routes, trailers and watch-provider details
- Anime enrichment through the AniList GraphQL API
- Light and dark themes with preferences saved in the browser

## Under the hood
- Express layer proxies TMDB server-side, keeping API credentials out of the browser bundle
- Google sign-in via Appwrite, with per-user data protected by row-level security
- Regional TMDB popularity as a fallback ranking for new users
- Static-friendly front end on Vercel with a thin API for the TMDB calls
