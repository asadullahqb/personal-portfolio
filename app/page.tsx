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
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState<number | undefined>(undefined);

  // Always measure text by a hidden span
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
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

  // Use flexbox to center both vertically and horizontally and ensure max available height on all screen sizes
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none", // Let the section bg show
      }}
    >
      <div
        style={{
          width: textWidth !== undefined ? `${textWidth}px` : "auto",
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
    </main>
  );
}
