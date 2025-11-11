"use client";
import Image from "next/image";

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
  ];

  const badge = (text: string) => (
    <span className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 px-2 py-1 text-xs font-medium">
      {text}
    </span>
  );

  const actionClass = (type: "ios" | "android") => {
    if (type === "ios") return "bg-black text-white hover:bg-zinc-800 focus-visible:ring-black";
    return "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600";
  };

  return (
    <section className="w-full py-24 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600">
            Products I’ve Contributed To
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 ">
            Disclaimer: I do not own these products; I contributed to their development.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="group relative rounded-2xl bg-white/80 backdrop-blur ring-1 ring-zinc-200 hover:ring-blue-400 hover:shadow-xl transition duration-300 p-6 flex flex-col"
            >
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
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} on ${l.label}`}
                    className={`inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${actionClass(l.type as "ios" | "android")}`}
                  >
                    {l.type === "ios" ? (
                      <Image
                        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                        alt="Download on the App Store"
                        width={150}
                        height={50}
                        className="h-10 w-auto"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt="Get it on Google Play"
                        width={150}
                        height={58}
                        className="h-10 w-auto"
                        unoptimized
                      />
                    )}
                  </a>
                ))}
              </div>

              {/* Decorative accent */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.06] transition bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500" />
            </div>
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
