"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function OnboardingTour() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (hasSeenTour) return;

    // Wait a short moment for animations/loading to finish before starting
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        steps: [
          {
            element: '#tour-anvos',
            popover: {
              title: 'Welcome to anv os',
              description: 'This is the main system menu. You can use it to navigate around the portfolio and access settings.',
              side: "bottom",
              align: 'start'
            }
          },
          {
            element: '#tour-lofi',
            popover: {
              title: 'Lofi Player',
              description: 'Click here to stream soothing lofi music while you explore. Hover over it to reveal the volume slider!',
              side: "bottom",
              align: 'center'
            }
          },
          {
            element: '#tour-chat',
            popover: {
              title: 'Global Chat',
              description: 'Join the real-time anonymous chat room! Interact with other live visitors here.',
              side: "bottom",
              align: 'center'
            }
          },
          {
            element: '#tour-spotlight',
            popover: {
              title: 'Spotlight Search',
              description: 'Looking for something specific? Press Cmd+K (or Ctrl+K) or click here to search quickly.',
              side: "bottom",
              align: 'end'
            }
          }
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
            driverObj.destroy();
            localStorage.setItem("hasSeenTour", "true");
          }
        },
        onPopoverRender: (popover) => {
          // Inject custom styling for a premium dark mode look
          popover.wrapper.style.borderRadius = '16px';
          popover.wrapper.style.backgroundColor = '#09090b'; // zinc-950
          popover.wrapper.style.color = '#f4f4f5';
          popover.wrapper.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          popover.wrapper.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
          
          const title = popover.title;
          if (title) {
             title.style.color = '#38bdf8'; // sky-400
             title.style.fontSize = '1.1rem';
             title.style.fontWeight = '600';
             title.style.marginBottom = '8px';
          }
          const desc = popover.description;
          if (desc) {
             desc.style.color = '#a1a1aa'; // zinc-400
             desc.style.fontSize = '0.9rem';
             desc.style.lineHeight = '1.5';
          }
          
          const nextBtn = popover.nextButton;
          if (nextBtn) {
             nextBtn.style.backgroundColor = '#38bdf8';
             nextBtn.style.color = '#000';
             nextBtn.style.borderRadius = '8px';
             nextBtn.style.fontWeight = '500';
             nextBtn.style.textShadow = 'none';
          }
          const prevBtn = popover.previousButton;
          if (prevBtn) {
             prevBtn.style.backgroundColor = 'transparent';
             prevBtn.style.color = '#f4f4f5';
             prevBtn.style.border = '1px solid rgba(255,255,255,0.1)';
             prevBtn.style.borderRadius = '8px';
             prevBtn.style.textShadow = 'none';
          }
        }
      });

      driverObj.drive();
    }, 2500); // 2.5s to let the loading screen fade out and user orient

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}
