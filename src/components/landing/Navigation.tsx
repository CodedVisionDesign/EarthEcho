"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faArrowRight } from "@/lib/fontawesome";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Impact", href: "#impact" },
  { name: "Community", href: "#community" },
  { name: "Eco Apps", href: "/apps" },
];

interface NavigationProps {
  /** "dark" = transparent start over dark bg (landing hero). "light" = always frosted glass on light bg. */
  variant?: "dark" | "light";
}

export function Navigation({ variant = "dark" }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // On light pages, always show the scrolled (frosted glass) style
  const showLight = variant === "light" || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          showLight || isMobileMenuOpen
            ? "max-w-[1200px] rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-xl"
            : "max-w-[1400px] bg-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 lg:px-8 transition-all duration-500 ${
            showLight ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <Logo
              size={showLight ? "sm" : "md"}
              textClassName={`transition-all duration-500 ${
                showLight ? "text-charcoal" : "text-white"
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                className={`text-sm transition-colors duration-300 relative group ${
                  showLight
                    ? "text-charcoal/70 hover:text-charcoal"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    showLight ? "bg-charcoal" : "bg-white"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className={`text-sm transition-all duration-500 ${
                showLight
                  ? "text-charcoal/70 hover:text-charcoal"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Sign in
            </a>
            <Button
              variant={showLight ? "primary" : "sunshine"}
              size="sm"
              rightIcon={faArrowRight}
              href="/register"
              className="rounded-full"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${
              showLight ? "text-charcoal" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="h-6 w-6"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 z-50 p-3 text-charcoal hover:text-forest transition-colors"
          aria-label="Close menu"
        >
          <FontAwesomeIcon icon={faXmark} className="h-7 w-7" />
        </button>

        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl font-bold text-charcoal hover:text-forest transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div
            className={`flex gap-4 pt-8 border-t border-gray-200 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: isMobileMenuOpen ? "300ms" : "0ms",
            }}
          >
            <Button
              variant="secondary"
              size="lg"
              href="/login"
              className="flex-1 rounded-full"
            >
              Sign in
            </Button>
            <Button
              variant="primary"
              size="lg"
              href="/register"
              className="flex-1 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
