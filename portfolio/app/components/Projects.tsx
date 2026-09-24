"use client";
import { motion } from "framer-motion";
import { ExternalLink} from "lucide-react";

const projects = [
  {
    title: "Snitch",
    description:
      "Real‑time social media PWA. Optimistic UI, push notifications, algorithmic feed, media uploads.",
    tech: ["React", "TypeScript", "Node.js", "MongoDB", "Socket.IO", "Cloudinary"],
    live: "https://snitch-social-frontend.vercel.app",
    github: "https://github.com/MojolaoluwaOlanusi/Snitch",
    featured: true,
  },
  {
    title: "MovieHub",
    description: "TMDB movie explorer with infinite scroll, search, and detail pages.",
    tech: ["React", "TMDB API", "TailwindCSS"],
    live: "https://moviehub-livid.vercel.app",
    github: "https://github.com/MojolaoluwaOlanusi/MovieHub",
  },
  {
    title: "PERN Todo App",
    description: "Full‑stack task manager with user auth and drag‑and‑drop.",
    tech: ["PostgreSQL", "Express", "React", "Node.js", "TailwindCSS"],
    live: "https://todoapp-mu-ten-68.vercel.app",
    github: "https://github.com/MojolaoluwaOlanusi/pern-todo-app",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-brand">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-brand transition-colors ${
                project.featured ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-brand/10 text-brand rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.live !== "#" && (
                  <a
                    href={project.live}
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-brand"
                  >
                    <ExternalLink className="w-4 h-4" /> Live
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-gray-300 hover:text-brand"
                >
                  Code
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}