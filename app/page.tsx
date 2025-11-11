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

  // Refs for measurement and width lock
  const visibleSpanRef = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState<number | undefined>(undefined);

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

  // Always measure text by a hidden span
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [typed, done, faded, fullText]);

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
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
        }}
      >
        <div
          className="text-6xl font-bold"
          style={{ color: "#999" }}
        >
          ...
        </div>
      </div>
    );
  }

  // Use flexbox to center both vertically and horizontally and ensure max available height on all screen sizes
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none", // Let the section bg show
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: "0 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Hidden span for measuring actual text+cursor width */}
        <span
          ref={measureRef}
          style={{
            opacity: 0,
            pointerEvents: "none",
            whiteSpace: "pre",
            fontSize: "3rem",
            fontWeight: 700,
            fontFamily: "inherit",
            position: "absolute",
            left: 0,
            top: 0,
          }}
          className="text-5xl font-bold"
          aria-hidden="true"
        >
          {typeof fullText === "string" ? fullText : ""}
          <span
            style={{
              display: "inline-block",
              width: "0.5em",
              borderRight: "2px solid #222",
              verticalAlign: "text-bottom"
            }}
          />
        </span>
        <h1
          ref={visibleSpanRef}
          className="text-6xl font-bold transition-opacity duration-500"
          style={{
            opacity: faded ? 0 : 1,
            transition: `opacity ${FADE_DURATION}ms`,
            whiteSpace: "pre",
            minHeight: "1em",
            textAlign: "center",
            margin: 0,
            width: "100%",
          }}
          aria-label="Welcome"
        >
          {typed}
          <span
            style={{
              display: "inline-block",
              width: "0.5em",
              opacity: done ? 0 : 0.6,
              animation: !done ? "blink-cursor 1.1s steps(1) infinite" : "none",
              borderRight: !done ? "2px solid #222" : "none",
              verticalAlign: "text-bottom",
              transition: "opacity 100ms"
            }}
          />
          <style jsx>{`
            @keyframes blink-cursor {
              0% { opacity: 0.6; }
              49% { opacity: 0.6; }
              50% { opacity: 0; }
              100% { opacity: 0; }
            }
          `}</style>
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

      <section id="publications" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Publications />
      </section>

      <section id="mentorship" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Mentorship />
      </section>

      <section id="associatedProducts" className="min-h-screen flex items-center justify-center bg-gray-50">
        <AssociatedProducts />
      </section>
    </main>
  );
}