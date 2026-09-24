"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-brand">About Me</h2>
        <div className="text-gray-300 space-y-4 text-lg">
          <p>
            Hey there! I'm a 16‑year‑old full‑stack developer from Ibadan, Nigeria.
            I fell in love with coding because it lets me turn ideas into real, working products.
            When I'm not writing code, I'm designing graphics or editing videos —
            skills that help me make apps that aren't just functional, but beautiful.
          </p>
          <p>
            My biggest project is{" "}
            <a
              href="https://snitch-social-frontend.vercel.app"
              className="text-brand underline"
            >
              Snitch
            </a>
            , a social media PWA built from scratch with React, Node.js, MongoDB, and Socket.IO.
            I'm currently scaling it and learning more about system design and TypeScript.
          </p>
          <p>
            🎯 Goal: launch 5 production‑ready apps and grow Snitch into a vibrant community.
          </p>
        </div>
      </motion.div>
    </section>
  );
}