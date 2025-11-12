import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

