import React from "react";

export default function SectionHeading({ title, subtitle, className = "mb-10" }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
        style={{ color: "var(--lion-charcoal)", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base" style={{ color: "rgba(30,27,20,0.75)" }}>{subtitle}</p>
      )}
    </div>
  );
}
