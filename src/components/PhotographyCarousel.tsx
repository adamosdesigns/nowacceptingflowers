import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { cn } from "../lib/utils";

interface PhotographyCarouselProps {
  mediaUrl: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  alt: string;
}

export function parsePhotos(mediaUrlString: string): string[] {
  if (!mediaUrlString) return [];
  const trimmed = mediaUrlString.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed) as string[];
    } catch {
      return [trimmed];
    }
  }
  return trimmed ? [trimmed] : [];
}

export function PhotographyCarousel({ mediaUrl, aspectRatio, alt }: PhotographyCarouselProps) {
  const photos = parsePhotos(mediaUrl);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const slideTimer = useRef<NodeJS.Timeout | null>(null);

  const length = photos.length;

  useEffect(() => {
    // Reset index if photos list changes
    setActiveIndex(0);
  }, [mediaUrl]);

  const resetAutoplayTimer = () => {
    if (slideTimer.current) {
      clearInterval(slideTimer.current);
    }
    if (length > 1) {
      slideTimer.current = setInterval(() => {
        setDirection("right");
        setActiveIndex((prev) => (prev + 1) % length);
      }, 4000);
    }
  };

  useEffect(() => {
    resetAutoplayTimer();
    return () => {
      if (slideTimer.current) {
        clearInterval(slideTimer.current);
      }
    };
  }, [length, activeIndex]);

  if (length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal/80 border border-divider/10 text-offwhite/30 gap-2 p-12">
        <Camera className="w-8 h-8 text-offwhite/20 animate-pulse" />
        <span className="text-xs font-mono tracking-widest uppercase">No Photos Uploaded</span>
      </div>
    );
  }

  const currentPhoto = photos[activeIndex];

  const handleNext = () => {
    if (length <= 1) return;
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const handlePrev = () => {
    if (length <= 1) return;
    setDirection("left");
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  const handleBulletClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? "right" : "left");
    setActiveIndex(index);
  };

  // Determine aspect ratio class name to ensure seamless flow integration
  let aspectClass = "aspect-video"; // Fallback
  if (aspectRatio === "9:16") {
    aspectClass = "aspect-[9/16]";
  } else if (aspectRatio === "1:1") {
    aspectClass = "aspect-square";
  } else if (aspectRatio === "16:9") {
    aspectClass = "aspect-[16/9]";
  }

  // Animation variants representing sleek swipe & fades
  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "right" ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 35 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 }
      }
    },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? -100 : 100,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 35 },
        opacity: { duration: 0.25 }
      }
    })
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden group select-none bg-[#030303]", aspectClass)}>
      {/* Slides View Container */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={activeIndex}
            src={currentPhoto}
            alt={`${alt} (Photo ${activeIndex + 1} of ${length})`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />
        </AnimatePresence>
      </div>

      {/* Dim overlay gradient to support readability of bullet indicators and controls */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />

      {/* Arrow Controls (Overlay) */}
      {length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-accent hover:text-charcoal border border-divider/10 text-offwhite flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-40 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-accent hover:text-charcoal border border-divider/10 text-offwhite flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 z-40 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Index Pill indicator (Top Right) */}
      {length > 1 && (
        <div className="absolute top-4 right-4 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest text-offwhite/85 uppercase border border-divider/10 z-40">
          {activeIndex + 1} / {length} PHOTOS
        </div>
      )}

      {/* Bullet / Dot Indicators (Bottom Center) */}
      {length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleBulletClick(idx);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 outline-none",
                idx === activeIndex 
                  ? "w-5 bg-accent" 
                  : "w-1.5 bg-offwhite/30 hover:bg-offwhite/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
