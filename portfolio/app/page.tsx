import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import CreativeWork from "./components/CreativeWork";
import Certificates from "./components/Certificates";
import Testimonials from "./components/Testimonials";
import SocialProof from "./components/SocialProof";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PortfolioMotion from "./components/PortfolioMotion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PortfolioMotion>
        <Hero />
        <About />
        <TechStack />
        <SocialProof />
        <Projects />
        <CreativeWork />
        <Certificates />
        <Testimonials />
        <Contact />
        <Footer />
      </PortfolioMotion>
    </main>
  );
}