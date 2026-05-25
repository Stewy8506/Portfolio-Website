# 🧠 Project: non_disclosure.exe (anv os)

```
              _  __             ___  ____  
  /\_/\      / |/ /__    _ __  / _ \/ ___| 
 ( o.o )    /    / _ \  | '_ \| | | \___ \ 
  > ^ <    /    / (_) | | |_) | |_| |___) |
 /_/ \_\  /_/|_/ \___/  | .__/ \___/|____/ 
                        |_|                
```

> **Warning: This repository is a sentient environment.** If you are reading this, you have already initialized the session. You are now part of the ecosystem.

> [!IMPORTANT]
> **Proprietary & Private Source Notice:** This repository is the personal portfolio of Anuvab Das. All rights reserved. The source code, assets, UI designs, and system concepts are strictly proprietary. Copying, distributing, cloning, modifying, or redeploying this application (either in part or in whole) for public, commercial, or personal use is strictly prohibited.

---

## 🚨 System Status

![Environment: Production](https://img.shields.io/badge/environment-production-emerald?style=for-the-badge&logo=vercel)
![Stability: Schrödinger's Build](https://img.shields.io/badge/stability-schrödinger's%20build-yellow?style=for-the-badge&logo=statuspage)
![Bugs: Features](https://img.shields.io/badge/bugs-promoted%20to%20features-sky?style=for-the-badge&logo=bugsnag)
![Framework: Next.js 16](https://img.shields.io/badge/framework-next.js%2016-black?style=for-the-badge&logo=nextdotjs)
![Styling: Tailwind 4](https://img.shields.io/badge/styling-tailwind%204-cyan?style=for-the-badge&logo=tailwindcss)

---

## 🖥️ What is anv os?

`anv os` is a highly immersive, operating-system-inspired portfolio ecosystem masquerading as a modern portfolio. It blends the robust performance of low-level systems architectures with premium, high-fidelity front-end experiences, creating an environment that responds dynamically to your presence.

### 🌟 Visual Highlights & Interactions

*   🌐 **Three.js Particle Nebula:** A fluid background comprising `7,000` particles running active spring-back physics, mouse repulsion mechanics, and three-dimensional camera parallax.
*   ⏳ **Boot Diagnostics Terminal:** A realistic UNIX-style loading screen displaying core system logs, custom layered svg loading indicators, and boot percentages before launching.
*   🧭 **macOS/iOS Interactive Dock:** A bottom navigation bar featuring magnetic hover expansion, audio feedback, tooltips, and scrolling auto-hide.
*   🔍 **Spotlight Command Palette (Cmd + K):** A global search command overlay with interactive category matching, Arrow-key navigation, and Enter key action execution.
*   🎧 **Lofi Streamer Integration:** A top menu widget embedding soothing lofi streams (*Yasumu - We Met*) using the YouTube Iframe API, with a sleek slide-out volume slider.
*   💬 **Global Anonymous Lobby:** A real-time Firestore chat window featuring random animal/adjective nickname generation, drag-to-resize panel controls, online user estimates, and real-time syncing.
*   🔒 **Admin Console Suite:** A protected, cookie-verified administrative page with automatic routing and feedback handling.

---

## 🧬 Tech Stack

### Front-End Foundations
*   **Next.js 16 (App Router):** Fast, modern React framework utilizing server components and middleware protection.
*   **TypeScript:** Type-safe development with legal immunity against JavaScript anomalies.
*   **Tailwind CSS v4 & PostCSS:** Curated dark-themed tokens, noise filters, and glassmorphic layers held together by strict modern layout rules.
*   **Framer Motion 12:** Smooth micro-animations, spring dynamics, drag controllers, and exit-entry layout state transitions.

### 3D Render & Audio Pipeline
*   **React Three Fiber (R3F) & Drei:** WebGL canvas hosting active gravity particle systems and camera perspective matrices.
*   **YouTube Player API:** Asynchronous hidden player streams.
*   **useSoundEffect Hooks:** Context-aware UI action hums and keyboard thoccs.

### Backend & Storage
*   **Firebase / Firestore:** Serverless architecture handling anonymous authentication and real-time document listeners.
*   **Nodemailer:** Automated SMTP relays sending secure feedback reports.

---

## 📁 Repository Blueprint & Core Subsystems

`anv os` is structured as a zero-dependency-inspired workspace utilizing a highly componentized architecture. The source files are organized into atomic visual widgets, responsive layouts, data layers, and custom Hooks:

```
portfolio-app/
├── src/
│   ├── app/                      # Next.js 16 App Router Layouts, APIs & Console
│   │   ├── admin/                # Passcode-protected administrative gateway
│   │   ├── api/                  # Serverless endpoint handlers (SMTP, DB, GitHub metrics)
│   │   ├── projects/             # Multi-view projects visualization routes
│   │   ├── layout.tsx            # Root shell implementing noise overlays & client-side providers
│   │   ├── page.tsx              # Home shell housing viewport sections
│   │   └── template.tsx          # Fader animations for page-state transitions
│   ├── components/
│   │   ├── layout/               # High-level layouts (System MenuBar, Magnetic Dock)
│   │   ├── sections/             # Section-level content (Hero, About, Bento/Cinematic Projects, Skills)
│   │   └── ui/                   # Immersive system visual widgets & custom controls
│   ├── data/                     # Read-only static registries (JSON files for Skills & Projects)
│   ├── hooks/                    # Hook controllers for auditory and keyboard states
│   ├── lib/                      # Core wrappers (Firebase instances, cookie guards, security logic)
│   └── middleware.ts             # Active HTTP filter checking admin session tokens
└── package.json                  # Engine versioning, Tailwind v4 and React 19 configuration
```

---

## 🧬 Deep Dive: System Subsystems

To understand how the codebase orchestrates this high-fidelity experience, here is a detailed breakdown of the internal sub-systems:

### 1. The Rendering Layer (`src/components/ui/DynamicBackground.tsx`)
*   **Three.js Physics Engine:** Powered by React Three Fiber, this component hosts `7,000` interactive particles mapped onto dynamic buffer geometries.
*   **Vector Repulsion & Spring Dynamics:** The particle positions are calculated on every frame within a custom shader/render loop. When the custom cursor approaches, active force vectors push coordinates away, before smoothly interpolating back to their initial state via dampening spring physics.
*   **Noise Overlay (`src/components/ui/NoiseOverlay.tsx`):** A custom SVG film-grain filter with micro-opacity loops layered on top of the canvas, giving the portfolio its signature raw retro-terminal aesthetic.

### 2. The Acoustic Feedback Pipeline (`src/hooks/useSoundEffect.ts`)
*   **Context-Aware Synths:** Keyboard inputs, menu item selections, spotlight selections, and terminal thoccs use the Web Audio API to play localized sound bytes.
*   **Hidden Lofi Streamer (`src/components/layout/MenuBar.tsx`):** A top-menu panel module which dynamically mounts an asynchronous YouTube iframe container. It captures media controls, overlays a custom slider matching client mouse coords for absolute volume levels, and plays a lo-fi playlist seamlessly in the background.

### 3. Real-Time Telemetry & Lobby Chat (`src/components/ui/ChatWindow.tsx`)
*   **Serverless Data Streams:** Integrates Firestore real-time document listeners to enable anonymous global chat.
*   **Dynamic Nicknames:** Since the chat is anonymous, a client-side hashing mechanism couples dynamic adjectives and animal names to unique user UIDs on-the-fly.
*   **Dynamic Panel Resize:** Combines pointer events and absolute layout constraints to allow dragging, maximizing, minimizing, and absolute positioning of the window pane on the client viewport.

### 4. Search and Action Portal (`src/components/ui/CommandPalette.tsx`)
*   **Spotlight Command Palette:** Instantiated globally through `Ctrl + K` or `Cmd + K` event listeners. 
*   **Instant Query Matching:** Uses client-side token search arrays indexing projects, system files, pages, and terminal commands. Supports fluid arrow key navigation and Enter key action execution, bypassing normal cursor reliance.

### 5. Access Gates & Control Panel (`src/app/admin/` & `src/middleware.ts`)
*   **Passcode Protection:** The administrative endpoint uses client-side cryptographic cookie generation.
*   **Middleware Filtration:** A custom Next.js middleware interrogates every administrative request for these specific cryptographically-verified session cookies, redirecting unauthorized traffic immediately back to the home environment.

---

## 🐛 Diagnostics & Known Anomalies

*   **Custom Nicknames:** Renaming yourself `Admin` in the chat window doesn't bypass administrative cookie gates. The systems are watching.
*   **The Clock:** Clicking the top-right clock toggles 12/24-hour modes, prompting desktop notifications directly. If you hear thoccs when clicking, your sound adapter is operating normally.
*   **The Particles:** If your GPU fan starts sounding like a jet turbine, decrease the particle density count in `DynamicBackground.tsx` from `7000` to `3000`.

---

## 🗿 Final Session Words

You came here looking for a traditional developer resume.

Instead, you found a system.

We advise interacting with the **Spotlight Search (`Ctrl/Cmd + K`)** to locate remaining directories, or checking the **Lobby** to chat anonymously with other active users.

---

## ⚖️ Usage Restrictions & Proprietary Rights

This project is **not open-source** and does **not** carry a permissive license. 

*   **No Redistribution/Deployment:** You may not host, publish, or redeploy this portfolio or any modified version of it under your own name or domain.
*   **No Re-use of Assets & Design:** The unique OS-inspired layouts, Three.js particle nebula configs, interactive terminal logics, and custom UI components are copyrighted property.
*   **Educational Use Only:** Cloning or downloading this repository is permitted **exclusively** for personal educational review or inspecting the code architecture. No other rights are granted.

If you like the design, feel free to use it as inspiration to build your own unique concept, but please do not copy the source code or assets.

---

## 🧍‍♂️ Kernel Maintainer

*   **Developer:** Anuvab Das (Stewy8506)
*   **Status:** Currently debugging a ghost loop that was fixed three builds ago.
