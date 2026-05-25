import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anuvab Das",
    jobTitle: "Full Stack Developer",
    url: "https://yourportfolio.com", // update this with actual domain
    sameAs: [
      "https://github.com/anuvabdas",
      "https://linkedin.com/in/anuvabdas"
    ],
    description: "Full stack developer specializing in high-performance apps with React Native, Flutter, and Next.js.",
  };

  return (
    <main className="relative z-0">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
