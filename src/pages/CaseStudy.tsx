import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, LayoutList, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useCms } from "../context/CmsContext";
import { cn } from "../lib/utils";
import { matchesSectionCategory } from "./Portfolio";
import { PhotographyCarousel } from "../components/PhotographyCarousel";

function cleanAndExtractMediaUrl(url: string): string {
  if (!url) return "";
  let target = url.trim();
  
  // Extract iframe src if they pasted an iframe embed code or similar HTML
  if (target.includes("<iframe") || target.includes("<blockquote") || target.includes("<div") || target.includes("<a ")) {
    const srcMatch = target.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      target = srcMatch[1].replace(/&amp;/g, "&");
    } else {
      const hrefMatch = target.match(/href=["']([^"']+)["']/i);
      if (hrefMatch && hrefMatch[1]) {
        target = hrefMatch[1].replace(/&amp;/g, "&");
      }
    }
  }
  
  return target.trim();
}

function getFirstPhotoOrUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch (e) {
      return trimmed;
    }
  }
  return trimmed;
}

function getInstagramEmbedUrl(url: string) {
  if (!url) return "";
  
  let target = cleanAndExtractMediaUrl(url);

  if (target.includes("instagram.com") || target.includes("instagr.am")) {
    try {
      // Clean up query parameters except /embed
      const urlObj = new URL(target);
      let path = urlObj.pathname;
      if (path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      if (!path.endsWith("/embed")) {
        path = `${path}/embed`;
      }
      return `https://www.instagram.com${path}`;
    } catch {
      // Fallback
      if (!target.endsWith("/embed") && !target.endsWith("/embed/")) {
        const base = target.split("?")[0];
        return `${base}${base.endsWith("/") ? "" : "/"}embed`;
      }
      return target;
    }
  }
  return "";
}

function getVideoEmbedUrl(url: string) {
  if (!url) return "";
  
  let target = cleanAndExtractMediaUrl(url);
  
  if (target.includes("youtube.com") || target.includes("youtu.be")) {
    let videoId = "";
    if (target.includes("youtu.be/")) {
      videoId = target.split("youtu.be/")[1]?.split("?")[0];
    } else if (target.includes("v=")) {
      videoId = target.split("v=")[1]?.split("&")[0];
    } else if (target.includes("embed/")) {
      videoId = target.split("embed/")[1]?.split("?")[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`;
  }
  
  if (target.includes("vimeo.com")) {
    if (target.includes("player.vimeo.com")) {
      try {
        const urlObj = new URL(target);
        urlObj.searchParams.set("autoplay", "1");
        urlObj.searchParams.set("loop", "1");
        urlObj.searchParams.set("autopause", "0");
        urlObj.searchParams.set("badge", "0");
        urlObj.searchParams.set("muted", "1");
        urlObj.searchParams.set("background", "1");
        return urlObj.toString();
      } catch {
        return target;
      }
    }
    
    let videoId = "";
    const parts = target.split("/");
    videoId = parts[parts.length - 1].split("?")[0];
    return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1`;
  }
  
  return target;
}

function getUnmutedVideoEmbedUrl(url: string) {
  if (!url) return "";
  let target = cleanAndExtractMediaUrl(url);
  
  if (target.includes("youtube.com") || target.includes("youtu.be")) {
    let videoId = "";
    if (target.includes("youtu.be/")) {
      videoId = target.split("youtu.be/")[1]?.split("?")[0];
    } else if (target.includes("v=")) {
      videoId = target.split("v=")[1]?.split("&")[0];
    } else if (target.includes("embed/")) {
      videoId = target.split("embed/")[1]?.split("?")[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&showinfo=0`;
  }
  
  if (target.includes("vimeo.com")) {
    let videoId = "";
    if (target.includes("player.vimeo.com")) {
      const parts = target.split("?")[0].split("/");
      videoId = parts[parts.length - 1];
    } else {
      const parts = target.split("?")[0].split("/");
      videoId = parts[parts.length - 1];
    }
    return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0&loop=1`;
  }
  
  return target;
}

export function CaseStudy() {
  const { slug } = useParams();
  const { caseStudies, loading } = useCms();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const study = caseStudies.find(c => c.slug === slug);
  const showParam = searchParams.get("show");
  const filterParam = searchParams.get("filter");
  const focusedIndex = showParam !== null ? parseInt(showParam, 10) : null;
  const isFocusedMode = focusedIndex !== null && !isNaN(focusedIndex) && study && study.sections && focusedIndex >= 0 && focusedIndex < study.sections.length;

  const [activeVideo, setActiveVideo] = React.useState<{ url: string; aspectRatio?: string } | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Prioritize sections matching the filtered service first
  const processedSections = React.useMemo(() => {
    if (!study || !study.sections) return [];
    if (!filterParam || filterParam === "All") return study.sections;
    
    const matching: typeof study.sections = [];
    const nonMatching: typeof study.sections = [];
    
    study.sections.forEach(sec => {
      if (matchesSectionCategory(sec, filterParam)) {
        matching.push(sec);
      } else {
        nonMatching.push(sec);
      }
    });
    
    return [...matching, ...nonMatching];
  }, [study, filterParam]);

  React.useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(e => {
        console.log("Autoplay unmuted blocked, showing controls for user click", e);
      });
    }
  }, [activeVideo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center text-center p-6 text-offwhite selection:bg-accent selection:text-charcoal">
        <div className="flex flex-col items-center max-w-sm gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="w-16 h-16"
          >
            <svg viewBox="0 0 256 256" className="w-full h-full">
              <g transform="translate(128, 128)">
                <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" />
                <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(72)" />
                <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(144)" />
                <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(216)" />
                <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(288)" />
                <circle cx="0" cy="0" r="48" fill="#8E97E8" />
              </g>
            </svg>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent font-bold animate-pulse">
              Nurturing the Digital Greenhouse
            </h2>
            <p className="text-xs text-offwhite/40 tracking-wider">
              Gathering visual assets and layout designs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center text-center p-6 text-offwhite selection:bg-accent selection:text-charcoal">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center max-w-md gap-8"
        >
          {/* Standing Flower Pot/Stem Minimalist Illustration */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-16 h-16"
            >
              <svg viewBox="0 0 256 256" className="w-full h-full">
                <g transform="translate(128, 128)">
                  <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" />
                  <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(72)" />
                  <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(144)" />
                  <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(216)" />
                  <path d="M 0,0 C -48,-45 -45,-105 0,-105 C 45,-105 48,-45 0,0" fill="#8E97E8" transform="rotate(288)" />
                  <circle cx="0" cy="0" r="48" fill="#8E97E8" />
                </g>
              </svg>
            </motion.div>
            
            {/* Subtle sparkling elements */}
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="absolute top-1 right-2 text-accent"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent font-bold block">
              Sprouting in the Greenhouse
            </span>
            <h1 className="text-4xl md:text-5xl font-bebas uppercase tracking-wide text-offwhite leading-[0.9]">
              A Budding Concept is Unfolding
            </h1>
            <p className="text-sm text-offwhite/60 font-sans font-light leading-relaxed max-w-sm mx-auto text-balance">
              Our digital greenhouse is still cultivating this specific showcase. If this petal is taking a moment to bloom, feel free to wander back and explore our fully-grown gallery garden.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 bg-accent text-charcoal px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-charcoal transition-all duration-300 group"
            >
              Explore the Project Garden
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full pt-[40px] pb-[80px] text-offwhite selection:bg-accent selection:text-charcoal flex flex-col gap-[80px]">
      {/* Back to Portfolio Breadcrumb */}
      <div className="container mx-auto px-6 md:px-[48px] -mb-10">
        <Link 
          to="/portfolio" 
          className="inline-flex items-center gap-2 group text-xs font-mono uppercase tracking-[0.2em] text-[#999] hover:text-accent transition-colors py-2"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to Projects Overview
        </Link>
      </div>

      {/* Hero Header Section - Carrying the Client's Profile context through */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 md:px-[48px]"
      >
        <div className="max-w-5xl text-left">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
          >
            {/* Client Section */}
            <div className="md:col-span-3 border-t border-divider/15 pt-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent font-bold block mb-2">
                Client
              </span>
              <p className="text-2xl font-bebas uppercase tracking-wide text-offwhite">
                {study.name}
              </p>
            </div>

            {/* Industry Section */}
            <div className="md:col-span-3 border-t border-divider/15 pt-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent font-bold block mb-2">
                Industry
              </span>
              <p className="text-sm font-mono uppercase tracking-widest text-offwhite/80 font-medium leading-none mt-1">
                {study.industry}
              </p>
            </div>

            {/* Overview Detail Paragraph */}
            <div className="md:col-span-6 border-t border-divider/15 pt-5 text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent font-bold block mb-3">
                Overview
              </span>
              <p className="text-[16px] leading-[20px] text-offwhite/90 font-sans font-light tracking-wide text-balance text-left">
                {study.description}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* RENDER MODE DETERMINATION */}
      {isFocusedMode ? (
        /* ======================== FEATURED SPOTLIGHT MODAL / FOCUS BLOCKS ======================== */
        (() => {
          const section = study.sections[focusedIndex!];
          const cleanUrl = cleanAndExtractMediaUrl(section.mediaUrl);
          const isDirectVideo = cleanUrl.startsWith("data:video/") || 
                               /\.(mp4|webm|ogg|mov)(\?|$)/i.test(cleanUrl);
          const instagramEmbedUrl = getInstagramEmbedUrl(section.mediaUrl);
          const isInstagram = !isDirectVideo && !!instagramEmbedUrl;
          const isVideoUrl = !isDirectVideo && !isInstagram && (
            cleanUrl.includes("vimeo.com") || 
            cleanUrl.includes("vimeo") || 
            cleanUrl.includes("youtube.com") || 
            cleanUrl.includes("youtu.be")
          );
          const isYouTube = !isDirectVideo && !isInstagram && (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be"));

          let aspectClass = "aspect-video"; // Standard cinema
          if (section.aspectRatio === "9:16") {
            aspectClass = "aspect-[9/16] max-w-[340px] md:max-w-[420px]";
          } else if (section.aspectRatio === "1:1") {
            aspectClass = "aspect-square max-w-[500px]";
          } else if (section.aspectRatio === "16:9") {
            aspectClass = "aspect-[16/9] max-w-[840px]";
          } else if (section.aspectRatio === "4:5") {
            aspectClass = "aspect-[4/5] max-w-[420px]";
          }

          return (
            <div className="container mx-auto px-6 md:px-[48px] flex flex-col gap-12">
              {/* Focused Stage Layout */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-divider/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest bg-accent/15 text-accent uppercase border border-accent/25">
                    Spotlight Deliverable ({focusedIndex! + 1}/{study.sections.length})
                  </span>
                  <span className="text-offwhite/45 text-xs font-mono">• {section.serviceName}</span>
                </div>
                
                <button
                  onClick={() => {
                    // Reset show index, returning to linear study
                    setSearchParams({});
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-offwhite/60 hover:text-accent transition-colors"
                >
                  <LayoutList className="w-4 h-4" />
                  View Complete Core Editorial
                </button>
              </div>

              {/* Showcase Split Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] items-center">
                {/* Media stage (focused item) */}
                <div className="lg:col-span-7 flex justify-center items-center w-full">
                  <div 
                    className={cn(
                      "w-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-divider/15 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] relative group",
                      aspectClass
                    )}
                    style={{ aspectRatio: section.aspectRatio ? section.aspectRatio.replace(":", "/") : "16/9" }}
                  >
                    {isDirectVideo ? (
                      <video 
                        src={section.mediaUrl}
                        autoPlay
                        loop
                        playsInline
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : isInstagram ? (
                      <iframe 
                        src={instagramEmbedUrl} 
                        frameBorder="0" 
                        scrolling="no"
                        allowTransparency
                        className="absolute inset-0 w-full h-full"
                        title={section.title}
                      ></iframe>
                    ) : isVideoUrl ? (
                      <>
                        <iframe 
                          src={getUnmutedVideoEmbedUrl(section.mediaUrl)} 
                          frameBorder="0" 
                          allow="autoplay; fullscreen; picture-in-picture;" 
                          className={cn(
                            "absolute inset-0 w-full h-full",
                            isYouTube 
                              ? "scale-[1.20] w-[120%] h-[120%] -left-[10%] -top-[10%] max-w-none" 
                              : "scale-[1.01]"
                          )}
                          title={section.title}
                        ></iframe>
                      </>
                    ) : section.type === "photography" || section.type === "graphics" || (section.mediaUrl && section.mediaUrl.trim().startsWith("[")) ? (
                      <PhotographyCarousel 
                        mediaUrl={section.mediaUrl}
                        aspectRatio={section.aspectRatio}
                        alt={section.title}
                      />
                    ) : (
                      <img 
                        src={section.mediaUrl} 
                        className="w-full h-full object-cover" 
                        alt={section.title} 
                      />
                    )}

                    {/* Seamless Hover and Click Modal Trigger */}
                    {(isDirectVideo || isVideoUrl) && (
                      <div 
                        onClick={() => setActiveVideo({ url: section.mediaUrl, aspectRatio: section.aspectRatio })}
                        className="absolute inset-0 z-30 bg-black/15 hover:bg-black/0 transition-colors duration-500 cursor-none"
                        data-cursor="play"
                      />
                    )}
                  </div>
                </div>

                {/* Conceptual metadata and writeup stage */}
                <div className="lg:col-span-5 text-left flex flex-col justify-center">
                  <div className="mb-2">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.4em] font-extrabold">
                      {section.serviceName.toUpperCase()}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bebas text-accent uppercase leading-[0.9] tracking-wider mb-6">
                    {section.title}
                  </h2>
                  
                  <p className="text-sm md:text-base text-offwhite/80 font-light leading-relaxed mb-6 max-w-md">
                    {section.description}
                  </p>

                  <div className="p-4 rounded-xl bg-surface-dark border border-divider/10 max-w-sm">
                    <div className="flex items-center gap-2 mb-1.5 text-accent">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold">PRESTIGE METRICS</span>
                    </div>
                    <p className="text-[11px] font-mono text-offwhite/50 leading-normal">
                      Delivered as a client-specific asset. Underneath you can inspect remaining elements designed for {study.name}.
                    </p>
                  </div>
                </div>
              </div>

              {/* SWEET BOTTOM CLIENT GRID: More from [CLIENT] */}
              <div className="border-t border-divider/10 pt-12 mt-8 text-left">
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-accent font-bold mb-6">
                  More deliverables for {study.name.toUpperCase()}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {processedSections.map((otherSec, index) => {
                    const originalIndexInStudy = study.sections?.indexOf(otherSec);
                    const isSelf = originalIndexInStudy === focusedIndex;
                    const cleanOtherRaw = cleanAndExtractMediaUrl(otherSec.mediaUrl);
                    const cleanOther = cleanOtherRaw.trim().startsWith("[") 
                      ? getFirstPhotoOrUrl(cleanOtherRaw) 
                      : cleanOtherRaw;
                    const isOtherVideo = cleanOther.startsWith("data:video/") || 
                                         /\.(mp4|webm|ogg|mov)(\?|$)/i.test(cleanOther);

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const nextParams: Record<string, string> = { show: originalIndexInStudy.toString() };
                          if (filterParam) {
                            nextParams.filter = filterParam;
                          }
                          setSearchParams(nextParams);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={cn(
                          "group text-left border rounded-xl overflow-hidden bg-charcoal/20 transition-all duration-300 relative",
                          isSelf 
                            ? "border-accent ring-1 ring-accent bg-accent/[0.03]" 
                            : "border-divider/10 hover:border-accent/40 bg-charcoal/40"
                        )}
                      >
                        <div className="aspect-video w-full bg-black/40 border-b border-divider/10 relative overflow-hidden">
                          {isOtherVideo ? (
                            <video 
                              src={cleanOther} 
                              className="w-full h-full object-cover pointer-events-none opacity-100"
                              muted
                              loop
                              autoPlay
                              playsInline
                            />
                          ) : cleanOther.includes("youtube") || cleanOther.includes("youtu.be") || cleanOther.includes("vimeo") ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-accent/60 group-hover:text-accent font-mono text-[10px] tracking-widest gap-2">
                              <span>▶ PLAY AUDIO/VIDEO</span>
                              <span className="text-[8px] text-offwhite/30 uppercase">{otherSec.serviceName}</span>
                            </div>
                          ) : (
                            <img 
                              src={cleanOther || study.thumbnail} 
                              alt={otherSec.title} 
                              className="w-full h-full object-cover opacity-100 transition-opacity duration-300"
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-charcoal/80 text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border border-divider/10 text-offwhite/40">
                            {otherSec.serviceName.split(" ")[0]}
                          </div>
                        </div>

                        <div className="p-4">
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest block mb-0.5">
                            Segment 0{originalIndexInStudy + 1}
                          </span>
                          <h4 className="text-sm font-mono font-bold uppercase text-offwhite group-hover:text-accent transition-colors truncate">
                            {otherSec.title}
                          </h4>
                        </div>
                        {isSelf && (
                          <div className="absolute bottom-2 right-3">
                            <span className="text-[8px] font-mono text-accent uppercase font-bold">Currently Viewing</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* ======================== CHRONOLOGICAL / METICULOUS LINEAR PORTRAIT ======================== */
        <>
          {processedSections && processedSections.map((section, index) => {
            const isEven = index % 2 === 1;
            const cleanUrl = cleanAndExtractMediaUrl(section.mediaUrl);
            const isDirectVideo = cleanUrl.startsWith("data:video/") || 
                                 /\.(mp4|webm|ogg|mov)(\?|$)/i.test(cleanUrl);
            const instagramEmbedUrl = getInstagramEmbedUrl(section.mediaUrl);
            const isInstagram = !isDirectVideo && !!instagramEmbedUrl;
            const isVideoUrl = !isDirectVideo && !isInstagram && (
              cleanUrl.includes("vimeo.com") || 
              cleanUrl.includes("vimeo") || 
              cleanUrl.includes("youtube.com") || 
              cleanUrl.includes("youtu.be")
            );
            const isYouTube = !isDirectVideo && !isInstagram && (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be"));
            
            let containerClasses = "";
            let aspectClass = "";
            
            if (section.aspectRatio === "9:16") {
              containerClasses = "w-full max-w-[340px] md:max-w-[360px] mx-auto lg:mx-0";
              aspectClass = "aspect-[9/16]";
            } else if (section.aspectRatio === "1:1") {
              containerClasses = "w-full max-w-[380px] md:max-w-[400px] mx-auto lg:mx-0";
              aspectClass = "aspect-square";
            } else if (section.aspectRatio === "16:9") {
              containerClasses = "w-full max-w-[560px] md:max-w-[640px] mx-auto lg:mx-0";
              aspectClass = "aspect-[16/9]";
            } else if (section.aspectRatio === "4:5") {
              containerClasses = "w-full max-w-[360px] md:max-w-[380px] mx-auto lg:mx-0";
              aspectClass = "aspect-[4/5]";
            }

            return (
              <section key={index} className="container mx-auto px-6 md:px-[48px] relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] items-center">
                  
                  {/* Media Block - Left Aligned */}
                  <div className="lg:col-span-7 w-full text-left">
                    <div 
                      className={cn(
                        "rounded-2xl overflow-hidden bg-divider/5 border border-divider/10 relative group shadow-2xl",
                        containerClasses,
                        aspectClass
                      )}
                      style={{ aspectRatio: section.aspectRatio ? section.aspectRatio.replace(":", "/") : "16/9" }}
                    >
                      {isDirectVideo ? (
                        <video 
                          src={section.mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover bg-charcoal scale-[1.01]"
                        />
                      ) : isInstagram ? (
                        <iframe 
                          src={instagramEmbedUrl} 
                          frameBorder="0" 
                          scrolling="no"
                          allowTransparency
                          className="absolute inset-0 w-full h-full bg-charcoal"
                          title={section.title}
                        ></iframe>
                      ) : isVideoUrl ? (
                        <>
                          <iframe 
                            src={getVideoEmbedUrl(section.mediaUrl)} 
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture;" 
                            className={cn(
                              "absolute inset-0 w-full h-full",
                              isYouTube 
                                ? "scale-[1.20] w-[120%] h-[120%] -left-[10%] -top-[10%] max-w-none" 
                                : "scale-[1.01]"
                            )}
                            title={section.title}
                          ></iframe>
                        </>
                      ) : section.type === "photography" || section.type === "graphics" || (section.mediaUrl && section.mediaUrl.trim().startsWith("[")) ? (
                        <PhotographyCarousel 
                          mediaUrl={section.mediaUrl}
                          aspectRatio={section.aspectRatio}
                          alt={section.title}
                        />
                      ) : (
                        <img 
                          src={section.mediaUrl} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
                          alt={section.title} 
                        />
                      )}

                      {/* Seamless Hover and Click Modal Trigger */}
                      {(isDirectVideo || isVideoUrl) && (
                        <div 
                          onClick={() => setActiveVideo({ url: section.mediaUrl, aspectRatio: section.aspectRatio })}
                          className="absolute inset-0 z-30 bg-black/15 hover:bg-black/0 transition-colors duration-500 cursor-none"
                          data-cursor="play"
                        />
                      )}
                    </div>
                  </div>

                  {/* Text Block - Right Aligned */}
                  <div className="flex flex-col justify-center lg:col-span-5 text-left">
                    <div className="mb-3">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-[0.3em] font-bold">
                        {section.serviceName}
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bebas text-accent uppercase leading-[0.85] tracking-wide mb-5">
                      {section.title}
                    </h2>
                    <p className="text-sm md:text-base text-offwhite/75 font-light leading-relaxed max-w-md">
                      {section.description}
                    </p>
                  </div>

                </div>
              </section>
            );
          })}
        </>
      )}

      {/* Elegant Standard CTA */}
      <section className="container mx-auto px-6 md:px-[48px] border-t border-divider/10 pt-10">
        <h2 className="text-5xl md:text-7xl xl:text-[80px] font-bebas uppercase tracking-normal mb-8 md:mb-0 text-balance leading-[0.85] max-w-5xl">
          Want this level of creative alignment for your brand?
        </h2>
        <Link 
          to="/apply"
          className="inline-flex items-center gap-2 bg-accent text-charcoal px-10 py-5 rounded-xl text-base uppercase tracking-widest font-bold hover:bg-white transition-colors group lg:mt-10"
        >
          CONTACT US <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </section>

      {/* Video Modal (unmuted, looping, matching homepage style) */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl p-4 md:p-12 cursor-none" 
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10",
                activeVideo.aspectRatio === "9:16" 
                  ? "h-[88vh] aspect-[9/16]" 
                  : activeVideo.aspectRatio === "1:1" 
                    ? "w-[88vh] h-[88vh] max-w-[85vw] max-h-[85vh] aspect-square" 
                    : activeVideo.aspectRatio === "4:5"
                      ? "h-[88vh] aspect-[4/5] max-w-[85vw] max-h-[85vh]"
                      : "w-[85vw] aspect-[16/9] max-w-5xl"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {activeVideo.url.startsWith("data:video/") || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(cleanAndExtractMediaUrl(activeVideo.url)) ? (
                <video 
                  ref={videoRef}
                  src={activeVideo.url}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <iframe 
                  src={getUnmutedVideoEmbedUrl(activeVideo.url)} 
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  title="Video Player"
                ></iframe>
              )}
            </motion.div>
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-accent transition-colors p-2 z-[110]" 
              onClick={() => setActiveVideo(null)}
            >
              <X size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
