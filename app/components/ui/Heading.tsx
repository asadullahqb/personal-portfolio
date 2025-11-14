import React from "react";

export default function SectionHeading({ title, subtitle, className = "mb-10" }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-zinc-600 ">{subtitle}</p>
      )}
    </div>
  );
}
