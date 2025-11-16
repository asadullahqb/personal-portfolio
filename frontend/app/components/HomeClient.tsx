"use client";
import { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_KEY = "welcome_message_cache_v2";

function getBackendBaseUrl() {
  const isProd = typeof window !== "undefined"
    ? !/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(window.location.hostname)
    : process.env.NODE_ENV === "production";
  const envUrl = process.env.BACKEND_URL;
  const defProd = "https://personal-portfolio-backend-nm7v.onrender.com";
  const defDev = "http://localhost:8000";
  return isProd ? (envUrl || defProd) : (envUrl || defDev);
}

function getPreferredLanguage(): string {
  const n = typeof navigator !== "undefined" ? navigator.language : "en";
  const base = typeof n === "string" ? n.split("-")[0].toLowerCase() : "en";
  return base || "en";
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
      const langPref = getPreferredLanguage();
      try {
        const cached = typeof window !== "undefined" ? window.localStorage.getItem(CACHE_KEY) : null;
        if (cached) {
          const parsed = JSON.parse(cached);
          const msg = parsed?.message;
          const cachedLang = parsed?.lang;
          const ts = parsed?.ts;
          if (cachedLang === langPref && typeof ts === "number" && Date.now() - ts < CACHE_TTL_MS) {
            setFullText(typeof msg === "string" ? msg : "Welcome.");
            return;
          }
        }
      } catch {}
      try {
        const backendBase = getBackendBaseUrl();
        const response = await fetch(`${backendBase}/welcome/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
        const data = await response.json();
        const msg = data.message ?? "Welcome.";
        const lang = typeof data.language === "string" ? data.language : langPref;
        setFullText(msg);
        try { if (typeof window !== "undefined") window.localStorage.setItem(CACHE_KEY, JSON.stringify({ message: msg, lang, ts: Date.now() })); } catch {}
      } catch {
        setFullText("Welcome.");
      }
    }
    fetchFullText();
  }, []);

  useEffect(() => {
    if (typeof fullText !== "string") return;
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
            fadeTimer = setTimeout(() => { setFaded(false); setDone(true); }, FADE_DURATION);
          }, PAUSE_AFTER_TYPE);
        }
      }
      typeNext();
    }
    return () => { if (typingTimer) clearTimeout(typingTimer); if (pauseTimer) clearTimeout(pauseTimer); if (fadeTimer) clearTimeout(fadeTimer); };
  }, [done, fullText]);

  if (fullText === null) {
    return <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400 text-center">...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight transition-opacity duration-500 text-center"
        style={{ color: "var(--hero-text-color)", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))", opacity: faded ? 0 : 1, transition: `opacity ${500}ms` }}
        aria-label="Welcome"
      >
        {typed}
        <span
          className={`inline-block w-1 sm:w-2 h-8 sm:h-12 ml-1 ${!done ? "animate-pulse" : "opacity-0"}`}
          style={{ backgroundColor: "var(--lion-gold)", opacity: done ? 0 : 0.6 }}
        />
      </h1>
      {done && (
        <button
          onClick={onContinue}
          className="mt-10 px-8 py-3 rounded-full text-white font-semibold shadow-md hover:scale-105 transition transform text-lg focus:outline-none focus:ring-2"
          style={{ background: "var(--action-gradient)" }}
          aria-label="Continue to Tools"
        >
          Continue
        </button>
      )}
    </div>
  );
}

export default function HomeClient() {
  const handleContinue = () => {
    const el = typeof window !== "undefined" ? document.getElementById("tools") : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined" && window.location.hash !== "#tools") {
        history.replaceState(null, "", "#tools");
      }
    }
  };

  useEffect(() => {
    const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!h) return;
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(h);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else if (attempts < 20) {
        attempts++;
        setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full h-full flex flex-col items-center justify-center text-center">
      <TypewriterWelcome onContinue={handleContinue} />
      <div className="absolute bottom-6 right-4 sm:right-6 hidden sm:flex items-center gap-3 z-10">
        <Button href="#home" variant="primary" className="px-0 py-0 w-10 h-10 rounded-full text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll up">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 7.5l6 6-1.4 1.4L12 10.3l-4.6 4.6L6 13.5l6-6z" />
          </svg>
        </Button>
        <Button href="#tools" variant="primary" className="px-0 py-0 w-10 h-10 rounded-full text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll down">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4-6 6z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}