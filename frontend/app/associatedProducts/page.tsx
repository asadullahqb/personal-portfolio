"use client";
import Image from "next/image";
import { useRef } from "react";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import SectionHeading from "@/app/components/ui/Heading";
import { StoreButton, default as Button } from "@/app/components/ui/Button";

export default function AssociatedProducts() {

  const products = [
    {
      name: "Senzo Pro",
      summary: "Smart home controls for Senzo Smart Switches.",
      tags: ["Mobile", "IoT", "Smart Switches"],
      links: [
        { label: "App Store", href: "https://apps.apple.com/au/app/senzo-pro/id983961137", type: "ios" },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=my.com.senzo.senzopro2&hl=en-US&pli=1", type: "android" },
      ],
      // Proxy the Apple icon via same-origin API to avoid production CSP/CORS issues
      iconUrl: "/api/icons/apple?appId=983961137",
    },
    {
      name: "Pos Malaysia",
      summary: "Track shipments, calculate postage, and find postcodes.",
      tags: ["Mobile", "Logistics", "Tracking"],
      links: [
        { label: "App Store", href: "https://apps.apple.com/my/app/pos-malaysia/id1325952009", type: "ios" },
      ],
      iconUrl: "/api/icons/apple?appId=1325952009",
    },
    {
      name: "Kawan (Prototype)",
      summary: "A community-focused mobile app concept; demo video only.",
      tags: ["Mobile", "Analytics", "Machine Learning"],
      links: [
        { label: "YouTube", href: "https://youtu.be/39pa-ljV_nU?si=GVuUw38klntyMyzz", type: "video" },
      ],
      iconUrl: "https://img.youtube.com/vi/39pa-ljV_nU/hqdefault.jpg",
    },
  ];

  const badge = (text: string) => <Badge>{text}</Badge>;

  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="associatedProducts"
      className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        {/* Heading */}
        <SectionHeading
          title="Products I’ve Contributed To"
          subtitle="Disclaimer: I do not own these products; I contributed to their development."
          className="mb-0"
        />

        {/* Mobile slider */}
        <div className="md:hidden flex-1 min-h-0 mt-8">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-3 pt-2 pb-2"
            role="region"
            aria-label="Products slider"
            style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          >
            {products.map((p) => (
              <div key={p.name} className="snap-center min-w-[85%]" style={{ scrollSnapStop: "always" }}>
                <Card>
                {/* Icon / Initials */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-zinc-200 bg-white flex items-center justify-center">
                    {p.iconUrl ? (
                      <Image
                        src={p.iconUrl}
                        alt={`${p.name} app icon`}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">{p.name}</h3>
                    <p className="text-sm text-zinc-600">{p.summary}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t}>{badge(t)}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <StoreButton
                      key={l.href}
                      href={l.href}
                      variant={l.type as "ios" | "android" | "video"}
                      label={l.label}
                      productName={p.name}
                    />
                  ))}
                </div>
                </Card>
              </div>
            ))}
        </div>
        </div>

        {/* Desktop/tablet grid */}
        <div className="hidden md:grid flex-1 min-h-0 overflow-visible grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-1 pt-1">
          {products.map((p) => (
            <Card key={p.name}>
              {/* Icon / Initials */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-zinc-200 bg-white flex items-center justify-center">
                  {p.iconUrl ? (
                    <Image
                      src={p.iconUrl}
                      alt={`${p.name} app icon`}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{p.name}</h3>
                  <p className="text-sm text-zinc-600">{p.summary}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t}>{badge(t)}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <StoreButton
                    key={l.href}
                    href={l.href}
                    variant={l.type as "ios" | "android" | "video"}
                    label={l.label}
                    productName={p.name}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Note */}
        <p className="mt-4 text-xs text-zinc-500 text-center">
          Links open in a new tab.
        </p>
      </div>
      <div className="absolute bottom-6 right-4 sm:right-6 flex items-center gap-3 z-10">
        <Button href="#tools" variant="primary" className="px-0 py-0 w-10 h-10 rounded-full text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll up">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 7.5l6 6-1.4 1.4L12 10.3l-4.6 4.6L6 13.5l6-6z" />
          </svg>
        </Button>
        <Button href="#publications" variant="primary" className="px-0 py-0 w-10 h-10 rounded-full text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll down">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4-6 6z" />
          </svg>
        </Button>
      </div>
    </section>
  );
}
