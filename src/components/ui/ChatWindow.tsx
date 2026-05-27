"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Check, User, Users, Edit2 } from "lucide-react";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "./Toast";
import AppWindow from "./AppWindow";
import { useWindowStore } from "@/store/windowStore";

const ADJECTIVES = ["Swift", "Clever", "Jolly", "Mystic", "Zen", "Bold", "Bright", "Quiet", "Fierce", "Nifty"];
const NOUNS = ["Panda", "Cheetah", "Beaver", "Otter", "Fox", "Koala", "Falcon", "Dolphin", "Badger", "Squirrel"];

interface Message {
  id: string;
  text: string;
  senderName: string;
  senderId: string;
  timestamp: unknown;
}

export default function ChatWindow() {
  const windowData = useWindowStore((state) => state.windows["chat"]);
  const isOpen = windowData?.isOpen;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate anonymous nickname
  useEffect(() => {
    const initChat = () => {
      const stored = localStorage.getItem("chat_nickname");
      if (stored) {
        setNickname(stored);
        setTempName(stored);
      } else {
        const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        const name = `${randAdj}${randNoun}${Math.floor(Math.random() * 100)}`;
        setNickname(name);
        setTempName(name);
        localStorage.setItem("chat_nickname", name);
      }
    };
    setTimeout(initChat, 0);
  }, []);

  // Firebase anonymous auth
  useEffect(() => {
    if (!isOpen || !isFirebaseConfigured || !auth) return;
    signInAnonymously(auth)
      .then(() => {
        console.log("Authenticated anonymously!");
      })
      .catch((err) => {
        console.error("Auth Error:", err);
      });
  }, [isOpen]);

  // Firebase real-time subscription
  useEffect(() => {
    if (!isOpen || !isFirebaseConfigured || !db) return;

    setTimeout(() => setLoading(true), 0);
    const q = query(
      collection(db, "chat_messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text || "",
            senderName: data.senderName || "Anonymous",
            senderId: data.senderId || "",
            timestamp: data.timestamp,
          };
        });
        setMessages(msgs);
        setLoading(false);
        setOnlineCount(Math.floor(Math.random() * 8) + 4);
      },
      (err) => {
        console.error("Firestore Listen Error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Focus input
  useEffect(() => {
    if (isOpen && !isEditingName) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isEditingName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isFirebaseConfigured || !db || !auth) {
      toast("Firebase config is missing in .env.local.", "error");
      return;
    }

    try {
      const msgText = inputText.trim();
      setInputText("");

      await addDoc(collection(db, "chat_messages"), {
        text: msgText,
        senderName: nickname,
        senderId: auth.currentUser?.uid || "anon",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Send Error:", err);
      toast("Failed to send message.", "error");
    }
  };

  const handleSaveNickname = () => {
    if (tempName.trim()) {
      const sanitized = tempName.trim().substring(0, 24);
      setNickname(sanitized);
      localStorage.setItem("chat_nickname", sanitized);
      setIsEditingName(false);
      toast(`Nickname changed to ${sanitized}`, "success");
    }
  };

  return (
    <AppWindow id="chat" defaultWidth={380} defaultHeight={550} minWidth={300} minHeight={400}>
      <div className="flex flex-col h-full bg-zinc-950/90 w-full" onClick={() => !isEditingName && inputRef.current?.focus()}>
        
        {/* ONLINE STATUS BAR */}
        <div className="flex flex-col items-center justify-center bg-white/[0.02] border-b border-white/5 py-3 shrink-0">
          <span className="font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            Global Anonymous Chat
          </span>
          <span className="text-[9px] text-zinc-400 flex items-center gap-1 mt-0.5">
            <Users className="w-2.5 h-2.5 text-emerald-400" />
            {onlineCount} active explorers
          </span>
        </div>

        {/* NICKNAME MANAGEMENT BAR */}
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2 w-full">
            <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            {isEditingName ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={24}
                  placeholder="Enter nickname..."
                  className="bg-zinc-900 border border-white/10 rounded px-2 py-0.5 text-white focus:outline-none focus:border-emerald-500 text-xs w-full max-w-[150px]"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                  autoFocus
                />
                <button onClick={handleSaveNickname} className="p-1 hover:bg-white/10 rounded text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-zinc-300 font-medium truncate max-w-[150px]">
                  Chatting as: <strong className="text-emerald-400 font-semibold">{nickname}</strong>
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempName(nickname);
                    setIsEditingName(true);
                  }} 
                  className="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-2 rounded hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  <Edit2 className="w-3 h-3" />
                  Rename
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES CONSOLE */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin select-text">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col gap-2">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-zinc-500">Connecting to global lobby...</span>
            </div>
          ) : !isFirebaseConfigured ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                <MessageSquare className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Firebase Configuration Required</h4>
              <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed">
                To open live chat, fill out the empty Firebase variables in your <code className="text-emerald-300 font-mono">.env.local</code>.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center py-10">
              <p>Welcome to the lobby! 👋</p>
              <p className="mt-1">Be the first to say something.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === auth?.currentUser?.uid;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {isMe ? "You" : msg.senderName}
                    </span>
                  </div>
                  <div 
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[13px] shadow-md leading-relaxed whitespace-pre-wrap break-words
                      ${isMe 
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-zinc-100 rounded-tl-none"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM BAR */}
        <form 
          onSubmit={handleSendMessage} 
          className="p-3 border-t border-white/10 bg-zinc-950/80 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isFirebaseConfigured ? "Type a message..." : "Configure Firebase..."}
            disabled={!isFirebaseConfigured}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || !isFirebaseConfigured}
            className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-transform active:scale-95 disabled:opacity-50 disabled:bg-emerald-500 flex items-center justify-center shrink-0 w-8 h-8"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </AppWindow>
  );
}
