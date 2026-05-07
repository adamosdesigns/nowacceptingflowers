import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/portfolio" },
  { name: "Shop", path: "https://shop.nowacceptingflowers.com/", external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] pointer-events-none border-b border-divider bg-charcoal/80 backdrop-blur-md py-4"
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between pointer-events-auto">
          
          {/* Logo - Always Left on mobile, Center on Desktop if needed, but let's keep it simple for now */}
          <div className="flex justify-start flex-shrink-0">
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="transition-opacity duration-300 hover:opacity-80 flex items-center"
            >
              <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-[32px] sm:h-[42px] w-auto" />
            </Link>
          </div>

          {/* Right: Menu Toggle & CTA */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/apply"
              className="bg-accent text-charcoal px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-bold uppercase hover:bg-offwhite flex items-center gap-2 transition-colors duration-300 hidden xs:flex"
            >
              <span className="hidden sm:block">Let's Work</span>
              <span className="block sm:hidden">Inquire</span>
              <ArrowRight size={16} />
            </Link>
            
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 bg-surface-dark border border-divider rounded-lg px-4 py-2 hover:bg-white/5 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="text-sm font-medium hidden md:block">{isOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-charcoal z-40 transition-opacity duration-300 flex flex-col justify-center items-center px-6",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-start space-y-8 text-left mt-12 w-full px-6">
          {links.map((link) => (
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
                  if (location.pathname === link.path) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={cn(
                  "text-5xl sm:text-7xl font-bebas uppercase transition-colors",
                  location.pathname === link.path 
                    ? "text-accent" 
                    : "text-offwhite hover:text-accent/60"
                )}
              >
                {link.name}
              </Link>
            )
          ))}
          <Link
            to="/apply"
            onClick={toggleMenu}
            className="mt-8 border border-divider rounded-xl px-10 py-5 text-lg uppercase font-bold bg-accent text-charcoal hover:bg-offwhite transition-colors flex items-center gap-2"
          >
            Let's Work <ArrowRight size={20} />
          </Link>
        </nav>
      </div>
    </>
  );
}
