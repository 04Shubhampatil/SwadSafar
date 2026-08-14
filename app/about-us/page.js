"use client";

import {
  Heart,
  Leaf,
  Sparkles,
  Users,
  Globe2,
  Trophy,
  Flame,
  BookOpen,
  Star,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon, XIcon } from "./_components/SocialIcons";
import AboutHero from "./_components/AboutHero";
import MissionSection from "./_components/MissionSection";
import ValuesSection from "./_components/ValuesSection";
import TimelineSection from "./_components/TimelineSection";
import TeamSection from "./_components/TeamSection";
import ImpactSection from "./_components/ImpactSection";
import GallerySection from "./_components/GallerySection";
import TestimonialsSection from "./_components/TestimonialsSection";
import AwardsSection from "./_components/AwardsSection";
import PartnershipsSection from "./_components/PartnershipsSection";
import FaqSection from "./_components/FaqSection";
import CtaBanner from "./_components/CtaBanner";
import { caption } from "framer-motion/client";

const values = [
  {
    icon: Heart,
    title: "Passion for Food",
    description:
      "We believe great cooking brings people together. Every recipe we share is curated with love.",
    gradient: "from-[#f97316] to-[#fb923c]",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Foodi is built around our incredible community of home cooks, chefs, and food enthusiasts.",
    gradient: "from-[#22c55e] to-[#4ade80]",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We champion seasonal ingredients, reduce waste, and promote mindful, eco-conscious cooking.",
    gradient: "from-[#f59e0b] to-[#fbbf24]",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "From AI recipe generation to smart ingredient matching, we push the boundaries of cooking tech.",
    gradient: "from-[#ef4444] to-[#f97316]",
  },
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Founder & Head Chef",
    initials: "SM",
    accent: "from-[#f6d8c4] to-[#f1b18d]",
    image: "/cardImage/0.webp",
    bio: "Ex-restaurateur who traded the pass for product. Sarah hand-tests every recipe that ships.",
    socials: [
      { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
      { icon: GitHubIcon, label: "GitHub", href: "#" },
      { icon: XIcon, label: "X (Twitter)", href: "#" },
    ],
  },
  {
    name: "Rahul Desai",
    role: "CTO & Co-founder",
    initials: "RD",
    accent: "from-[#d9e3ef] to-[#a9bfd8]",
    image: "/cardImage/1.webp",
    bio: "Built the AI Chef that turned a weekend hack into 1M+ generated recipes.",
    socials: [
      { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
      { icon: GitHubIcon, label: "GitHub", href: "#" },
      { icon: XIcon, label: "X (Twitter)", href: "#" },
    ],
  },
  {
    name: "Linh Nguyen",
    role: "Head of Design",
    initials: "LN",
    accent: "from-[#e8d4cb] to-[#c6a39e]",
    image: "/cardImage/2.webp",
    bio: "Obsessive about typography, whitespace, and making recipes feel effortless to read.",
    socials: [
      { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
      { icon: GitHubIcon, label: "GitHub", href: "#" },
      { icon: XIcon, label: "X (Twitter)", href: "#" },
    ],
  },
  {
    name: "James Okonkwo",
    role: "Community Manager",
    initials: "JO",
    accent: "from-[#c4d5df] to-[#7f9bb0]",
    image: "/cardImage/3.webp",
    bio: "Keeps 240+ cook-alongs, forums, and food swaps running — and genuinely fun.",
    socials: [
      { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
      { icon: GitHubIcon, label: "GitHub", href: "#" },
      { icon: XIcon, label: "X (Twitter)", href: "#" },
    ],
  },
];

const brands = [
  { name: "Swiggy", logo: "/brandLogo/swiggy.webp", featured: true },
  { name: "Zomato", logo: "/brandLogo/zomato.webp" },
  { name: "Taj", logo: "/brandLogo/taj.webp" },
  { name: "KFC", logo: "/brandLogo/kfc.webp", featured: true },
  { name: "Subway", logo: "/brandLogo/subway.webp" },
  { name: "Domino's", logo: "/brandLogo/dominos.webp" },
  { name: "Heineken", logo: "/brandLogo/heineken.webp" },
  { name: "Uber Eats", logo: "/brandLogo/uber_eat.webp" },
  { name: "Behrouz", logo: "/brandLogo/behrouz.webp" },
  { name: "GoFood", logo: "/brandLogo/go_food.webp" },
];

const milestones = [
  {
    year: "2022",
    title: "Foodi is born",
    description:
      "Launched as a tiny recipe blog with 40 hand-tested recipes and a single Instagram page.",
    icon: Leaf,
  },
  {
    year: "2023",
    title: "10,000 members join",
    description:
      "Our community crossed 10K home cooks, and the AI Chef beta quietly went live.",
    icon: Users,
  },
  {
    year: "2024",
    title: "AI Chef launches",
    description:
      "1M+ AI-generated recipes served, plus brand partnerships with Swiggy, Zomato and more.",
    icon: Sparkles,
  },
  {
    year: "2025",
    title: "Going global",
    description:
      "Foodi reached 45 countries with 5,200+ curated recipes across every cuisine.",
    icon: Globe2,
  },
  {
    year: "2026",
    title: "Awards & recognition",
    description:
      "Named among the top food-tech products for community innovation and design.",
    icon: Trophy,
  },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Home Cook",
    quote:
      "Foodi's AI Chef turned my random fridge leftovers into my family's favourite dinner. I can't imagine cooking without it now.",
    rating: 5,
    avatar: "/cardImage/chef_maria.webp",
  },
  {
    name: "Marco Ricci",
    role: "Food Blogger",
    quote:
      "The cleanest recipe platform I've used. Every dish I've tried has been a hit — beautifully written, beautifully photographed.",
    rating: 5,
    avatar: "/cardImage/chef_maria1.webp",
  },
  {
    name: "Priya Patel",
    role: "Sustainable Living",
    quote:
      "Finally a community that understands mindful cooking. The seasonal recipes and waste-reduction tips are absolute gold.",
    rating: 5,
    avatar: "/cardImage/chef_maria2.webp",
  },
];

const awards = [
  { name: "Best Food-Tech Startup", org: "FoodTech Awards", year: "2025", icon: Trophy },
  { name: "Community Innovation", org: "Indie Product Summit", year: "2025", icon: Heart },
  { name: "Rising Brand of the Year", org: "Culinary Weekly", year: "2024", icon: Flame },
  { name: "Top 100 Cooking Apps", org: "Tech Digest", year: "2024", icon: Sparkles },
];

const gallery = [
  { src: "/photoshoot/chicken-tikka-masala.webp", caption: "Fresh from the market" },
  { src: "/photoshoot/fried-chicken.webp", caption: "R&D kitchen sessions" },
  { src: "/photoshoot/green-curry.webp", caption: "Recipe photo shoots" },
  { src: "/photoshoot/herbs-and-bread_pasta.webp", caption: "Brunch with the team" },
  { src: "/photoshoot/homemade-bread-appetizer.webp", caption: "The dessert lab" },
  { src: "/photoshoot/juicy-kabab.webp", caption: "The best biryani" },
  { src: "/photoshoot/raw-salmon.webp", caption: "Chef-inspired plating" },
  { src: "/photoshoot/steaming-noodles.webp", caption: "Warm bowls and cozy nights" },
];

const impact = [
  { value: 1.2, decimals: 1, suffix: "M", label: "Meals cooked" },
  { value: 38, decimals: 0, suffix: "%", label: "Less food waste" },
  { value: 240, decimals: 0, suffix: "+", label: "Community events" },
  { value: 45, decimals: 0, suffix: "+", label: "Countries reached" },
];

const faqs = [
  {
    q: "Is Foodi free to use?",
    a: "Yes! Foodi is free forever for core features — browsing 5,200+ recipes, saving favourites, and joining the community. Premium unlocks AI Chef unlimited generations and offline access.",
  },
  {
    q: "How does the AI Chef work?",
    a: "Tell it what's in your fridge — ingredients, dietary needs, or a craving — and it instantly crafts a personalised recipe with steps, timings, and nutrition insights.",
  },
  {
    q: "Can I submit my own recipes?",
    a: "Absolutely. Upload a recipe, and our chef reviewers curate the best ones for the community. Top contributors get verified chef badges and features in our newsletters.",
  },
  {
    q: "Is there a mobile app?",
    a: "The Foodi web app is fully responsive and installable, with a native app on our roadmap for early next year.",
  },
  {
    q: "How does Foodi support sustainability?",
    a: "Seasonal ingredient guides, waste-reduction tips, and eco-friendly swap suggestions are built into every recipe — so mindful cooking becomes effortless.",
  },
];

export default function FoodiAbout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] text-[#111827]">
      {/* Page-wide ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="fd-noise absolute inset-0 opacity-[0.16] mix-blend-multiply" />
        <div className="fd-blob absolute -left-64 top-[6%] h-[560px] w-[560px] rounded-full bg-[#fdba74]/20 blur-3xl" />
        <div className="fd-blob absolute -right-64 bottom-[12%] h-[520px] w-[520px] rounded-full bg-[#fde68a]/25 blur-3xl" style={{ animationDelay: "8s" }} />
      </div>

      <div className="relative">
        <AboutHero />
        <MissionSection />
        <ValuesSection values={values} />
        <TimelineSection milestones={milestones} />
        <TeamSection members={team} />
        <ImpactSection metrics={impact} />
        <GallerySection images={gallery} />
        <TestimonialsSection testimonials={testimonials} />
        <AwardsSection awards={awards} />
        <PartnershipsSection brands={brands} />
        <FaqSection faqs={faqs} />
        <CtaBanner />
      </div>
    </main>
  );
}
