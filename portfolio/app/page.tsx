import About from "./components/About";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import CreativeWork from "./components/CreativeWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import PortfolioMotion from "./components/PortfolioMotion";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import { certificates } from "@/lib/content";

export default function Home() {
  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#tech" },
    { label: "Creative", href: "#creative" },
    ...(certificates.length > 0 ? [{ label: "Certificates", href: "#certificates" }] : []),
    { label: "Contact", href: "#contact" },
  ];

  return (
    <main id="top" className="min-h-screen">
      <Navbar links={links} />
      <PortfolioMotion>
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <CreativeWork />
        {certificates.length > 0 && <Certificates />}
        <Contact />
        <Footer />
      </PortfolioMotion>
    </main>
  );
}
