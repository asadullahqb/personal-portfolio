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

  const actionClass = (type: "ios" | "android" | "video") => {
    if (type === "ios") return "bg-black text-white hover:bg-zinc-800 focus-visible:ring-black";
    if (type === "android") return "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600";
    return "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600";
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollByCard = (direction: "next" | "prev") => {
    const el = sliderRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.9) * (direction === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="w-full py-24 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <SectionHeading
          title="Products I’ve Contributed To"
          subtitle="Disclaimer: I do not own these products; I contributed to their development."
        />

        {/* Mobile slider */}
        <div className="md:hidden">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-2"
            style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}
          >
            {products.map((p) => (
              <Card key={p.name} className="snap-center min-w-[85%]">
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
          <div className="flex justify-between mt-3">
            <Button onClick={() => scrollByCard("prev")} ariaLabel="Scroll products left">
              ◀ Prev
            </Button>
            <Button onClick={() => scrollByCard("next")} ariaLabel="Scroll products right">
              Next ▶
            </Button>
          </div>
        </div>

        {/* Desktop/tablet grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
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
        <p className="mt-8 text-xs text-zinc-500 text-center">
          Links open in a new tab.
        </p>
      </div>
    </section>
  );
}
