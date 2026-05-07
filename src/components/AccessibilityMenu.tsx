import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, RotateCcw, Accessibility, Eye, Type, MousePointer2, 
  Wind, Link as LinkIcon, Type as LetterSpacing, AlignJustify 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export function AccessibilityMenu() {
  const { 
    isOpen, setIsOpen, contrast, updatePreference, resetAll,
    textSize, lineHeight, letterSpacing, highlightLinks,
    dyslexiaFont, bigCursor, reduceMotion
  } = useAccessibility();

  if (!isOpen) return <AccessibilityTrigger onClick={() => setIsOpen(true)} />;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-charcoal border-l border-white/10 z-[201] shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent text-black rounded-lg">
                      <Accessibility size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-tight">Accessibility</h2>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Assistant Tools</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Reset button */}
                <button 
                  onClick={resetAll}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:text-white transition-colors mb-8"
                >
                  <RotateCcw size={14} />
                  Reset all settings
                </button>

                <div className="space-y-10">
                  {/* Contrast */}
                  <Section title="Visual Appearance" icon={<Eye size={18} />}>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionButton 
                        active={contrast === 'normal'} 
                        onClick={() => updatePreference('contrast', 'normal')}
                        label="Default"
                      />
                      <OptionButton 
                        active={contrast === 'high'} 
                        onClick={() => updatePreference('contrast', 'high')}
                        label="High Contrast"
                      />
                      <OptionButton 
                        active={contrast === 'dark'} 
                        onClick={() => updatePreference('contrast', 'dark')}
                        label="Dark Mode"
                        sub="Inverted"
                      />
                      <OptionButton 
                        active={contrast === 'desaturate'} 
                        onClick={() => updatePreference('contrast', 'desaturate')}
                        label="Monochrome"
                      />
                    </div>
                  </Section>

                  {/* Text Size */}
                  <Section title="Content Adjustments" icon={<Type size={18} />}>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionButton 
                        active={textSize === 100} 
                        onClick={() => updatePreference('textSize', 100)}
                        label="Default Text"
                      />
                      <OptionButton 
                        active={textSize === 120} 
                        onClick={() => updatePreference('textSize', 120)}
                        label="Medium Text"
                      />
                      <OptionButton 
                        active={textSize === 140} 
                        onClick={() => updatePreference('textSize', 140)}
                        label="Large Text"
                      />
                      <OptionButton 
                        active={textSize === 160} 
                        onClick={() => updatePreference('textSize', 160)}
                        label="XL Text"
                      />
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-3">
                      <ToggleButton 
                        active={dyslexiaFont} 
                        onClick={() => updatePreference('dyslexiaFont', !dyslexiaFont)}
                        label="Dyslexia Friendly Font"
                      />
                      <ToggleButton 
                        active={highlightLinks} 
                        onClick={() => updatePreference('highlightLinks', !highlightLinks)}
                        label="Highlight Links"
                        icon={<LinkIcon size={14} />}
                      />
                    </div>
                  </Section>

                  {/* Navigation Tools */}
                  <Section title="Navigation & Interaction" icon={<MousePointer2 size={18} />}>
                    <div className="flex flex-col gap-3">
                      <ToggleButton 
                        active={bigCursor} 
                        onClick={() => updatePreference('bigCursor', !bigCursor)}
                        label="Bigger Cursor"
                        icon={<MousePointer2 size={14} />}
                      />
                      <ToggleButton 
                        active={reduceMotion} 
                        onClick={() => updatePreference('reduceMotion', !reduceMotion)}
                        label="Stop Animations"
                        icon={<Wind size={14} />}
                      />
                    </div>
                  </Section>

                  {/* Advanced Utilities */}
                  <Section title="Line & Spacing" icon={<AlignJustify size={18} />}>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => updatePreference('lineHeight', 'normal')}
                        className={`p-2 text-[10px] font-bold border ${lineHeight === 'normal' ? 'bg-accent text-black border-accent' : 'border-white/10 text-white/60'}`}
                      >
                        NORM
                      </button>
                      <button 
                        onClick={() => updatePreference('lineHeight', 'relaxed')}
                        className={`p-2 text-[10px] font-bold border ${lineHeight === 'relaxed' ? 'bg-accent text-black border-accent' : 'border-white/10 text-white/60'}`}
                      >
                        RELX
                      </button>
                      <button 
                        onClick={() => updatePreference('lineHeight', 'loose')}
                        className={`p-2 text-[10px] font-bold border ${lineHeight === 'loose' ? 'bg-accent text-black border-accent' : 'border-white/10 text-white/60'}`}
                      >
                        LOOSE
                      </button>
                    </div>
                  </Section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
                    ADA Compliance Engine v1.0
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AccessibilityTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-accent text-black rounded-full flex items-center justify-center shadow-xl border border-black/10 group cursor-pointer"
      aria-label="Open Accessibility Menu"
    >
      <Accessibility className="group-hover:rotate-12 transition-transform" />
    </motion.button>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-white/40 uppercase text-xs font-bold tracking-widest">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function OptionButton({ active, onClick, label, sub }: { active: boolean, onClick: () => void, label: string, sub?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all ${
        active 
          ? 'bg-accent border-accent text-black shadow-lg shadow-accent/20' 
          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
      }`}
    >
      <div className="text-xs font-bold uppercase tracking-tight">{label}</div>
      {sub && <div className={`text-[10px] mt-1 ${active ? 'text-black/60' : 'text-white/40'}`}>{sub}</div>}
    </button>
  );
}

function ToggleButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
        active 
          ? 'bg-accent border-accent text-black' 
          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-black/20' : 'bg-white/10'}`}>
        <motion.div 
          animate={{ x: active ? 16 : 2 }}
          className={`absolute top-1 left-0 w-2 h-2 rounded-full ${active ? 'bg-black' : 'bg-white/60'}`}
        />
      </div>
    </button>
  );
}
