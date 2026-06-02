export type CaseStudySection = {
  num: string;
  serviceName: string;
  type: "video" | "logo" | "website" | "menu" | "social" | "branding" | "photography" | "graphics";
  aspectRatio: "9:16" | "1:1" | "16:9";
  title: string;
  description: string;
  mediaUrl: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  industry: string;
  description: string;
  thumbnail: string;
  sections: CaseStudySection[];
  order?: number;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "otoro",
    name: "Otoro",
    industry: "Hospitality & Nightlife",
    description: "OTORO was building a destination that lived at the intersection of Japanese influence, elevated hospitality, and high-energy nightlife. We focused on creating a visual language that felt sharp, social, and culturally current while maintaining an air of premium exclusivity.",
    thumbnail: "/otoro-logo-thumbnail.jpg",
    order: 0,
    sections: [
      {
        num: "01",
        serviceName: "Video Production",
        type: "video",
        aspectRatio: "9:16",
        title: "Video Production",
        description: "Our debut video work defined the atmosphere immediately, capturing the sensory intersection of culinary art, moody lighting, and high-energy nightlife.",
        mediaUrl: "https://player.vimeo.com/video/1189896982"
      },
      {
        num: "02",
        serviceName: "Website Direction",
        type: "website",
        aspectRatio: "16:9",
        title: "Custom Web Experience",
        description: "We helped shape a unique web presentation inspired by a Japanese bento box. By organizing narrative elements and menus, the digital interface became a direct extension of the restaurant.",
        mediaUrl: "https://youtu.be/jfYeqndcYHY"
      }
    ]
  },
  {
    slug: "yossi-g",
    name: "Yossi G",
    industry: "Luxury Interior Design",
    description: "Yossi G is a white-glove interior design firm in Brooklyn known for deeply personalized, high-end residential spaces. We built confidence in the firm’s broader capabilities through designer-led storytelling and strategic brand trust-building content.",
    thumbnail: "/yossig-logo-thumbnail.jpg",
    order: 1,
    sections: [
      {
        num: "01",
        serviceName: "Video Production",
        type: "video",
        aspectRatio: "9:16",
        title: "Video Storytelling",
        description: "We created cinematic team profiles that preserved Yossi's personal authority while introducing his key designers.",
        mediaUrl: "https://player.vimeo.com/video/1189898821"
      },
      {
        num: "02",
        serviceName: "Social Media Graphics",
        type: "social",
        aspectRatio: "1:1",
        title: "Social Media Graphics",
        description: "To showcase Brooklyn's most meticulous residential designs, we curated high-contrast, editorial social layouts highlighting high-end masonry.",
        mediaUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  {
    slug: "chief-smokehouse",
    name: "Chief Smokehouse",
    industry: "Restaurant Experience",
    description: "Chief Smokehouse began as a successful jerky line that needed to translate its cult-following into a physical Texas-style BBQ restaurant. We designed a visual system and content strategy that made people crave the food while appreciating the preparation.",
    thumbnail: "/chief-logo-thumbnail.jpg",
    order: 2,
    sections: [
      {
        num: "01",
        serviceName: "Logo",
        type: "logo",
        aspectRatio: "1:1",
        title: "Logo & Visual Identity",
        description: "We built a robust, tactile brand mark that bridged the gap between packaged jerky products and an authentic Texas-style smokehouse restaurant.",
        mediaUrl: "/chief-logo-thumbnail.jpg"
      },
      {
        num: "02",
        serviceName: "Video",
        type: "video",
        aspectRatio: "9:16",
        title: "Brand Video Production",
        description: "Through close-up, high-speed captures, we elevated the labor-intensive Texas BBQ method.",
        mediaUrl: "https://player.vimeo.com/video/1110022312"
      }
    ]
  },
  {
    slug: "yuzu",
    name: "Yuzu",
    industry: "Restaurant Hospitality",
    description: "Yuzu was operating under an inherited name that caused significant confusion in the Brooklyn market. We led a complete naming, branding, and content overhaul to match the identity to the actual luxury experience.",
    thumbnail: "/yuzu-logo-thumbnail.jpg",
    order: 3,
    sections: [
      {
        num: "01",
        serviceName: "Logo",
        type: "logo",
        aspectRatio: "1:1",
        title: "Naming & Logo Design",
        description: "Moving from their inherited name, we designed a minimalist, circular logo and clean identity inspired by modern Japanese culinary trends.",
        mediaUrl: "/yuzu-logo-thumbnail.jpg"
      },
      {
        num: "02",
        serviceName: "Video",
        type: "video",
        aspectRatio: "9:16",
        title: "Nightlife Video Narrative",
        description: "We captured the energetic, dark-toned nightlife vibe of Yuzu’s bar and main room, cementing the brand experience.",
        mediaUrl: "https://player.vimeo.com/video/1197534423"
      }
    ]
  }
];
