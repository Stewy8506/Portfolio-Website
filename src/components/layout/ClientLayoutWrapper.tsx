"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import OnboardingTour from "../ui/OnboardingTour";
import PresenceCursors from "../ui/PresenceCursors";
import EasterEggTips from "../ui/EasterEggTips";
import RadialMenu from "../radial-menu";
import SmoothScroll from "./SmoothScroll";

const LoadingContext = createContext({ isSiteReady: false });

export const useLoading = () => useContext(LoadingContext);

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteReady, setIsSiteReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSiteReady(true);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isSiteReady }}>
      <SmoothScroll>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        <div className={isLoading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700 ease-out"}>
          {children}
        </div>
        {!isLoading && (
          <>
            <OnboardingTour />
            <PresenceCursors />
            <EasterEggTips />
            <RadialMenu />
          </>
        )}
      </SmoothScroll>
    </LoadingContext.Provider>
  );
}
