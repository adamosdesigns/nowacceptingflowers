import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/portfolio" },
  { name: "Shop", path: "https://shop.nowacceptingflowers.com/", external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleApplyClick = (e: React.MouseEvent) => {
    const inquirySection = document.getElementById('inquiry');
    if (inquirySection && location.pathname !== '/apply') {
      e.preventDefault();
      inquirySection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const menuLinks = [
    { name: "PROJECTS", path: "/portfolio" },
    { name: "SHOP", path: "https://shop.nowacceptingflowers.com/", external: true },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] pointer-events-none border-b border-divider bg-charcoal/80 backdrop-blur-md"
      >
        <div className="pointer-events-auto px-6 lg:px-[48px]">
          <div className="container mx-auto flex items-center justify-between py-6 lg:py-[24px]">
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="transition-opacity duration-300 hover:opacity-80 flex items-center flex-shrink-0"
            >
              <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-[40px] sm:h-[52px] w-auto" />
            </Link>

            <div className="flex items-center gap-4 sm:gap-6 lg:gap-12">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  to="/"
                  onClick={(e) => { 
                    if(location.pathname === '/') { 
                      e.preventDefault(); 
                      window.scrollTo({top: 0, behavior: 'smooth'}); 
                    } 
                  }}
                  className="text-[15px] uppercase tracking-[0.2em] font-bold hover:text-accent transition-colors"
                >
                  HOME
                </Link>
                {menuLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[15px] uppercase tracking-[0.2em] font-bold hover:text-accent transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={(e) => {
                        const id = link.path.split('#')[1];
                        if (id && location.pathname === '/') {
                          e.preventDefault();
                          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-[15px] uppercase tracking-[0.2em] font-bold hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </nav>

              <Link
                to="/apply"
                className="bg-accent text-charcoal px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base font-bold uppercase hover:bg-offwhite flex items-center justify-center transition-colors duration-300 hidden lg:flex whitespace-nowrap"
              >
                <span>LET'S WORK</span>
              </Link>

              <Link
                to="/apply"
                onClick={handleApplyClick}
                className="bg-accent text-charcoal px-5 py-3 sm:px-8 sm:py-4 rounded-xl text-xs sm:text-sm font-bold uppercase hover:bg-offwhite flex items-center justify-center transition-colors duration-300 hidden xs:flex lg:hidden whitespace-nowrap"
              >
                <span className="hidden sm:block">LET'S WORK</span>
                <span className="block sm:hidden">Inquire</span>
              </Link>
              
              <button
                onClick={toggleMenu}
                className="flex items-center gap-2 bg-surface-dark/50 border border-divider rounded-xl px-4 py-3 sm:px-5 sm:py-4 hover:bg-white/5 transition-colors group lg:hidden"
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <X size={24} className="text-accent" />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="w-6 h-0.5 bg-accent rounded-full transition-transform group-hover:scale-x-110" />
                    <div className="w-6 h-0.5 bg-accent rounded-full transition-transform" />
                    <div className="w-4 h-0.5 bg-accent self-end rounded-full transition-transform group-hover:scale-x-110" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay - Mobile/Tablet Only */}
      <div
        className={cn(
          "fixed inset-0 bg-charcoal z-[90] transition-opacity duration-300 flex flex-col justify-center items-center px-6 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-start space-y-8 text-left mt-12 w-full px-6">
          {menuLinks.map((link) => (
            link.external ? (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noreferrer"
                className="text-5xl sm:text-7xl font-bebas uppercase transition-colors text-offwhite hover:text-accent/60"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  setIsOpen(false);
                  const id = link.path.split('#')[1];
                  if (id && location.pathname === '/') {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-5xl sm:text-7xl font-bebas uppercase text-offwhite hover:text-accent/60 transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          <Link
            to="/apply"
            onClick={toggleMenu}
            className="mt-8 border border-divider rounded-xl px-10 py-5 text-lg uppercase font-bold bg-accent text-charcoal hover:bg-offwhite transition-colors flex items-center justify-center w-full whitespace-nowrap"
          >
            LET'S WORK
          </Link>
        </nav>
      </div>
    </>
  );
}
