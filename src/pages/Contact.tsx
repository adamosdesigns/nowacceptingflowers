import { useEffect } from "react";
import { ContactForm } from "../components/ContactForm";

export function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="w-full py-20 lg:py-[120px] px-6 lg:px-[48px] bg-charcoal text-offwhite min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col">
          <div className="max-w-4xl mb-12 lg:mb-[48px]">
            <span className="text-accent text-sm lg:text-[16px] uppercase tracking-[0.3em] font-bold block mb-3 lg:mb-[12px]">Inquiry</span>
            <h1 className="text-5xl md:text-7xl lg:text-[96px] font-bebas uppercase tracking-normal mb-8 lg:mb-0 text-balance leading-[0.8] transition-all">
              Let's create <span className="text-accent italic">greatness</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-[24px] leading-tight lg:leading-[26px] text-balance font-normal max-w-2xl mb-12 lg:mb-[24px]">
              We take on a limited number of clients each month to ensure every project gets our full attention. Tell us about your vision.
            </p>
          </div>
          
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
