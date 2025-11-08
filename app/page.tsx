"use client";

import { useEffect, useState, useRef } from "react";
import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";

function TypewriterWelcome() {
  const FULL_TEXT = "Welcome.";
  const ANIMATION_DELAY = 120;
  const PAUSE_AFTER_TYPE = 600;
  const FADE_DURATION = 500;

  const [typed, setTyped] = useState("");
  const [faded, setFaded] = useState(false);
  const [done, setDone] = useState(false);

  // Refs for measurement and width lock
  const visibleSpanRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState<number | undefined>(undefined);

  // Measure visible span when text changes, so width is stable even when faded
  useEffect(() => {
    if (visibleSpanRef.current) {
      setTextWidth(visibleSpanRef.current.offsetWidth);
    }
  }, [typed, done, faded]);

  useEffect(() => {
    let typingTimer: NodeJS.Timeout | undefined;
    let pauseTimer: NodeJS.Timeout | undefined;
    let fadeTimer: NodeJS.Timeout | undefined;

    if (!done) {
      let idx = 0;

      function typeNext() {
        if (idx <= FULL_TEXT.length) {
          setTyped(FULL_TEXT.slice(0, idx));
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
  }, [done]);

  // Both visible and invisible span for reliable width lock
  return (
    <div
      style={{
        width: textWidth !== undefined ? `${textWidth}px` : "auto",
        display: "inline-block",
        textAlign: "left",
        verticalAlign: "top",
        position: "relative"
      }}
    >
      {/* Hidden span for measuring actual text+cursor width */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          whiteSpace: "pre",
          fontSize: "3rem",
          fontWeight: 700,
          fontFamily: "inherit"
        }}
        className="text-5xl font-bold"
        aria-hidden="true"
      >
        {FULL_TEXT}
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
        className="text-5xl font-bold transition-opacity duration-500"
        style={{
          opacity: faded ? 0 : 1,
          transition: `opacity ${FADE_DURATION}ms`,
          whiteSpace: "pre",
          minHeight: "1em"
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
  );
}

export default function HomePage() {
  return (
    <main>
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-50">
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
    </main>
  );
}
