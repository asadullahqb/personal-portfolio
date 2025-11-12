import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`group relative rounded-2xl bg-white/80 backdrop-blur ring-1 ring-zinc-200 hover:ring-blue-400 hover:shadow-xl transition duration-300 p-6 flex flex-col ${className}`}>
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.06] transition bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500" />
    </div>
  );
}

