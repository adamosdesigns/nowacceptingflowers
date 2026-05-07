export type CaseStudy = {
  slug: string;
  name: string;
  industry: string;
  shortPositioning: string;
  thumbnail: string;
  heroImage: string;
  feeling: string;
  challenge: string;
  deliverables: string[];
  impact: string[];
  gallery: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "otoro",
    name: "Otoro",
    industry: "High-End Asian Fusion",
    shortPositioning: "Elevating the perception from local spot to regional dining destination.",
    thumbnail: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=1600",
    feeling: "We needed to capture exclusivity, precision, and the sensory richness of an unforgettable night out. It couldn't just look like sushi—it had to feel like luxury.",
    challenge: "Despite having arguably the best menu in their market, the restaurant was suffering from an outdated online presence that made them look like a standard takeout spot. They needed to justify a higher price point and attract a more discerning clientele.",
    deliverables: [
      "Video production",
      "Photography",
      "Branding",
      "Social media management",
      "Feed revamp"
    ],
    impact: [
      "More premium perception",
      "Stronger visual presence",
      "Consistent, cinematic social feed",
      "Better alignment between in-person experience and online presence"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "yossi-g",
    name: "Yossi G",
    industry: "Luxury Interior Design",
    shortPositioning: "A digital presence as meticulous as their physical spaces.",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
    feeling: "Texture, light, scale, and uncompromising quality. The goal was to make visitors feel the quiet confidence and architectural weight of the spaces before ever stepping foot inside.",
    challenge: "The firm's work spoke for itself, but their content delivery was disjointed. They needed a unified creative system to showcase their high-end residential and commercial projects to prospective high-net-worth clients.",
    deliverables: [
      "Photography",
      "Website design",
      "Branding update",
      "Social content"
    ],
    impact: [
      "More consistent social presence",
      "Stronger trust and authority",
      "Seamless digital-to-physical brand experience"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566753386-7a7102eef57e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "chief-smokehouse",
    name: "Chief Smokehouse",
    industry: "Boutique Creative Agency / Studio",
    shortPositioning: "Refining the narrative for a visionary creative partner.",
    thumbnail: "https://images.unsplash.com/photo-1605808316688-66236b2f6f57?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
    feeling: "Sophisticated, edge-driven, and relentlessly modern. The content needed to reflect an agency that is always one step ahead, capturing the raw energy of creative execution.",
    challenge: "Chief Smokehouse had grown rapidly but was too busy serving clients to build their own brand. We stepped in to document their process and elevate their visual identity so they could attract top-tier global accounts.",
    deliverables: [
      "Video production",
      "Social content",
      "Strategy"
    ],
    impact: [
      "Stronger visual presence",
      " Elevated brand perception",
      " Increased inbound from ideal clients"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "yuzu",
    name: "Yuzu",
    industry: "Contemporary Dining & Bar",
    shortPositioning: "A complete visual overhaul for an iconic local concept.",
    thumbnail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=1600",
    feeling: "Vibrant, intimate, and alive. We wanted to capture the glow of neon, the steam off the dishes, and the clinking of glasses. Pure hospitality energy.",
    challenge: "Yuzu was launching a new evening program but visitors only perceived them as a lunch spot. We had to build anticipation for their nightlife energy and craft cocktails.",
    deliverables: [
      "Video production",
      "Photography",
      "Feed revamp",
      "Paid creative"
    ],
    impact: [
      "Shifted perception to an evening destination",
      "Stronger visual presence",
      "Higher engagement on social channels"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470337458703-415120a417b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
