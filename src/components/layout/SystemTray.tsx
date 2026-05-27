"use client";

import React from "react";
import { Volume2, VolumeX, MessageSquare, Wifi, Search, Terminal, BatteryMedium } from "lucide-react";
import { toast } from "../ui/Toast";
import Magnetic from "../ui/Magnetic";
import { useWindowStore } from "@/store/windowStore";

interface SystemTrayProps {
  setIsSpotlightOpen: (val: boolean) => void;
}

export default function SystemTray({
  setIsSpotlightOpen,
}: SystemTrayProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  // WiFi Action
  const handleWifiClick = () => {
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    if (isOnline) {
      toast("Wi-Fi Connected: 'anv-os-secure' (Signal strength: Strong, 150 Mbps)", "success");
    } else {
      toast("Wi-Fi Disconnected: No active adapters detected.", "error");
    }
  };

  // Battery Action
  const handleBatteryClick = async () => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      try {
        const battery: unknown = await (navigator as unknown as { getBattery: () => Promise<unknown> }).getBattery();
        const navBattery = battery as { level: number; charging: boolean; chargingTime: number; dischargingTime: number };
        const levelPct = Math.round(navBattery.level * 100);
        const state = navBattery.charging ? "Charging ⚡" : "Discharging 🔋";
        const remain = navBattery.chargingTime === Infinity || navBattery.dischargingTime === Infinity
          ? "Adapter Connected"
          : `${Math.round(navBattery.charging ? navBattery.chargingTime / 60 : navBattery.dischargingTime / 60)} mins remaining`;
        toast(`Battery Level: ${levelPct}% (${state} - ${remain})`, "info");
      } catch {
        toast("Battery Level: 100% (AC Power Line Connected)", "info");
      }
    } else {
      toast("Battery Level: 100% (AC Power Line Connected)", "info");
    }
  };
  return (
    <>
      {/* 💬 Global Chat Trigger */}
      <Magnetic strength={0.4}>
        <button
          id="tour-chat"
          onClick={() => openWindow("chat", "chat", "Global Chat")}
          className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
          title="Open Global Chat"
          aria-label="Open Global Chat Window"
        >
          <MessageSquare className="w-4 h-4 md:w-3.5 md:h-3.5 text-emerald-400" />
        </button>
      </Magnetic>

      {/* 📶 WiFi Diagnostic */}
      <Magnetic strength={0.4}>
        <button
          onClick={handleWifiClick}
          className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
          title="WiFi Status"
          aria-label="Check WiFi Status"
        >
          <Wifi className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-300 hover:text-white" />
        </button>
      </Magnetic>

      {/* 🔍 Search / Spotlight Trigger */}
      <Magnetic strength={0.4}>
        <button
          id="tour-spotlight"
          onClick={() => setIsSpotlightOpen(true)}
          className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
          title="Spotlight Search (Cmd+K)"
          aria-label="Open Spotlight Search"
        >
          <Search className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-300 hover:text-white" />
        </button>
      </Magnetic>

      {/* 💻 Terminal Trigger */}
      <Magnetic strength={0.4}>
        <button
          onClick={() => openWindow("terminal", "terminal", "Terminal (bash)")}
          className="hidden md:flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
          title="Open Terminal (Cmd+Q)"
          aria-label="Open Terminal Window"
        >
          <Terminal className="w-4 h-4 md:w-3.5 md:h-3.5 text-emerald-400 hover:text-white" />
        </button>
      </Magnetic>

      {/* 🔋 Battery Diagnostic */}
      <Magnetic strength={0.4}>
        <button
          onClick={handleBatteryClick}
          className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
          title="Power & Battery Status"
          aria-label="Check Battery Status"
        >
          <BatteryMedium className="w-5 h-5 md:w-4 md:h-4 text-zinc-300 hover:text-white" />
        </button>
      </Magnetic>
    </>
  );
}
