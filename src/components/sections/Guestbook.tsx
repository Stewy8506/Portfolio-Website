"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Send } from "lucide-react";
import { toast } from "../ui/Toast";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Section from "../ui/Section";
import FadeIn from "../ui/FadeIn";
import HoverSpotlight from "../ui/HoverSpotlight";

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  timestamp: any;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [inputName, setInputName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playThocc, playPop } = useSoundEffect();

  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, "guestbook"),
      orderBy("timestamp", "desc"),
      limit(12)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestMessage[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputMessage.trim()) return;
    if (!db) {
      toast("Firebase is not configured.", "error");
      return;
    }

    setIsSubmitting(true);
    playPop(1.1);
    try {
      await addDoc(collection(db, "guestbook"), {
        name: inputName.trim(),
        message: inputMessage.trim(),
        timestamp: serverTimestamp()
      });
      setInputMessage("");
      toast("Message signed! Thanks for visiting.", "success");
    } catch {
      toast("Failed to post message.", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <Section id="guestbook" className="py-32">
      {/* Dynamic Background Glow matching Skills and Projects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Identical Section Heading */}
      <FadeIn className="mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          Visitor <span className="text-zinc-500">Wall</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          Leave a trace, share a thought, or just say hello. Your message will be permanently etched on this digital wall.
        </p>
      </FadeIn>

      {/* Grid Layout matching rest of the page structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
        
        {/* Left Column: Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">Sign the Guestbook</h3>
            <p className="text-sm text-muted">Join other developers and creators who visited this page.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Name</label>
              <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onFocus={() => playThocc()}
                placeholder="John Doe" 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white focus:outline-none transition-colors text-white placeholder-zinc-500"
                maxLength={30}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Message</label>
              <textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onFocus={() => playThocc()}
                placeholder="Your message here..." 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white focus:outline-none transition-colors text-white placeholder-zinc-500 h-28 resize-none"
                maxLength={150}
                required
                disabled={isSubmitting}
              />
            </div>

            <motion.button 
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={() => playThocc()}
              type="submit" 
              disabled={isSubmitting || !db}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              data-cursor="button"
            >
              {isSubmitting ? "Signing..." : "Send Message"} 
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>

        {/* Right Column: Miniatures Board */}
        <div className="lg:col-span-8">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div 
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  onMouseEnter={() => playThocc()}
                  className="h-40"
                >
                  <HoverSpotlight 
                    className="glass-effect rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 h-full cursor-default"
                    innerClassName="p-6 flex flex-col justify-between h-full"
                    glowColor="rgba(255, 255, 255, 0.05)"
                  >
                    <p className="text-zinc-300 text-sm font-medium leading-relaxed overflow-y-auto custom-scrollbar flex-grow pr-1">
                      &ldquo;{msg.message}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06] mt-4">
                      {/* Generative dynamic slate-monochrome badge */}
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-zinc-400 flex items-center justify-center font-bold text-[10px] tracking-wide uppercase select-none">
                        {msg.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-200">{msg.name}</span>
                        <span className="text-[9px] text-muted tracking-wider uppercase">Visitor</span>
                      </div>
                    </div>
                  </HoverSpotlight>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] flex items-center justify-center"
            >
              <div className="text-zinc-500 text-sm italic">No messages signed on the wall yet. Be the first to leave a trace!</div>
            </motion.div>
          )}
        </div>

      </div>
    </Section>
  );
}
