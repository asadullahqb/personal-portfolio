"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", id: "home" },
  { name: "Tools", id: "tools" },
  { name: "Products", id: "associatedProducts" },
  { name: "Publications", id: "publications" },
  { name: "Mentorship", id: "mentorship" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState(() => {
    const h = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    return navItems.some((item) => item.id === h) ? h : "home";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const updateVar = () => {
      const h = (nav as HTMLElement).offsetHeight;
      document.documentElement.style.setProperty("--navbar-height", `${h}px`);
    };
    updateVar();
    window.addEventListener("resize", updateVar);
    return () => window.removeEventListener("resize", updateVar);
  }, [pathname]);

  // Observe sections to update active nav and URL without scroll jank
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible && visible.target.id && visible.target.id !== active) {
          const id = visible.target.id;
          setActive(id);
          // Only update URL on the root page to avoid losing subnav on subpages
          if (pathname === "/") {
            window.history.replaceState(
              null,
              "",
              id === "home" ? "/" : `/#${id}`
            );
          }
        }
      },
      {
        // Account for fixed navbar height and focus on mid-viewport
        root: null,
        rootMargin: "-32px 0px -40% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [active, pathname]);

  const effectiveActive = pathname && pathname.startsWith("/tools") ? "tools" : active;

  const subNavItems = [
    { name: "Medical Scribe", href: "/tools/scribe" },
    { name: "Coming Soon", href: "/tools/coming-soon" },
  ];
  const currentSubLabel = pathname ? (subNavItems.find((s) => s.href === pathname)?.name || "Tools") : "Tools";

  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded flex items-center justify-center">
            <Image
              src="/lion/datascientist.svg"
              alt="Data Scientist Lion"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-base sm:text-xl md:text-2xl font-bold">
            Asad | Data Scientist
          </span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex space-x-4 lg:space-x-6">
          {navItems.map((item) => {
            const href = item.id === "home" ? "/" : `/#${item.id}`;
            return (
              <a
                key={item.id}
                href={href}
                className={`text-sm lg:text-lg font-medium hover:text-blue-600 transition ${
                  effectiveActive === item.id ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>
        {/* Hamburger (mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {/* Hamburger icon */}
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                // X (close) icon
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger icon
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white shadow animate-fade-in-down">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const href = item.id === "home" ? "/" : `/#${item.id}`;
              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={() => { setMenuOpen(false); }}
                  className={`text-base py-2 text-left font-medium hover:text-blue-600 transition ${
                    effectiveActive === item.id ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {pathname && pathname.startsWith("/tools/") && (
        <div className="border-t border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-11 hidden md:flex items-center">
              <div className="w-full">
                <div className="flex items-center gap-6">
                  {subNavItems.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className={`text-sm font-medium transition-colors ${
                        pathname === s.href
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-11 md:hidden flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[70%]">
                {`Tools > ${currentSubLabel}`}
              </div>
              <button
                onClick={() => setSubMenuOpen((v) => !v)}
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle sub menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {subMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  )}
                </svg>
              </button>
            </div>
            {subMenuOpen && (
              <div className="md:hidden pb-3 animate-fade-in-down">
                <div className="flex flex-col">
                  {subNavItems.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      onClick={() => setSubMenuOpen(false)}
                      className={`py-2 text-sm font-medium transition-colors ${
                        pathname === s.href
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
