"use client";
import { motion } from "framer-motion";

export default function CreativeWork() {
  return (
    <section id="creative" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-brand">Creative Work</h2>
        <p className="text-gray-300 mb-8">
          I also design graphics and edit videos. Here&apos;s a quick showcase.
        </p>
        <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
          {/* Replace with your own video embed or image carousel */}
          <span className="text-gray-500">Graphics & Video Reel Coming Soon</span>
        </div>
      </motion.div>
    </section>
  );
}