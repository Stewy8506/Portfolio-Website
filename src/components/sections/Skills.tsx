"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion } from "framer-motion";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Flutter", "Dart", "iOS/Android Deployment"],
  },
  {
    category: "Backend & AI",
    items: ["Node.js", "PostgreSQL", "MongoDB", "OpenAI API", "LangChain"],
  },
  {
    category: "Low Level",
    items: ["C/C++", "Embedded C", "RTOS", "Arduino/ESP32"],
  },
];

export default function Skills() {
  return (
    <Section id="skills" className="py-32">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Technical <span className="text-zinc-500">Arsenal</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A curated set of technologies I use to bring digital ideas to life, 
          from the silicon level to the cloud.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILLS.map((skill, idx) => (
          <FadeIn key={skill.category} delay={idx * 0.1}>
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-effect p-6 rounded-2xl border border-white/10 h-full group hover:border-white/20 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-6 text-white group-hover:text-white transition-colors">
                {skill.category}
              </h3>
              <ul className="space-y-3">
                {skill.items.map((item) => (
                  <li key={item} className="text-muted text-sm flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
