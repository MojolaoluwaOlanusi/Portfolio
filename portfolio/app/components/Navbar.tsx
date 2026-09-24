export default function Navbar() {
  const links = [
    { label: "About", href: "#about" },
    { label: "Tech", href: "#tech" },
    { label: "Projects", href: "#projects" },
    { label: "Creative", href: "#creative" },
    { label: "Certificates", href: "#certificates" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <a href="#top" className="text-lg font-bold text-white">
          Mojola<span className="text-gradient">luwa</span>
        </a>

        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-violet-200">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}