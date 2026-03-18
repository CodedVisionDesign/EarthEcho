"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faEnvelope } from "@/lib/fontawesome";
import { Logo } from "@/components/ui/Logo";

const footerLinks = {
  Explore: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Impact", href: "#impact" },
    { name: "Eco Apps", href: "/apps" },
  ],
  Product: [
    { name: "Dashboard", href: "/login" },
    { name: "Resources", href: "/login" },
    { name: "Community", href: "/login" },
    { name: "Challenges", href: "/login" },
  ],
  Resources: [
    { name: "Energy Saving Trust", href: "https://energysavingtrust.org.uk" },
    { name: "Sustrans", href: "https://www.sustrans.org.uk" },
    { name: "Waterwise", href: "https://www.waterwise.org.uk" },
    { name: "Cycling UK", href: "https://www.cyclinguk.org" },
    { name: "Vegan Outfitters", href: "https://www.veganoutfitters.com" },
    { name: "Vegan Runners", href: "https://www.veganrunners.co.uk" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export function FooterSection() {
  return (
    <footer className="relative border-t border-charcoal/10 bg-charcoal text-white">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex mb-6">
                <Logo size="md" textClassName="text-white text-lg" />
              </a>

              <p className="text-white/50 leading-relaxed mb-6 max-w-xs">
                Helping individuals track and reduce their environmental
                impact, one habit at a time. Free forever.
              </p>

              <a
                href="mailto:contact@earthecho.co.uk"
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5" aria-hidden />
                contact@earthecho.co.uk
              </a>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-6">
                  {title}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => {
                    const isExternal = link.href.startsWith("http");
                    return (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm text-white/50 hover:text-white transition-colors"
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {link.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/30">
            &copy; {new Date().getFullYear()} EarthEcho. All rights reserved.
          </p>
          
          <div className="flex items-center justify-center md:justify-end">
            <a 
              href="https://codedvisiondesign.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 transition-all duration-300 hover:text-white"
            >
              <FontAwesomeIcon 
                icon={faCode} 
                className="h-3 w-3 text-white/20 transition-colors group-hover:text-leaf" 
                aria-hidden 
              />
              <span>by Coded Vision Design</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
