import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityState {
  contrast: 'normal' | 'high' | 'dark' | 'light' | 'desaturate';
  textSize: 100 | 120 | 140 | 160;
  lineHeight: 'normal' | 'relaxed' | 'loose';
  letterSpacing: 'normal' | 'wide' | 'wider';
  highlightLinks: boolean;
  dyslexiaFont: boolean;
  bigCursor: boolean;
  reduceMotion: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  updatePreference: <K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => void;
  resetAll: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const defaultState: AccessibilityState = {
  contrast: 'normal',
  textSize: 100,
  lineHeight: 'normal',
  letterSpacing: 'normal',
  highlightLinks: false,
  dyslexiaFont: false,
  bigCursor: false,
  reduceMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityState>(() => {
    const saved = localStorage.getItem('accessibility-prefs');
    return saved ? JSON.parse(saved) : defaultState;
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('accessibility-prefs', JSON.stringify(prefs));
    applyToDOM(prefs);
  }, [prefs]);

  const updatePreference = <K extends keyof AccessibilityState>(key: K, value: AccessibilityState[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => setPrefs(defaultState);

  const applyToDOM = (p: AccessibilityState) => {
    const html = document.documentElement;
    
    // Reset classes
    html.classList.remove(
      'acc-contrast-high', 'acc-contrast-dark', 'acc-contrast-light', 'acc-desaturate',
      'acc-text-120', 'acc-text-140', 'acc-text-160',
      'acc-lh-relaxed', 'acc-lh-loose',
      'acc-ls-wide', 'acc-ls-wider',
      'acc-links-highlight', 'acc-font-dyslexia', 'acc-cursor-big', 'acc-reduce-motion'
    );

    // Apply classes
    if (p.contrast !== 'normal') html.classList.add(`acc-contrast-${p.contrast}`);
    if (p.textSize !== 100) html.classList.add(`acc-text-${p.textSize}`);
    if (p.lineHeight !== 'normal') html.classList.add(`acc-lh-${p.lineHeight}`);
    if (p.letterSpacing !== 'normal') html.classList.add(`acc-ls-${p.letterSpacing}`);
    if (p.highlightLinks) html.classList.add('acc-links-highlight');
    if (p.dyslexiaFont) html.classList.add('acc-font-dyslexia');
    if (p.bigCursor) html.classList.add('acc-cursor-big');
    if (p.reduceMotion) html.classList.add('acc-reduce-motion');
  };

  return (
    <AccessibilityContext.Provider value={{ ...prefs, updatePreference, resetAll, isOpen, setIsOpen }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
