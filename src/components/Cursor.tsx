import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { Play, Eye } from 'lucide-react';

export function Cursor() {
  const [cursorType, setCursorType] = useState<'default' | 'link' | 'play' | 'eye'>('default');
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const playTarget = target.closest('[data-cursor="play"]');
      const eyeTarget = target.closest('[data-cursor="eye"]');
      const linkTarget = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.getAttribute('role') === 'button';
      
      if (playTarget) {
        setCursorType('play');
      } else if (eyeTarget) {
        setCursorType('eye');
      } else if (linkTarget) {
        setCursorType('link');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: mouseX,
        y: mouseY,
      }}
    >
      <motion.div
        className="w-full h-full rounded-full border border-white flex items-center justify-center overflow-hidden"
        animate={{
          scale: (cursorType === 'play' || cursorType === 'eye') ? 2 : cursorType === 'link' ? 0.6 : 1,
          backgroundColor: (cursorType === 'link' || cursorType === 'play' || cursorType === 'eye') ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          {cursorType === 'play' && (
            <motion.div
              key="play-icon"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Play size={11} fill="currentColor" className="text-black ml-[2px]" />
            </motion.div>
          )}
          {cursorType === 'eye' && (
            <motion.div
              key="eye-icon"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Eye size={12} className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
