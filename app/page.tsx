"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";
import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";
import AssociatedProducts from "./associatedProducts/page";

// Determine backend URL based on environment (dev or prod)
function getBackendBaseUrl(env: 'development' | 'production' = 'development') {
  if (env === 'production') {
    const wProd = typeof window !== "undefined" ? (window as unknown as { __NEXT_PUBLIC_BACKEND_URL__?: string }) : undefined;
    if (wProd && wProd.__NEXT_PUBLIC_BACKEND_URL__) {
      return wProd.__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    if (typeof window !== "undefined" && window.location && window.location.hostname.includes("your-production-domain.com")) {
      return "https://personal-portfolio-backend-nm7v.onrender.com";
    }
    return "https://personal-portfolio-backend-nm7v.onrender.com";
  } else {
    const wDev = typeof window !== "undefined" ? (window as unknown as { __NEXT_PUBLIC_BACKEND_URL__?: string }) : undefined;
    if (wDev && wDev.__NEXT_PUBLIC_BACKEND_URL__) {
      return wDev.__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    return "http://localhost:8000";
  }
}

function getUserIP(): string | undefined {
  const w = typeof window !== "undefined" ? (window as unknown as { __NEXT_PUBLIC_USER_IP__?: string }) : undefined;
  if (w && w.__NEXT_PUBLIC_USER_IP__) {
    return w.__NEXT_PUBLIC_USER_IP__;
  }
  return undefined;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_KEY = "welcome_message_cache_v1";

function TypewriterWelcome({ onContinue }: { onContinue?: () => void }) {
  const [fullText, setFullText] = useState<string | null>(null);
  const ANIMATION_DELAY = 120;
  const PAUSE_AFTER_TYPE = 600;
  const FADE_DURATION = 500;

  const [typed, setTyped] = useState("");
  const [faded, setFaded] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function fetchFullText() {
      const ip = getUserIP();
      try {
        const cached = typeof window !== "undefined" ? window.localStorage.getItem(CACHE_KEY) : null;
        if (cached) {
          const parsed = JSON.parse(cached);
          const msg = parsed?.message;
          const cachedIp = parsed?.ip;
          const ts = parsed?.ts;
          if (cachedIp === ip && typeof ts === "number" && Date.now() - ts < CACHE_TTL_MS) {
            setFullText(typeof msg === "string" ? msg : "Welcome.");
            return;
          }
        }
      } catch {}
      try {
        const backendBase = getBackendBaseUrl('production');
        const response = await fetch(`${backendBase}/welcome/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            ip
          })
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        const data = await response.json();
        const msg = data.message ?? "Welcome.";
        setFullText(msg);
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify({ message: msg, ip, ts: Date.now() }));
          }
        } catch {}
      } catch {
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
  }, [done, fullText]);

  // If loading, show nothing or a spinner (optional)
  if (fullText === null) {
    return (
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400 text-center">...</div>
    );
  }

  // Expand welcome to fill viewport, centered both axis
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 transition-opacity duration-500 text-center"
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
      {done && (
        <button
          onClick={onContinue}
          className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white font-semibold shadow-md hover:scale-105 transition transform text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Continue to Tools"
        >
          Continue
        </button>
      )}
    </div>
  );
}

export default function HomePage() {

  // Optional: helper for the continue button (arrow, for keyboard, etc)
  const handleContinue = () => {
    const el = typeof window !== "undefined" ? document.getElementById("tools") : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined" && window.location.hash !== "#tools") {
        history.replaceState(null, "", "#tools");
      }
    }
  };

  return (
    <main className="relative w-full h-full">
      <section
        id="home"
        className="flex items-center justify-center px-4 sm:px-6 md:px-8 font-sans snap-start"
        style={{
          minHeight: "100dvh",
          height: "100dvh",
        }}
      >
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col items-center justify-center text-center">
          <TypewriterWelcome onContinue={handleContinue} />
          <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
            <Button href="#home" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll up">
              <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 7.5l6 6-1.4 1.4L12 10.3l-4.6 4.6L6 13.5l6-6z" />
              </svg>
            </Button>
            <Button href="#tools" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll down">
              <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4-6 6z" />
              </svg>
            </Button>
          </div>
        </div>
      </section>
      <Tools />
      <AssociatedProducts />
      <Publications />
      <Mentorship />
    </main>
  );
}
