---
title: Reeli
summary: A fast movie and TV discovery app with live search, instant trailer previews, personalised regional picks, and shareable title pages built on the TMDB API.
live: https://reeli-movies.vercel.app
github: https://github.com/MojolaoluwaOlanusi/Reeli
problem: Finding something to watch was a chore. Every streaming site wanted me to sign in before showing me a title, and the free ones buried search under ten navigation layers. I wanted the opposite: type a title, cast member or genre and see real results in under a second, with the trailer, cast, rating and where to watch already on the page instead of three tabs away.
process: I rebuilt my first movie app from scratch as a discovery product instead of a catalogue. I moved the TMDB calls behind an Express API layer so keys never reach the browser, kept the client on React and Vite for fast rendering, and used Appwrite for Google sign-in and a table of view and watch-provider interactions. Those interactions feed a weighted ranking that pushes what you actually watch above what is merely popular in your region, and it falls back to regional TMDB popularity until you have any history.
result: Reeli now answers "what should I watch next" in one screen. Live search covers titles, cast and crew, title pages are shareable at stable routes, and the regional Top Picks board personalises itself from real behaviour. The rewrite also fixed the caching and cold-start issues that made the old version feel sluggish on mobile data.
featured: false
order: 3
stack: [React, Vite, Tailwind CSS, Express, Node.js, TMDB API, Appwrite, Vercel]
---
Reeli is a movie and TV discovery experience built around a single question: what should I watch next? It replaces browsing with searching, and hides behind a trailer until you commit. Genre shelves, regional picks and shareable title pages make discovery fast on any connection, and the whole thing ships as a static-friendly front end with a thin server-side API for TMDB.