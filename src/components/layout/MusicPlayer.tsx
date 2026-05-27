"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "../ui/Toast";
import { useSoundEffect } from "@/hooks/useSoundEffect";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default to 50%
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  
  // Track if we've initialized the player
  const initializedRef = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { playThocc } = useSoundEffect();

  const initYouTubePlayer = () => {
    if (typeof window === "undefined" || initializedRef.current) return;
    setIsLoading(true);
    initializedRef.current = true;

    // 1. Create a hidden element for YouTube player
    let div = document.getElementById("youtube-lofi-player");
    if (!div) {
      div = document.createElement("div");
      div.id = "youtube-lofi-player";
      (div as HTMLElement).style.display = "none";
      (div as HTMLElement).style.position = "absolute";
      (div as HTMLElement).style.width = "0px";
      (div as HTMLElement).style.height = "0px";
      (div as HTMLElement).style.opacity = "0";
      (div as HTMLElement).style.pointerEvents = "none";
      document.body.appendChild(div);
    }

    const initPlayer = () => {
      try {
        if (playerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerRef.current = new (window as any).YT.Player("youtube-lofi-player", {
          height: "0",
          width: "0",
          videoId: "CFGLoQIhmow", // Yasumu - We Met (requested soothing track)
          playerVars: {
            autoplay: 1, // Start playing immediately after it loads
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: "CFGLoQIhmow",
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReady: (event: any) => {
              event.target.setVolume(volume * 100);
              setIsLoading(false);
              setIsPlaying(true);
              toast("Playing: Lofi Music 🎧", "success");
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onStateChange: (event: any) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            }
          },
        });
      } catch (e) {
        console.error("YouTube Player initialization failed", e);
        setIsLoading(false);
      }
    };

    // 2. Load YouTube Iframe API script if not present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      
      // Define or override global callback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(val * 100);
    }
  };

  const toggleMusic = () => {
    if (isLoading) return;

    // Deferred Loading Strategy: Only load the massive YouTube API when they click play
    if (!initializedRef.current) {
      initYouTubePlayer();
      return;
    }

    if (!playerRef.current || typeof playerRef.current.playVideo !== "function") {
      toast("Player is loading... please try again in a moment.", "info");
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        toast("Soothing Stream Paused", "info");
      } else {
        playerRef.current.setVolume(volume * 100);
        playerRef.current.playVideo();
        setIsPlaying(true);
        toast("Playing: Lofi Music 🎧", "success");
      }
    } catch (e) {
      console.error("Playback toggle failed", e);
      toast("Playback blocked. Please interact with the page first.", "error");
    }
  };

  return (
    <div id="tour-lofi" className="group relative flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg hover:bg-white/5 transition-all duration-300">
      <button
        onClick={toggleMusic}
        className="flex items-center justify-center p-0.5 rounded active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
        title={isPlaying ? "Pause Lofi Stream" : "Stream Soothing Lofi"}
        aria-label={isPlaying ? "Pause Background Music" : "Play Background Music"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-sky-400 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 hover:text-white" />
        )}
      </button>

      {/* Dropdown Volume Slider */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex items-center justify-center p-3 bg-zinc-900/90 border border-white/10 rounded-lg backdrop-blur-xl shadow-xl transition-all duration-300 ease-out z-50 origin-top scale-95 group-hover:scale-100">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          style={{
            WebkitAppearance: "none",
            outline: "none",
          }}
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      </div>
    </div>
  );
}
