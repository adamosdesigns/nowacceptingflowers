import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "../data/caseStudies";
import { cn } from "../lib/utils";

export function CaseStudy() {
  const { slug } = useParams();
  const study = caseStudies.find(c => c.slug === slug);

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-start container mx-auto px-6">
        <div className="text-left">
          <h1 className="text-4xl font-bebas uppercase tracking-normal mb-4">Case study not found.</h1>
          <Link to="/portfolio" className="text-accent uppercase tracking-widest text-xs hover:underline">Return to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      {/* 1. Hero */}
      <section className="pt-6 lg:pt-12 pb-12 px-6 lg:px-12 container mx-auto text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl ml-0"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-2 block">Case Study • {study.industry}</span>
          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bebas uppercase leading-[0.8] tracking-tight mb-4">{study.name}</h1>
          <p className="text-lg md:text-xl text-offwhite/60 font-light leading-tight mb-6 text-balance">
            {study.shortPositioning}
          </p>
        </motion.div>
      </section>

      {/* Hero Image Full Width */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full px-4 lg:px-6 mb-8"
      >
        <div className="w-full h-[50vh] md:h-[70vh] rounded-xl overflow-hidden">
          <img src={study.heroImage} className="w-full h-full object-cover" alt={`${study.name} Hero`} />
        </div>
      </motion.section>

      {/* 2 & 3: The Feeling & The Challenge */}
      <section className="container mx-auto px-6 lg:px-12 mb-8 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bebas uppercase tracking-normal mb-3 text-balance">The feeling we needed to capture.</h2>
          <p className="text-lg text-offwhite/60 font-light leading-relaxed text-balance">
            {study.feeling}
          </p>
        </div>
        <div>
          <h2 className="text-4xl font-bebas uppercase tracking-normal mb-3 text-balance">The Challenge</h2>
          <p className="text-lg text-offwhite/60 font-light leading-relaxed text-balance">
            {study.challenge}
          </p>
        </div>
      </section>

      {/* 4. What We Created */}
      <section className="container mx-auto px-6 lg:px-12 mb-8 border-t border-divider pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bebas uppercase tracking-normal mb-3 text-balance">What We Created</h2>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            {study.deliverables.map(item => (
              <span key={item} className="px-5 py-2 border border-divider rounded-lg text-xs uppercase tracking-widest">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Visual Gallery Placeholder */}
      <section className="container mx-auto px-6 lg:px-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {study.gallery.length > 0 ? study.gallery.map((img, i) => (
            <div key={i} className={cn(
              "rounded-xl overflow-hidden bg-divider/10",
              i % 3 === 0 ? "md:col-span-2 aspect-video" : "aspect-[4/5]"
            )}>
              <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt={`Gallery ${i}`} />
            </div>
          )) : (
            <>
              <div className="md:col-span-2 aspect-[21/9] bg-divider/5 rounded-2xl flex items-center justify-center border border-divider">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">Main Narrative Asset Placeholder</span>
              </div>
              <div className="aspect-[4/5] bg-divider/5 rounded-2xl flex items-center justify-center border border-divider">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">Vibe Shot 01</span>
              </div>
              <div className="aspect-[4/5] bg-divider/5 rounded-2xl flex items-center justify-center border border-divider">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">Vibe Shot 02</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 7. Impact */}
      <section className="container mx-auto px-6 lg:px-12 mb-20">
        <div className="bg-divider/5 rounded-3xl p-10 md:p-24 text-left border border-divider/10">
          <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-6 block">The Result</span>
          <h2 className="text-5xl md:text-8xl font-bebas uppercase tracking-normal mb-10 text-balance leading-[0.8]">The Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {study.impact.map((item, i) => (
              <div key={i} className="text-lg md:text-2xl font-light text-offwhite/80 text-balance border-l border-accent/30 pl-8 py-2">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="container mx-auto px-6 lg:px-12 text-left border-t border-divider pt-8">
        <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-normal mb-4 text-balance">Want this level of creative support for your brand?</h2>
        <Link to="/apply" className="inline-flex items-center gap-2 bg-accent text-charcoal px-10 py-5 rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors group">
          Let's Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
