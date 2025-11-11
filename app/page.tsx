"use client";

import { useEffect, useState, useRef } from "react";
import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";
import AssociatedProducts from "./associatedProducts/page";

// Determine backend URL based on environment (dev or prod)
// Now respects the 'env' function argument instead of only using runtime detection
function getBackendBaseUrl(env: 'development' | 'production' = 'development') {
  // 1. Check explicitly provided env
  if (env === 'production') {
    // Prefer environment variables when available
    if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_BACKEND_URL__) {
      return (window as any).__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    // Fallback: recognize typical prod domain
    if (typeof window !== "undefined" && window.location && window.location.hostname.includes("your-production-domain.com")) {
      return "https://personal-portfolio-backend-nm7v.onrender.com";
    }
    // Default to production backend
    return "https://personal-portfolio-backend-nm7v.onrender.com";
  } else {
    // env == 'development'
    // Allow override for local development as well
    if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_BACKEND_URL__) {
      return (window as any).__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    // Default to localhost for dev
    return "http://localhost:8000";
  }
}

function getUserIP(): string | undefined {
  // Fix: safely extract __NEXT_PUBLIC_USER_IP__ if it's defined globally
  // TypeScript fix: cast to any so that window['__NEXT_PUBLIC_USER_IP__'] doesn't complain
  if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_USER_IP__) {
    return (window as any).__NEXT_PUBLIC_USER_IP__;
  }
  return undefined;
}

function TypewriterWelcome() {
  // Remove hardcoded FULL_TEXT, fetch from backend instead
  const [fullText, setFullText] = useState<string | null>(null);
  const ANIMATION_DELAY = 120;
  const PAUSE_AFTER_TYPE = 600;
  const FADE_DURATION = 500;

  const [typed, setTyped] = useState("");
  const [faded, setFaded] = useState(false);
  const [done, setDone] = useState(false);

  // Fetch FULL_TEXT from FastAPI backend
  useEffect(() => {
    async function fetchFullText() {
      try {
        const backendBase = getBackendBaseUrl('production');
        const response = await fetch(`${backendBase}/welcome/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          // Fix: safely retrieve user IP or pass undefined if not available
          body: JSON.stringify({
            ip: getUserIP()
          })
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        const data = await response.json();
        console.log(data);
        // Assume API returns 
        setFullText(data.message ?? "Welcome.");
      } catch (err) {
        // Fallback on error
        setFullText("Welcome.");
      }
    }
    fetchFullText();
  }, []);



  useEffect(() => {
    if (typeof fullText !== "string") return; // Wait for API

    let typingTimer: NodeJS.Timeout | null = null;
    let pauseTimer: NodeJS.Timeout | null = null;
    let fadeTimer: NodeJS.Timeout | null = null;

    if (!done) {
      let idx = 0;

      function typeNext() {
        if (typeof fullText === "string" && idx <= fullText.length) {
          setTyped(fullText.slice(0, idx));
          idx++;
          typingTimer = setTimeout(typeNext, ANIMATION_DELAY);
        } else {
          pauseTimer = setTimeout(() => {
            setFaded(true);
            fadeTimer = setTimeout(() => {
              setFaded(false);
              setDone(true);
            }, FADE_DURATION);
          }, PAUSE_AFTER_TYPE);
        }
      }
      typeNext();
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (pauseTimer) clearTimeout(pauseTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
    // eslint-disable-next-line
  }, [done, fullText]);

  // If loading, show nothing or a spinner (optional)
  if (fullText === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-none">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400">
          ...
        </div>
      </div>
    );
  }

  // Use flexbox to center both vertically and horizontally and ensure max available height on all screen sizes
  return (
    <div className="w-full h-screen flex items-center justify-center bg-none overflow-hidden">
      <div
        className="w-full max-w-4xl px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center"
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold transition-opacity duration-500 inline-block"
          style={{
            opacity: faded ? 0 : 1,
            transition: `opacity ${FADE_DURATION}ms`,
          }}
          aria-label="Welcome"
        >
          {typed}
          <span
            className={`inline-block w-1 sm:w-2 h-8 sm:h-12 ml-1 ${!done ? 'animate-pulse' : 'opacity-0'}`}
            style={{
              backgroundColor: "#222",
              opacity: done ? 0 : 0.6,
            }}
          />
        </h1>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section
        id="home"
        className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-0 m-0"
        style={{ position: "relative" }}
      >
        {/* TypewriterWelcome now fully centers itself both vertically/horizontally */}
        <TypewriterWelcome />
      </section>

      <section id="tools" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Tools />
      </section>

      <section id="associatedProducts" className="min-h-screen flex items-center justify-center bg-gray-50">
        <AssociatedProducts />
      </section>

      <section id="publications" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Publications />
      </section>

      <section id="mentorship" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Mentorship />
      </section>
    </main>
  );
}