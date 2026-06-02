import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Instagram, Mail } from "lucide-react";
import { ContactForm } from "../ContactForm";
import { cn } from "../../lib/utils";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isApplyPage = location.pathname === "/apply";

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate handles scroll via ScrollToTop component usually, 
      // but we can be explicit if needed.
    }
  };

  // Don't show the big CTA section on the apply page since it has its own header and form
  if (isApplyPage) {
    return (
      <footer className="w-full bg-charcoal border-t border-divider">
        <div className="py-20 lg:py-[120px] px-6 lg:px-[48px]">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-opacity duration-500">
            {/* Logo & Info */}
            <div className="flex flex-col gap-6">
              <Link to="/" onClick={handleLogoClick}>
                <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-[48px] w-auto self-start hover:opacity-80 transition-opacity" />
              </Link>
              <p className="text-xs uppercase tracking-widest text-offwhite/40 leading-loose max-w-[200px]">
                A boutique creative partner for hospitality, lifestyle, and service-driven brands. 
              </p>
            </div>

            {/* Directory */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Directory</h4>
              <nav className="flex flex-col gap-2 text-[15px] uppercase tracking-widest font-medium text-offwhite/60">
                <Link to="/" className="hover:text-offwhite transition-colors" onClick={(e) => { if(location.pathname === "/") { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); } }}>HOME</Link>
                <Link to="/portfolio" className="hover:text-offwhite transition-colors">PROJECTS</Link>
                <a href="https://shop.nowacceptingflowers.com/" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors">SHOP</a>
                <Link to="/apply" className="hover:text-offwhite transition-colors">INQUIRY</Link>
              </nav>
            </div>

            {/* Core Expertise (SEO) */}
            <div className="flex flex-col gap-6 text-offwhite/60">
              <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Expertise</h4>
              <ul className="flex flex-col gap-2 text-[15px] uppercase tracking-widest font-medium">
                <li>Video Production</li>
                <li>Brand Photography</li>
                <li>Social Media</li>
                <li>Creative Strategy</li>
                <li>Web Design</li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Connect</h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/nowacceptingflowers" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-lg bg-divider/10 flex items-center justify-center text-offwhite hover:bg-accent hover:text-charcoal transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="mailto:grow@nowacceptingflowers.com" 
                  className="w-10 h-10 rounded-lg bg-divider/10 flex items-center justify-center text-offwhite hover:bg-accent hover:text-charcoal transition-all"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
              <p className="text-[11px] opacity-40 uppercase tracking-widest">NYC - MIA - LA</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-divider/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] opacity-40">
            <span>&copy; {new Date().getFullYear()} Now Accepting Flowers. All Rights Reserved.</span>
            <div className="flex gap-8">
              <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-charcoal border-t border-divider">
      {/* 9. Final CTA Section */}
      <section id="inquiry" className="px-6 lg:px-[48px] border-b border-divider py-20 lg:py-[120px] scroll-mt-[88px] sm:scroll-mt-[100px]">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-4xl text-center">
              <span className="text-accent text-sm lg:text-[16px] uppercase tracking-[0.3em] font-bold block mb-3 lg:mb-[12px] text-center">Inquiry</span>
              <h2 className="text-5xl md:text-7xl lg:text-[96px] font-bebas uppercase tracking-normal mb-8 lg:mb-0 leading-[0.8] transition-all text-center">
                Let's create <span className="text-accent italic">greatness</span>
              </h2>
              <p className="text-offwhite/60 text-lg md:text-xl lg:text-[24px] lg:leading-[26px] text-balance font-normal mb-12 lg:mb-[24px] max-w-2xl mx-auto text-center">
                We take on a limited number of clients each month to ensure every project gets our full attention.
              </p>
              
              <Link 
                to="/apply" 
                className="inline-flex items-center justify-center w-full sm:w-auto bg-accent text-charcoal px-12 py-6 rounded-2xl text-xl uppercase tracking-widest font-bold hover:bg-white transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                LET'S WORK
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20 lg:py-[120px] px-6 lg:px-[48px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-opacity duration-500">
          {/* Logo & Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" onClick={handleLogoClick}>
              <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-[48px] w-auto self-start hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-xs uppercase tracking-widest text-offwhite/40 leading-loose max-w-[200px]">
              A boutique creative partner for hospitality, lifestyle, and service-driven brands. 
            </p>
          </div>

          {/* Directory */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Directory</h4>
            <nav className="flex flex-col gap-2 text-[15px] uppercase tracking-widest font-medium text-offwhite/60">
              <Link to="/" className="hover:text-offwhite transition-colors" onClick={(e) => { if(location.pathname === "/") { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); } }}>HOME</Link>
              <Link to="/portfolio" className="hover:text-offwhite transition-colors">PROJECTS</Link>
              <a href="https://shop.nowacceptingflowers.com/" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors">SHOP</a>
              <Link to="/apply" className="hover:text-offwhite transition-colors">INQUIRY</Link>
            </nav>
          </div>

          {/* Core Expertise (SEO) */}
          <div className="flex flex-col gap-6 text-offwhite/60">
            <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Expertise</h4>
            <ul className="flex flex-col gap-2 text-[15px] uppercase tracking-widest font-medium">
              <li>Video Production</li>
              <li>Brand Photography</li>
              <li>Social Media</li>
              <li>Creative Strategy</li>
              <li>Web Design</li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[13.33px] uppercase tracking-[0.2em] font-bold text-accent">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/nowacceptingflowers" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-lg bg-divider/10 flex items-center justify-center text-offwhite hover:bg-accent hover:text-charcoal transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="mailto:grow@nowacceptingflowers.com" 
                className="w-10 h-10 rounded-lg bg-divider/10 flex items-center justify-center text-offwhite hover:bg-accent hover:text-charcoal transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
            <p className="text-[11px] opacity-40 uppercase tracking-widest">NYC - MIA - LA</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-divider/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] opacity-40">
          <span>&copy; {new Date().getFullYear()} Now Accepting Flowers. All Rights Reserved.</span>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
    </footer>
  );
}
