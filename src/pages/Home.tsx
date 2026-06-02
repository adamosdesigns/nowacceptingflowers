import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, Video, Camera, Share2, PenTool, Globe, Target, Instagram, X } from "lucide-react";
import { useCms } from "../context/CmsContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { cn } from "../lib/utils";

export function Home() {
  const [videoPlaying, setVideoPlaying] = useState<string | null>(null);
  const { reduceMotion } = useAccessibility();
  const { caseStudies } = useCms();
  
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
      <section className="px-6 pt-10 pb-20 md:px-[48px] md:pt-10 md:pb-[120px]">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Text content */}
            <div className="flex flex-col items-start justify-center w-full lg:w-1/2 lg:pr-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm md:text-[16px] uppercase tracking-[0.3em] font-bold text-accent mb-3 md:mb-[12px]"
              >
                CREATIVE STUDIO • NYC
              </motion.div>
              <h1 
                className="text-5xl md:text-7xl lg:text-7xl xl:text-[96px] font-bebas uppercase leading-[0.85] tracking-tight mb-6 md:mb-0 text-balance font-normal w-full"
              >
                YOUR CREATIVE PARTNERS, <span className="text-accent italic">NOT A ONE-OFF POST</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl lg:text-[24px] text-offwhite/60 max-w-xl font-normal md:leading-[26px] text-balance mb-12 md:mb-[24px]"
              >
                We help businesses turn rough ideas, real experiences, and everyday operations into brands people can see, trust, and want to be part of.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-0 pl-[1px]"
              >
                <Link 
                  to="/apply"
                  className="bg-accent text-charcoal px-10 py-5 rounded-xl text-base uppercase tracking-widest font-bold hover:bg-white transition-colors flex items-center justify-center w-full sm:w-auto whitespace-nowrap"
                >
                  LET'S WORK
                </Link>
                <button 
                  onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-divider text-offwhite px-10 py-5 rounded-xl text-base uppercase tracking-widest font-bold hover:bg-offwhite hover:text-charcoal transition-all flex items-center justify-center w-full sm:w-auto whitespace-nowrap"
                >
                  Explore Projects
                </button>
              </motion.div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-1/2 mx-auto lg:mt-0 lg:h-[485px] lg:w-[600px]">
              {/* Left: Yuzu Video */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full aspect-[9/16] rounded-xl overflow-hidden relative group cursor-none block h-full flex-shrink-0"
                onClick={() => setVideoPlaying("https://player.vimeo.com/video/1197534423?badge=0&autopause=0&player_id=0&app_id=58479")}
                data-cursor="play"
              >
                <div className="absolute inset-0 z-0 pointer-events-none">
                   <iframe 
                    src={`https://player.vimeo.com/video/1197534423?badge=0&autopause=0&player_id=0&app_id=58479${reduceMotion ? '' : '&autoplay=1&muted=1&loop=1&background=1'}`} 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture;" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full aspect-[9/16] scale-[1.1] pointer-events-none"
                    title="Yuzu - Reel"
                  ></iframe>
                </div>
                {/* Transparent overlay to catch events and preserve custom cursor */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                   <div className="text-[13.33px] uppercase tracking-widest opacity-80 font-bold text-accent">YUZU</div>
                   <div className="text-sm font-medium">Restaurant</div>
                </div>
              </motion.div>
              
              {/* Right: Yossi G Video */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="w-full aspect-[9/16] rounded-xl overflow-hidden relative group cursor-none h-full hidden md:block"
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
                    <div className="text-[13.33px] uppercase tracking-widest opacity-80 font-bold text-accent">YOSSI G</div>
                    <div className="text-sm font-medium">Interior Designer</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Brand Ticker - Single Row, Slow */}
      <section className="py-[48px] border-t border-b border-divider bg-charcoal overflow-hidden w-full">
        <div className="mix-blend-plus-lighter">
           <div className="flex w-max animate-ticker items-center text-4xl md:text-5xl font-bebas uppercase tracking-wide opacity-30 whitespace-nowrap">
             {"COLGATE • DURACELL • TINDER • F1 • FANATICS • CASPER • WALMART • PROCTOR AND GAMBLE • SONY MUSIC • FIRST REPUBLIC BANK • BELKIN • FANDANGO • OVHCLOUD • FEED THE CHILDREN • FORD • ".repeat(4)}
           </div>
        </div>
      </section>

       {/* 4. Featured Case Studies */}
      <section id="case-studies" className="py-20 md:py-[120px] px-6 md:px-[48px] scroll-mt-[89px] sm:scroll-mt-[117px]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="w-full">
              <span className="text-accent text-sm md:text-[16px] uppercase tracking-[0.3em] font-bold block mb-3 md:mb-[12px]">Case Studies</span>
              <h2 className="text-5xl md:text-7xl lg:text-7xl xl:text-[96px] font-bebas uppercase tracking-normal mb-8 md:mb-0 text-balance leading-[0.8] max-w-full lg:w-[900px]">Selected stories, built for <span className="text-accent">attention</span></h2>
              <p className="text-offwhite/60 text-lg md:text-xl lg:text-[24px] lg:leading-[26px] text-balance font-light max-w-full lg:w-[896px] mb-6 md:mb-[24px]">
                   Customers form an opinion before they ever reach out. We create content that makes your business feel credible, considered, and worth remembering.
                </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 items-start mb-[24px]">
            {caseStudies.slice(0, 4).map((item, i) => (
                <Link 
                  to={`/work/${item.slug}`}
                  key={item.slug}
                  className="group relative aspect-square bg-divider/10 rounded-[2.5rem] overflow-hidden block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="h-full w-full"
                  >
                    <img 
                      src={item.thumbnail || item.heroImage} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      alt={item.name}
                      draggable="false"
                    />
                  </motion.div>
                </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-accent text-charcoal px-10 py-5 rounded-xl text-base uppercase tracking-widest font-bold hover:bg-white transition-colors whitespace-nowrap"
            >
              VIEW ALL PROJECTS
            </Link>
            <Link 
              to="/apply"
              className="inline-flex items-center justify-center w-full sm:w-auto border border-divider text-offwhite px-10 py-5 rounded-xl text-base uppercase tracking-widest hover:bg-offwhite hover:text-charcoal transition-all font-bold whitespace-nowrap"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Services Overview */}
      <section className="bg-charcoal border-t border-divider py-20 md:py-[120px] px-6 md:px-[48px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-divider/30 border border-divider rounded-[2.5rem] flex flex-col items-start transition-all py-12 px-8 md:pt-[40px] md:pl-[41px] md:pr-[40px] md:pb-[34px]">
              <div className="max-w-4xl text-left">
                <span className="text-accent text-sm md:text-[16px] uppercase tracking-[0.3em] font-bold mb-2 md:mb-[12px] block">Core Offering</span>
                <h3 className="text-5xl md:text-7xl lg:text-7xl xl:text-[96px] font-bebas uppercase tracking-tight mb-8 md:mb-0 leading-[0.8] font-normal">Monthly Content Retainers</h3>
                <p className="text-offwhite/60 text-lg md:text-xl lg:text-[24px] lg:leading-[26px] text-balance font-light mb-12 md:mb-[24px]">
                  Most clients come to us for content. The strongest partnerships become ongoing creative systems — combining video, photography, social media, design, web, and paid creative so the brand shows up consistently everywhere.
                </p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { title: "Video Production", desc: "Cinematic short-form content built around the feeling of the business.", icon: Video, url: "/portfolio?category=Video" },
                { title: "Photography", desc: "Food, product, interiors, events, people, and brand atmosphere.", icon: Camera, url: "/portfolio?category=Photography" },
                { title: "Social Media", desc: "Content planning, captions, scheduling, posting, and platform direction.", icon: Share2, url: "/portfolio?category=Social" },
                { title: "Branding & Design", desc: "Logos, visual systems, menus, feed revamps, campaign assets, and brand collateral.", icon: PenTool, url: "/portfolio?category=Branding" },
                { title: "Website Design", desc: "Modern, conversion-focused websites that match the quality of the brand.", icon: Globe, url: "/portfolio?category=Websites" },
                { title: "Paid Creative", desc: "Creative built to help campaigns perform and make marketing systems stickier.", icon: Target, url: "/portfolio?category=Paid" }
              ].map((s, i) => (
                <Link to={s.url} key={i} className={cn(
                  "block border border-divider rounded-[2.5rem] hover:bg-surface-dark transition-colors bg-charcoal group p-10",
                  i === 0 && "pb-[24px] pl-[42px]"
                )}>
                  <s.icon className="w-8 h-8 text-accent mb-[3px] pl-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-[36px] font-bebas uppercase tracking-wide mb-0 pb-[6px]">{s.title}</h3>
                  <p className="text-[18px] text-offwhite/50 leading-[20px] text-balance">{s.desc}</p>
                </Link>
              ))}
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-4 justify-start mt-[24px]">
              <Link 
                to="/apply"
                className="inline-flex items-center justify-center w-full sm:w-auto bg-accent text-charcoal px-12 py-6 rounded-xl text-base uppercase tracking-[0.3em] font-bold hover:bg-white transition-colors group whitespace-nowrap"
              >
                LET'S WORK
              </Link>
              <button 
                onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center w-full sm:w-auto border border-divider px-12 py-6 rounded-xl text-base uppercase tracking-[0.3em] font-bold hover:bg-offwhite hover:text-charcoal transition-all group whitespace-nowrap"
              >
                EXPLORE PROJECTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Team */}
      <section className="py-20 md:py-[120px] px-6 md:px-[48px] bg-charcoal text-offwhite overflow-hidden border-t border-divider">
        <div className="container mx-auto">
          {/* Team */}
          <div className="bg-divider/5 p-8 md:p-[48px] rounded-xl border border-divider">
              <div className="mb-4">
                <span className="text-accent text-sm md:text-[16px] uppercase tracking-[0.3em] font-bold mb-2 md:mb-[12px] block">Behind the work</span>
                <h2 className="text-5xl md:text-7xl lg:text-7xl xl:text-[96px] font-bebas uppercase tracking-normal leading-[0.8] mb-12 md:mb-[48px]">OUR TEAM OF EXPERTS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
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
                      <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale-0 brightness-100 lg:grayscale lg:brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 transition-all duration-700" draggable="false" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-wide">{person.name}</h4>
                      <p className="text-sm uppercase tracking-widest text-accent font-medium opacity-80">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Standalone form removed - Now in Footer.tsx */}
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
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[13.33px] uppercase tracking-widest font-bold text-white border border-white/10">Before</div>
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos < 80 ? 1 : 0 }}>
        <div className="bg-accent/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[13.33px] uppercase tracking-widest font-bold text-charcoal border border-charcoal/10">After</div>
      </div>
    </div>
  );
}
