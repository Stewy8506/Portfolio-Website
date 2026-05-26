"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";

interface Cursor {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export default function PresenceCursors() {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [myId] = useState(() => Math.random().toString(36).substring(2, 9));
  const [myColor] = useState(() => 
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  );

  useEffect(() => {
    const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!KEY || !CLUSTER) {
      console.error("❌ PresenceCursors: Missing Pusher keys in .env.local");
      return;
    }

    const pusher = new Pusher(KEY, {
      cluster: CLUSTER,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth", // Points to our new auth route
    });

    // Use a PRESENCE channel. This is exactly how Naresh's portfolio handles it.
    // Presence channels allow client events AND track who is online.
    const channel = pusher.subscribe("presence-portfolio");

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // client-events ONLY work on private/presence channels
      channel.trigger("client-cursor-move", {
        id: myId,
        x,
        y,
        color: myColor,
        name: "Visitor",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Listen for cursor moves from other users
    channel.bind("client-cursor-move", (data: Cursor) => {
      if (data.id === myId) return;
      
      setCursors((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    });

    // Presence channels have a built-in event for when a user leaves
    channel.bind("pusher:member_removed", (member: { id: string }) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[member.id];
        return next;
      });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      pusher.unsubscribe("presence-portfolio");
    };
  }, [myId, myColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: `${cursor.x}%`, 
              top: `${cursor.y}%`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              left: { type: "spring", damping: 30, stiffness: 200 },
              top: { type: "spring", damping: 30, stiffness: 200 },
            }}
            className="absolute w-4 h-4 pointer-events-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={cursor.color} 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-md"
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 4.93 4.93" />
            </svg>
            
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-4 top-0 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap text-white shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
