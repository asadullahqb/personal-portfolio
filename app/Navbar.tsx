// app/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", id: "home" },
  { name: "Tools", id: "tools" },
  { name: "Products", id: "associatedProducts" },
  { name: "Publications", id: "publications" },
  { name: "Mentorship", id: "mentorship" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialize active state from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the #
    if (hash && navItems.some(item => item.id === hash)) {
      setActive(hash);
    }
  }, []);

  // Scroll event to detect current section and update URL
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActive(item.id);
            setTimeout(() => {
              window.history.replaceState(
                null,
                "",
                item.id === "home" ? "/" : `/#${item.id}`
              );
            }, 0);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function and update URL
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(id);
      setMenuOpen(false);
      setTimeout(() => {
        window.history.pushState(
          null,
          "",
          id === "home" ? "/" : `/#${id}`
        );
      }, 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded flex items-center justify-center">
            <img 
              src="/lion/datascientist.svg" 
              alt="Data Scientist Lion"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <span className="text-base sm:text-xl md:text-2xl font-bold">
            Asad | Data Scientist
          </span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm lg:text-lg font-medium hover:text-blue-600 transition ${
                active === item.id ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {item.name}
            </button>
          ))}
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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-base py-2 text-left font-medium hover:text-blue-600 transition ${
                  active === item.id ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}