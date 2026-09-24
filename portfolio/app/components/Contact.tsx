"use client";
import { motion } from "framer-motion";
// import { Mail, Twitter, Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-brand">Let's Connect</h2>
        <p className="text-gray-300 mb-8">
          I'm open to collaborations, freelance gigs, or just a friendly chat.
        </p>
        <div className="flex gap-6">
          {/* <a href="mailto:olanusimojola@gmail.com" className="text-gray-400 hover:text-brand transition-colors">
            <Mail className="w-6 h-6" />
          </a>
          <a href="https://twitter.com/yourhandle" className="text-gray-400 hover:text-brand transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/yourhandle" className="text-gray-400 hover:text-brand transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          {/* <a href="https://github.com/MojolaoluwaOlanusi" className="text-gray-400 hover:text-brand transition-colors">
            <Github className="w-6 h-6" />
          </a> */}
        </div>
      </motion.div>
    </section>
  );
}