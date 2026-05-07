import React from "react";
import { Link } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";

const portfolioItems = [
  ...caseStudies.map(cs => ({ id: cs.slug, type: "Case Study", category: "All", img: cs.thumbnail, title: cs.name, link: `/work/${cs.slug}` })),
  { id: "v1", type: "Video", category: "Video", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800", title: "Cocktail Series", link: "#" },
  { id: "p1", type: "Photography", category: "Photography", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800", title: "Restaurant Interiors", link: "#" },
  { id: "b1", type: "Branding", category: "Branding", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800", title: "Luxury Real Estate Identity", link: "#" },
  { id: "s1", type: "Social", category: "Social", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800", title: "Feed Revamp: Interior Firm", link: "#" },
  { id: "w1", type: "Websites", category: "Websites", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", title: "Creative Studio Web", link: "#" },
  { id: "p2", type: "Photography", category: "Photography", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800", title: "Sushi Omakase", link: "#" },
  { id: "v2", type: "Video", category: "Video", img: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800", title: "Nightlife Promo", link: "#" },
];

export function Portfolio() {
  return (
    <div className="w-full pt-6 lg:pt-12 pb-12">
      <section className="container mx-auto px-6 lg:px-12 mb-20">
        <div className="max-w-4xl text-left">
          <span className="text-accent text-xs uppercase tracking-widest block mb-4">The Work</span>
          <h1 
            className="text-6xl md:text-8xl lg:text-[130px] font-bebas uppercase leading-[0.8] tracking-tight mb-8 text-balance"
          >
            A closer look at <span className="text-accent italic">our work</span>.
          </h1>
          <p className="text-offwhite/60 text-lg md:text-2xl leading-tight text-balance font-light max-w-4xl">
            Customers form an opinion before they ever reach out. We create content that makes your business feel credible, considered, and worth remembering.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-12 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {portfolioItems.map(item => (
            <div
              key={item.id}
              className="group relative"
            >
              {item.link !== "#" ? (
                <Link to={item.link} className="block">
                  <ItemCard item={item} />
                </Link>
              ) : (
                <ItemCard item={item} />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ItemCard({ item }: { item: any }) {
  const isVideo = item.type === "Video";
  return (
    <div 
      className="w-full aspect-[3/4] rounded-xl overflow-hidden relative border border-divider bg-surface-dark group cursor-none"
      data-cursor={isVideo ? "play" : "eye"}
    >
      <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 pointer-events-none z-0">
        <span className="text-accent text-[10px] uppercase tracking-widest mb-2 font-bold">{item.type}</span>
        <h3 className="text-3xl font-bebas uppercase tracking-wide">{item.title}</h3>
      </div>
    </div>
  );
}
