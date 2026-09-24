"use client";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Animated background (optional simple gradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Mojolaoluwa <span className="text-brand">Olanusi</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Full‑Stack Developer & Creative Builder
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="#projects"
            className="px-6 py-3 bg-brand hover:bg-brand-dark rounded-full font-medium transition-colors"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-gray-600 hover:border-brand rounded-full font-medium transition-colors"
          >
            Get In Touch
          </a>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-16"
        >
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}