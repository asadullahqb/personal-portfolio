import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`group relative rounded-2xl backdrop-blur ring-1 ring-[rgba(27,77,62,0.35)] ring-offset-1 shadow-sm hover:ring-[var(--lion-amber)] hover:shadow-xl transition duration-300 p-6 flex flex-col overflow-visible ${className}`} style={{ background: "var(--widget-background)" }}>
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.08] transition" style={{ background: "var(--background-gradient)" }} />
    </div>
  );
}
