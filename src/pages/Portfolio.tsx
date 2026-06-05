import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { motion, AnimatePresence } from "motion/react";
import { CaseStudy } from "../data/caseStudies";

const CATEGORIES = [
  "All",
  "Video",
  "Brand Identity",
  "Websites",
  "Photography",
  "Graphics"
];

export function matchesSectionCategory(section: any, category: string): boolean {
  if (category === "All") return true;
  const type = (section.type || "").toLowerCase().trim();
  
  if (type) {
    if (category === "Video") {
      return type === "video";
    }
    if (category === "Brand Identity") {
      return type === "branding" || type === "logo";
    }
    if (category === "Websites") {
      return type === "website";
    }
    if (category === "Photography") {
      return type === "photography";
    }
    if (category === "Graphics") {
      return type === "graphics" || type === "social" || type === "menu";
    }
    return false;
  }

  const service = (section.serviceName || "").toLowerCase();
  const title = (section.title || "").toLowerCase();
  const desc = (section.description || "").toLowerCase();
  const url = (section.mediaUrl || "").toLowerCase();
  
  const tokens = [service, title, desc, url];
  
  if (category === "Video") {
    return tokens.some(t => t.includes("video") || t.includes("production") || t.includes("reel") || t.includes("film") || t.includes("vimeo") || t.includes("youtube") || t.includes("youtu.be"));
  }
  if (category === "Brand Identity") {
    return tokens.some(t => t.includes("brand") || t.includes("logo") || t.includes("naming") || t.includes("identity") || t.includes("design") || t.includes("branding"));
  }
  if (category === "Websites") {
    return tokens.some(t => t.includes("web") || t.includes("digital experience") || t.includes("platform") || t.includes("site") || t.includes("internet"));
  }
  if (category === "Photography") {
    return tokens.some(t => t.includes("photo") || t.includes("portrait") || t.includes("shoot") || t.includes("photography") || t.includes("art direction"));
  }
  if (category === "Graphics") {
    return tokens.some(t => t.includes("graphic") || t.includes("social") || t.includes("instagram") || t.includes("post") || t.includes("motion graphics") || t.includes("artwork") || t.includes("menu"));
  }
  return false;
}

export function Portfolio() {
  const { caseStudies, loading } = useCms();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("filter") || "All";

  const setActiveCategory = (category: string) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ filter: category });
    }
  };

  // Filter unique client case studies matching active category
  const filteredStudies = useMemo(() => {
    if (activeCategory === "All") return caseStudies;
    return caseStudies.filter(study => 
      study.sections?.some(sec => matchesSectionCategory(sec, activeCategory))
    );
  }, [caseStudies, activeCategory]);

  return (
    <div className="w-full min-h-screen bg-charcoal text-offwhite selection:bg-accent selection:text-charcoal pr-0">
      {/* Title Hero Block */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-[48px]">
        <div className="max-w-4xl text-left">
          <span className="text-accent text-xs md:text-sm uppercase tracking-[0.4em] font-bold block mb-4">
            Curated Portfolio
          </span>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bebas uppercase leading-[0.85] tracking-tight mb-6"
          >
            A closer look at <span className="text-accent italic">our work</span>
          </h1>
          <p className="text-lg md:text-xl text-offwhite/60 leading-relaxed font-light text-balance max-w-3xl">
            Our content sets a standard before prospects reach out. We shape cinematic visual assets, digital architectures, and tactile identities designed for prestige brands.
          </p>
        </div>
      </section>

      {/* Filter Navigation Block */}
      <section className="px-6 md:px-[48px] pb-10">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 pb-6 border-b border-divider/10">
          <span className="text-offwhite/40 text-[10px] font-mono uppercase tracking-widest mr-4">Filter Service:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-[18px] py-[8px] rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-accent text-charcoal font-bold"
                  : "bg-surface-dark border border-divider/15 hover:border-accent/40 text-offwhite/70 hover:text-offwhite"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Display block */}
      <section className="px-6 md:px-[48px] pb-32">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs opacity-40 uppercase tracking-[0.3em] animate-pulse">
            Resolving Dynamic Content...
          </div>
        ) : activeCategory === "All" ? (
          /* ALL CATEGORY: Standard Client-specific list view study profiles */
          caseStudies.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-divider/15 rounded-2xl">
              <p className="font-mono text-xs text-offwhite/40 uppercase tracking-widest mb-2">No matching case studies found</p>
              <p className="text-xs text-offwhite/25">Please try again later or add case studies from CMS</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {caseStudies.map((study) => (
                  <motion.div
                    key={study.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative"
                  >
                    <Link to={`/work/${study.slug}`} className="block">
                      <div 
                        className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative border border-divider/10 bg-[#0c0c0c] cursor-none"
                        data-cursor="eye"
                      >
                        {/* Grid Background Thumbnail */}
                        <img 
                          src={study.thumbnail} 
                          alt={study.name} 
                          className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                        />

                        {/* Default Bottom Name Plate - Always Visible, No Hover Overlay */}
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                          <div>
                            <h3 className="text-2xl font-bebas uppercase leading-none tracking-normal text-offwhite mb-1 shadow-black/40 drop-shadow-sm">
                              {study.name}
                            </h3>
                            <p className="text-[10px] font-mono text-accent uppercase tracking-widest">
                              {study.industry.split("/")[0].trim()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )
        ) : (
          /* SPECIFIC SERVICE CATEGORY: Display unique client cards showing matching service-focused assets */
          filteredStudies.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-divider/15 rounded-2xl">
              <p className="font-mono text-xs text-offwhite/40 uppercase tracking-widest mb-2">No matching deliverables found</p>
              <p className="text-xs text-offwhite/25">Try adjusting your active filter category</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredStudies.map((study) => {
                  return (
                    <motion.div
                      key={study.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group relative"
                    >
                      <Link to={`/work/${study.slug}?filter=${activeCategory}`} className="block">
                        <div 
                          className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative border border-divider/10 bg-[#0c0c0c] cursor-none"
                          data-cursor="eye"
                        >
                          {/* Grid Background Thumbnail */}
                          <img 
                            src={study.thumbnail} 
                            alt={study.name} 
                            className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                          />

                          {/* Default Bottom Name Plate - Always Visible, No Hover Overlay */}
                          <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                            <div>
                              <h3 className="text-2xl font-bebas uppercase leading-none tracking-normal text-offwhite mb-1 shadow-black/40 drop-shadow-sm">
                                {study.name}
                              </h3>
                              <p className="text-[10px] font-mono text-accent uppercase tracking-widest">
                                {study.industry.split("/")[0].trim()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </section>
    </div>
  );
}
