"use client";
import { motion } from "framer-motion";

const skillsUrl =
  "https://skillicons.dev/icons?i=js,ts,react,nextjs,nodejs,express,mongodb,postgres,tailwind,aws,cloudinary,git,figma,pr";

export default function TechStack() {
  return (
    <section id="tech" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-brand">Tech Stack</h2>
        <div className="flex justify-center">
          <img src={skillsUrl} alt="My Tech Stack" className="h-16 md:h-20" />
        </div>
      </motion.div>
    </section>
  );
}