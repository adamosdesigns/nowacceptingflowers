import { useEffect } from "react";
import { ContactForm } from "../components/ContactForm";

export function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="w-full pt-6 lg:pt-12 pb-24 px-6 lg:px-12 bg-charcoal text-offwhite min-h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col gap-12 lg:gap-20">
          <div className="max-w-4xl">
            <span className="text-accent text-xs uppercase tracking-widest block mb-4">Inquiry</span>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bebas uppercase tracking-normal mb-8 text-balance leading-[0.8]">
              Let's build something <span className="text-accent">timeless</span>.
            </h1>
            <p className="text-offwhite/60 text-lg md:text-2xl leading-tight text-balance font-light">
              We take on a limited number of clients each month to ensure every project gets our full attention. Tell us about your vision.
            </p>
          </div>
          
          <div className="max-w-4xl">
            <ContactForm isFlush={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
