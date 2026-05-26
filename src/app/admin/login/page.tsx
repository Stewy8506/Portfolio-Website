"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleGitHubLogin = async () => {
    if (!isFirebaseConfigured || !auth) {
      setError("Firebase or GitHub Auth is not configured locally.");
      return;
    }

    setIsGitHubLoading(true);
    setError("");

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract github username
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const githubUsername = (user as any).reloadUserInfo?.screenName || user.displayName || "";

      const res = await fetch("/api/auth/github", {
        method: "POST",
        body: JSON.stringify({
          username: githubUsername,
          email: user.email,
          uid: user.uid,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const errData = await res.json();
        setError(errData.error || "GitHub account is not authorized.");
        await auth.signOut();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate with GitHub");
    } finally {
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-effect p-8 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-zinc-400 mt-2 text-sm">Enter credentials to manage projects</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-white transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
          >
            Login with Password
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 md:bg-zinc-900/40 px-3 text-zinc-500 font-semibold">Or</span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGitHubLogin}
          disabled={isGitHubLoading}
          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {isGitHubLoading ? "Connecting..." : "Sign in with GitHub"}
        </motion.button>
      </motion.div>
    </div>
  );
}
