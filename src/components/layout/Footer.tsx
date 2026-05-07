import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Instagram } from "lucide-react";
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
        <div className="pt-16 pb-12 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-opacity duration-500">
            {/* Logo & Info */}
            <div className="flex flex-col gap-6">
              <Link to="/" onClick={handleLogoClick}>
                <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-10 w-auto self-start hover:opacity-80 transition-opacity" />
              </Link>
              <p className="text-xs uppercase tracking-widest text-offwhite/40 leading-loose max-w-[200px]">
                A boutique creative partner for hospitality, lifestyle, and service-driven brands. 
              </p>
            </div>

            {/* Directory */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Directory</h4>
              <nav className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium text-offwhite/60">
                <Link to="/" className="hover:text-offwhite transition-colors" onClick={(e) => { if(location.pathname === "/") { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); } }}>Home</Link>
                <Link to="/portfolio" className="hover:text-offwhite transition-colors">Portfolio</Link>
                <a href="https://shop.nowacceptingflowers.com/" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors">Shop</a>
                <Link to="/apply" className="hover:text-offwhite transition-colors">Apply / Inquiry</Link>
              </nav>
            </div>

            {/* Core Expertise (SEO) */}
            <div className="flex flex-col gap-6 text-offwhite/60">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Expertise</h4>
              <ul className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium">
                <li>Video Production</li>
                <li>Brand Photography</li>
                <li>Social Media</li>
                <li>Creative Strategy</li>
                <li>Web Design</li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Connect</h4>
              <div className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium text-offwhite/60">
                <a href="https://instagram.com/nowacceptingflowers" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors flex items-center gap-2">
                  <Instagram size={12} /> Instagram
                </a>
                <a href="mailto:grow@nowacceptingflowers.com" className="hover:text-offwhite transition-colors">grow@nowacceptingflowers.com</a>
                <p className="mt-2 text-[10px] opacity-40">Based in New York — Miami — Beyond</p>
              </div>
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
      {/* 9. Final CTA / Form Section */}
      <section className="px-6 lg:px-12 border-b border-divider py-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="pt-0">
            <span className="text-accent text-xs uppercase tracking-widest block mb-4">Let's Work</span>
            <h2 className="font-bebas uppercase tracking-tight mb-6 text-balance leading-[0.8] transition-all text-5xl md:text-7xl lg:text-[100px]">
              We take on a limited number of clients each month.
            </h2>
            <p className="font-light text-offwhite/60 text-balance leading-tight text-xl">
              If you’re looking for a creative partner who treats the work like it belongs to both of us, send us a message.
            </p>
          </div>
          <div className="w-full">
            <ContactForm isFlush={false} />
          </div>
        </div>
      </section>

      <div className="pt-16 pb-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-opacity duration-500">
          {/* Logo & Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" onClick={handleLogoClick}>
              <img src="/NAF_Logo_White.svg" alt="Now Accepting Flowers" className="h-10 w-auto self-start hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-xs uppercase tracking-widest text-offwhite/40 leading-loose max-w-[200px]">
              A boutique creative partner for hospitality, lifestyle, and service-driven brands. 
            </p>
          </div>

          {/* Directory */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Directory</h4>
            <nav className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium text-offwhite/60">
              <Link to="/" className="hover:text-offwhite transition-colors" onClick={(e) => { if(location.pathname === "/") { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); } }}>Home</Link>
              <Link to="/portfolio" className="hover:text-offwhite transition-colors">Portfolio</Link>
              <a href="https://shop.nowacceptingflowers.com/" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors">Shop</a>
              <Link to="/apply" className="hover:text-offwhite transition-colors">Apply / Inquiry</Link>
            </nav>
          </div>

          {/* Core Expertise (SEO) */}
          <div className="flex flex-col gap-6 text-offwhite/60">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Expertise</h4>
            <ul className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium">
              <li>Video Production</li>
              <li>Brand Photography</li>
              <li>Social Media</li>
              <li>Creative Strategy</li>
              <li>Web Design</li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Connect</h4>
            <div className="flex flex-col gap-2 text-xs uppercase tracking-widest font-medium text-offwhite/60">
              <a href="https://instagram.com/nowacceptingflowers" target="_blank" rel="noreferrer" className="hover:text-offwhite transition-colors flex items-center gap-2">
                <Instagram size={12} /> Instagram
              </a>
              <a href="mailto:grow@nowacceptingflowers.com" className="hover:text-offwhite transition-colors">grow@nowacceptingflowers.com</a>
              <p className="mt-2 text-[10px] opacity-40">Based in New York — Miami — Beyond</p>
            </div>
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
