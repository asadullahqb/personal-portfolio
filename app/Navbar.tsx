// app/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", id: "home" },
  { name: "Tools", id: "tools" },
  { name: "Publications", id: "publications" },
  { name: "Mentorship", id: "mentorship" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

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
            // Update state first
            setActive(item.id);
            
            // Update URL in a separate microtask to avoid state update during render
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
    // Run once on mount to set initial state
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function and update URL
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(id);
      
      // Update URL after state update
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
          <div className="w-10 h-10 flex-shrink-0 rounded flex items-center justify-center">
            <img 
              src="/lion/datascientist.svg" 
              alt="Data Scientist Lion"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <span className="text-2xl font-bold">
            Asadullah Qamar Bhatti | Data Scientist
          </span>
        </div>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-lg font-medium hover:text-blue-600 transition ${
                active === item.id ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}