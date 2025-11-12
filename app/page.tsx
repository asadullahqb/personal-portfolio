"use client";

import { useEffect, useState, useRef } from "react";
import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";
import AssociatedProducts from "./associatedProducts/page";

// Determine backend URL based on environment (dev or prod)
function getBackendBaseUrl(env: 'development' | 'production' = 'development') {
  if (env === 'production') {
    if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_BACKEND_URL__) {
      return (window as any).__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    if (typeof window !== "undefined" && window.location && window.location.hostname.includes("your-production-domain.com")) {
      return "https://personal-portfolio-backend-nm7v.onrender.com";
    }
    return "https://personal-portfolio-backend-nm7v.onrender.com";
  } else {
    if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_BACKEND_URL__) {
      return (window as any).__NEXT_PUBLIC_BACKEND_URL__;
    }
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    return "http://localhost:8000";
  }
}

function getUserIP(): string | undefined {
  if (typeof window !== "undefined" && (window as any).__NEXT_PUBLIC_USER_IP__) {
    return (window as any).__NEXT_PUBLIC_USER_IP__;
  }
  return undefined;
}

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
      try {
        const backendBase = getBackendBaseUrl('production');
        const response = await fetch(`${backendBase}/welcome/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            ip: getUserIP()
          })
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        const data = await response.json();
        setFullText(data.message ?? "Welcome.");
      } catch (err) {
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
  // For scroll anchor: handle perfect scroll to tools section
  const toolsRef = useRef<HTMLDivElement>(null);

  // Detect fragment (hash) in URL for #tools navigation from navbar
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Listen for hashchange events for smooth scroll
    const handleHashChange = () => {
      if (window.location.hash === "#tools" && toolsRef.current) {
        // Using scrollIntoView with instant/behavior smooth and align to top
        toolsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    // On initial load, if hash is set already scroll
    if (window.location.hash === "#tools" && toolsRef.current) {
      toolsRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Optional: helper for the continue button (arrow, for keyboard, etc)
  const handleContinue = () => {
    if (toolsRef.current) {
      toolsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // Also update hash in URL for consistency (and nav highlight)
      if (typeof window !== "undefined" && window.location.hash !== "#tools") {
        history.replaceState(null, "", "#tools");
      }
    }
  };

  return (
    <main className="relative w-full h-full">
      <section
        id="home"
        className="flex items-center justify-center px-4 sm:px-6 md:px-8 font-sans"
        style={{
          minHeight: "100vh",
          height: "100vh",  // Ensures the welcome covers whole page
        }}
      >
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col items-center justify-center text-center">
          <TypewriterWelcome onContinue={handleContinue} />
        </div>
      </section>

      {/* This div is the anchor for scrolling to Tools */}
      <div ref={toolsRef} id="tools" tabIndex={-1} />

      <section>
        <Tools />
      </section>
      <section id="associatedProducts">
        <AssociatedProducts />
      </section>
      <section id="publications">
        <Publications />
      </section>
      <section id="mentorship">
        <Mentorship />
      </section>
    </main>
  );
}
