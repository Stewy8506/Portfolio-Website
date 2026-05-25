"use client";

import React, { useState } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import OnboardingTour from "../ui/OnboardingTour";
import PresenceCursors from "../ui/PresenceCursors";
import RadialMenu from "../radial-menu";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className={isLoading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700 ease-out"}>
        {children}
      </div>
      {!isLoading && (
        <>
          <OnboardingTour />
          <PresenceCursors />
          <RadialMenu />
        </>
      )}
    </>
  );
}
