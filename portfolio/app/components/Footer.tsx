import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 py-10">
      <div className="section-shell flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Mojolaoluwa Olanusi. Designed and built by me with Next.js and Tailwind CSS.</p>
        <a href="#top" className="inline-flex items-center gap-2 transition hover:text-white">
          Back to top <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
