import React from "react";
import Image from "next/image";
import Link from "next/link";

type ActionVariant = "ios" | "android" | "video" | "primary" | "neutral";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: ActionVariant;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const variantClass = (variant: ActionVariant = "neutral") => {
  switch (variant) {
    case "ios":
      return "bg-black text-white hover:bg-zinc-800 focus-visible:ring-black";
    case "android":
      return "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600";
    case "video":
      return "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600";
    case "primary":
      return "bg-gradient-to-r from-[var(--vibrant-mango)] via-[var(--vibrant-sun)] to-[var(--vibrant-tangerine)] text-white hover:brightness-110 focus-visible:ring-[var(--vibrant-mango)]";
    default:
      return "bg-white/70 text-[var(--lion-charcoal)] hover:bg-white/80 focus-visible:ring-[var(--vibrant-teal)]";
  }
};

export default function Button({ href, onClick, variant = "neutral", ariaLabel, children, className = "", style }: ButtonProps) {
  const classes = `inline-flex items-center gap-2 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variantClass(variant)} ${className}`;

  if (href) {
    const isExternal = /^(https?:\/\/|mailto:|tel:)/.test(href);
    if (!isExternal) {
      return (
        <Link href={href} aria-label={ariaLabel} className={classes} style={style}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes} style={style}>
      {children}
    </button>
  );
}

export function StoreButton({ href, variant, label, productName }: { href: string; variant: "ios" | "android" | "video"; label: string; productName: string; }) {
  return (
    <Button href={href} variant={variant} ariaLabel={`${productName} on ${label}`}> 
      {variant === "ios" && (
        <Image
          src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
          alt="Download on the App Store"
          width={150}
          height={50}
          className="h-10 w-auto"
          unoptimized
        />
      )}
      {variant === "android" && (
        <Image
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          width={150}
          height={58}
          className="h-10 w-auto"
          unoptimized
        />
      )}
      {variant === "video" && (
        <span className="inline-flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2c-.3-1.2-1.3-2.1-2.5-2.3C18.6 3.5 12 3.5 12 3.5s-6.6 0-9 .4C1.8 4.1.8 5 0.5 6.2 0.1 8 0.1 12 0.1 12s0 4 .4 5.8c.3 1.2 1.3 2.1 2.5 2.3 2.4.4 9 .4 9 .4s6.6 0 9-.4c1.2-.2 2.2-1.1 2.5-2.3.4-1.8.4-5.8.4-5.8s0-4-.4-5.8zM9.7 15.5V8.5l6.4 3.5-6.4 3.5z" />
          </svg>
          <span className="font-medium">Watch Demo</span>
        </span>
      )}
    </Button>
  );
}
