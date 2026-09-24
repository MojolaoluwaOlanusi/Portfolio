"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <span className="font-bold text-brand">Mojolaoluwa</span>
        <div className="flex gap-6 text-sm">
          <a href="#about" className="hover:text-brand">About</a>
          <a href="#tech" className="hover:text-brand">Tech</a>
          <a href="#projects" className="hover:text-brand">Projects</a>
          <a href="#contact" className="hover:text-brand">Contact</a>
        </div>
      </div>
    </nav>
  );
}