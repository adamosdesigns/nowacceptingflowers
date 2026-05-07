import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, Video, Camera, Share2, PenTool, Globe, Target, Instagram, X } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { caseStudies } from "../data/caseStudies";
import { useAccessibility } from "../context/AccessibilityContext";

export function Home() {
  const [videoPlaying, setVideoPlaying] = useState<string | null>(null);
  const { reduceMotion } = useAccessibility();
  
  return (
    <div className="w-full">
      {/* Video Modal */}
      <AnimatePresence>
        {videoPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl p-4 md:p-12 cursor-none" 
            onClick={() => setVideoPlaying(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-[88vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe 
                src={`${videoPlaying}&autoplay=1&loop=1&title=0&byline=0&portrait=0&badge=0&autopause=0&muted=0`} 
                className="absolute inset-0 w-full h-full"
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                title="Video Player"
              ></iframe>
            </motion.div>
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-accent transition-colors p-2 z-[110]" 
              onClick={() => setVideoPlaying(null)}
            >
              <X size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 pb-12 lg:pt-12 lg:pb-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center min-h-[80vh]">
        {/* Text content */}
        <div className="flex flex-col items-start gap-2 justify-center h-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent"
          >
            CREATIVE STUDIO • NYC / MIA
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-9xl lg:text-[80px] xl:text-[110px] 2xl:text-[130px] font-bebas uppercase leading-[0.85] tracking-tight mb-2 text-balance"
          >
            YOUR CREATIVE PARTNERS, <span className="text-accent italic">NOT A ONE-OFF POST</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-offwhite/60 max-w-xl font-light leading-tight text-balance mb-4"
          >
            We help businesses turn rough ideas, real experiences, and everyday operations into brands people can see, trust, and want to be part of.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2"
          >
            <Link to="/apply" className="bg-accent text-charcoal px-10 py-5 rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 group">
              Let's Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="border border-divider px-10 py-5 rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-offwhite hover:text-charcoal transition-all flex items-center justify-center gap-2 group">
              View the Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:max-w-none mx-auto lg:mt-0 lg:w-1/2">
          {/* Left: Yuzu Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full aspect-[9/16] rounded-xl overflow-hidden relative group cursor-none block h-full flex-shrink-0"
            onClick={() => setVideoPlaying("https://player.vimeo.com/video/1189896982?badge=0&autopause=0&player_id=0&app_id=58479")}
            data-cursor="play"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
               <iframe 
                src={`https://player.vimeo.com/video/1189896982?badge=0&autopause=0&player_id=0&app_id=58479${reduceMotion ? '' : '&autoplay=1&muted=1&loop=1&background=1'}`} 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture;" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full aspect-[9/16] scale-[1.1] pointer-events-none"
                title="Yuzu - Reel"
              ></iframe>
            </div>
            {/* Transparent overlay to catch events and preserve custom cursor */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
               <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold text-accent">Featured Reel</div>
               <div className="text-sm font-medium">Yuzu Experience</div>
            </div>
          </motion.div>
          
          {/* Right: Yossi G Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full aspect-[9/16] rounded-xl overflow-hidden relative group cursor-none block h-full"
            onClick={() => setVideoPlaying("https://player.vimeo.com/video/1189898821?badge=0&autopause=0&player_id=0&app_id=58479")}
            data-cursor="play"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <iframe 
                src={`https://player.vimeo.com/video/1189898821?badge=0&autopause=0&player_id=0&app_id=58479${reduceMotion ? '' : '&autoplay=1&muted=1&loop=1&background=1'}`} 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture;" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full aspect-[9/16] scale-[1.1] pointer-events-none"
                title="Yossi G - Reel"
              ></iframe>
            </div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold text-accent">Design Focus</div>
                <div className="text-sm font-medium">Yossi G Interiors</div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Brand Ticker - Single Row, Slow */}
      <section className="py-12 border-t border-b border-divider bg-charcoal overflow-hidden w-full">
        <div className="mix-blend-plus-lighter">
           <div className="flex w-max animate-ticker items-center text-4xl md:text-5xl font-bebas uppercase tracking-wide opacity-30 whitespace-nowrap">
             {"COLGATE • DURACELL • TINDER • F1 • FANATICS • CASPER • WALMART • PROCTOR AND GAMBLE • SONY MUSIC • FIRST REPUBLIC BANK • BELKIN • FANDANGO • OVHCLOUD • FEED THE CHILDREN • FORD • ".repeat(4)}
           </div>
        </div>
      </section>

      {/* 4. Featured Case Studies */}
      <section className="py-16 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-6">
            <div>
              <span className="text-accent text-xs uppercase tracking-widest block mb-4">Case Studies</span>
              <h2 className="text-6xl md:text-8xl lg:text-[110px] font-bebas uppercase tracking-normal mb-6 text-balance leading-[0.8]">Selected stories, built for <span className="text-accent">attention</span>.</h2>
              <p className="text-offwhite/60 text-lg md:text-2xl leading-tight text-balance font-light max-w-4xl">
                Customers form an opinion before they ever reach out. We create content that makes your business feel credible, considered, and worth remembering.
              </p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-start mb-8">
          {[
            { id: 1, title: "Social Storytelling", img: "https://images.unsplash.com/photo-1542038784358-122967edc3f3?auto=format&fit=crop&q=80&w=600", cat: "Video" },
            { id: 2, title: "The High End", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600", cat: "Photography" },
            { id: 3, title: "Atmosphere", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600", cat: "Direction" },
            { id: 4, title: "Identity", img: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&q=80&w=600", cat: "Branding" }
          ].map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-square bg-divider/10 rounded-[2.5rem] overflow-hidden"
              >
              <img 
                src={item.img} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                alt={item.title}
                draggable="false"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <span className="text-accent text-[10px] uppercase font-bold tracking-widest mb-1">{item.cat}</span>
                <h4 className="text-2xl font-bebas uppercase text-offwhite">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

          <div className="flex justify-start">
            <Link to="/portfolio" className="inline-flex items-center gap-2 border border-divider px-10 py-5 rounded-xl text-[11px] uppercase tracking-widest hover:bg-offwhite hover:text-charcoal transition-all font-bold group">
              View All Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Services Overview */}
      <section className="bg-charcoal border-t border-divider py-16 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-divider/30 border border-divider p-8 md:p-14 rounded-xl flex flex-col items-start">
              <div className="max-w-4xl text-left">
                <span className="text-accent text-xs uppercase tracking-widest mb-4 block">Core Offering</span>
                <h3 className="text-6xl md:text-8xl lg:text-[110px] font-bebas uppercase tracking-tight mb-3 leading-[0.8]">Monthly Content Retainers</h3>
                <p className="text-offwhite/60 text-lg md:text-2xl leading-tight text-balance font-light">
                  Most clients come to us for content. The strongest partnerships become ongoing creative systems — combining video, photography, social media, design, web, and paid creative so the brand shows up consistently everywhere.
                </p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Video Production", desc: "Cinematic short-form content built around the feeling of the business.", icon: Video, url: "/portfolio?category=Video" },
                { title: "Photography", desc: "Food, product, interiors, events, people, and brand atmosphere.", icon: Camera, url: "/portfolio?category=Photography" },
                { title: "Social Media", desc: "Content planning, captions, scheduling, posting, and platform direction.", icon: Share2, url: "/portfolio?category=Social" },
                { title: "Branding & Design", desc: "Logos, visual systems, menus, feed revamps, campaign assets, and brand collateral.", icon: PenTool, url: "/portfolio?category=Branding" },
                { title: "Website Design", desc: "Modern, conversion-focused websites that match the quality of the brand.", icon: Globe, url: "/portfolio?category=Websites" },
                { title: "Paid Creative", desc: "Creative built to help campaigns perform and make marketing systems stickier.", icon: Target, url: "/portfolio?category=Paid" }
              ].map((s, i) => (
                <Link to={s.url} key={i} className="block border border-divider p-10 rounded-[2.5rem] hover:bg-surface-dark transition-colors bg-charcoal group">
                  <s.icon className="w-8 h-8 text-accent mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-2xl font-bebas uppercase tracking-wide mb-4">{s.title}</h3>
                  <p className="text-sm text-offwhite/50 leading-relaxed text-balance">{s.desc}</p>
                </Link>
              ))}
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-start mt-4">
              <Link to="/apply" className="inline-flex items-center gap-2 bg-accent text-charcoal px-12 py-6 rounded-xl text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-colors group">
                Inquire Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Team */}
      <section className="py-16 px-6 lg:px-12 bg-charcoal text-offwhite overflow-hidden border-t border-divider">
        <div className="container mx-auto">
          {/* Team */}
          <div className="bg-divider/5 p-10 md:p-16 rounded-xl border border-divider">
              <div className="mb-6">
                <span className="text-accent text-xs uppercase tracking-widest mb-4 block">Behind the work</span>
                <h2 className="text-6xl md:text-8xl lg:text-[110px] font-bebas uppercase tracking-normal mb-3 leading-[0.8]">OUR TEAM OF EXPERTS</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                {[
                  { name: "Adam", role: "Co-Founder + CEO", img: "/adam_headshot_naf.jpg" },
                  { name: "Ariel", role: "Co-Founder + COO", img: "/ariel_headshot_naf.jpeg" },
                  { name: "Stephanie", role: "Strategy Lead", img: "/steph_headshot_naf.jpeg" },
                  { name: "Yuri", role: "Content Team", img: "/yuri_headshot_naf.jpg" },
                  { name: "David", role: "Content Team", img: "/david_headshot_naf.jpeg" },
                  { name: "Irelyn", role: "Content Team", img: "/irelyn_headshot_naf.png" },
                  { name: "Sammy", role: "Client Success", img: "/sammy_headshot_naf.jpg" },
                  { name: "Mia", role: "Client Success", img: "/mia_headshot_naf.png" }
                ].map((person, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="aspect-[3/4] rounded-2xl bg-divider overflow-hidden group">
                      <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" draggable="false" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-wide">{person.name}</h4>
                      <p className="text-xs uppercase tracking-widest text-accent font-medium opacity-80">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Standalone form removed from Home.tsx - Now in Footer.tsx */}
    </div>
  );
}

function BeforeAfterSlider({ before, after }: { before: string, after: string }) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - container.left) / container.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  return (
    <div 
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="absolute inset-0">
        <img src={after} className="w-full h-full object-cover" alt="After" />
      </div>
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPos}%` }}
      >
        <img src={before} className="w-full h-full object-cover grayscale brightness-50" alt="Before" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-10 shadow-xl flex items-center justify-center"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center -ml-[0.5px]">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-charcoal/20 rounded-full" />
            <div className="w-1 h-3 bg-charcoal/20 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos > 20 ? 1 : 0 }}>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-widest font-bold text-white border border-white/10">Before</div>
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos < 80 ? 1 : 0 }}>
        <div className="bg-accent/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-widest font-bold text-charcoal border border-charcoal/10">After</div>
      </div>
    </div>
  );
}
