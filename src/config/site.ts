/**
 * Everything Mahmoud may want to edit lives in this file:
 * profile text, contact settings, skills, projects and journey milestones.
 */
import portfolioImg from "@/assets/project-portfolio.webp";
import aiImg from "@/assets/project-ai.webp";
import pythonImg from "@/assets/project-python.webp";
import logosImg from "@/assets/project-logos.webp";

export const PROFILE = {
  name: "Mahmoud",
  initials: "M",
  age: 13,
  location: "Egypt",
  title: "Young Programmer | Web Developer | Technology Enthusiast",
  description:
    "I'm a young programmer passionate about technology, web development, creative design, and artificial intelligence. I enjoy learning new skills and transforming creative ideas into digital experiences.",
};

/**
 * CONTACT SETTINGS
 *
 * Phone and WhatsApp stay private and inactive until a parent or guardian
 * approves showing them in public. To turn them on later:
 *   1. set `publicPhoneApproved` to true
 *   2. put the approved number in international format in `phoneNumber`
 *      (for Egypt that starts with +20)
 * Never commit a number here before it is approved — anything in this file
 * is visible to every visitor.
 */
export const CONTACT_CONFIG = {
  email: "m36125265@gmail.com",
  telegramUrl: "https://t.me/MahmoudCodeX",
  telegramHandle: "@MahmoudCodeX",
  publicPhoneApproved: false,
  phoneNumber: "",
};

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

export type SkillLevel = "Beginner" | "Currently Learning" | "Exploring";

export const SKILLS: {
  name: string;
  icon: "python" | "html" | "css" | "web" | "logo" | "canva" | "ai";
  level: SkillLevel;
  description: string;
}[] = [
  {
    name: "Python",
    icon: "python",
    level: "Currently Learning",
    description: "Learning the basics — variables, loops, functions — and writing small scripts and games.",
  },
  {
    name: "HTML",
    icon: "html",
    level: "Beginner",
    description: "Building the structure of web pages with clean, meaningful tags.",
  },
  {
    name: "CSS",
    icon: "css",
    level: "Beginner",
    description: "Styling pages with colors, layouts and simple animations.",
  },
  {
    name: "Web Development",
    icon: "web",
    level: "Currently Learning",
    description: "Putting HTML, CSS and code together to make real websites — like this one.",
  },
  {
    name: "Logo Design",
    icon: "logo",
    level: "Beginner",
    description: "Experimenting with shapes, letters and colors to create simple brand marks.",
  },
  {
    name: "Canva",
    icon: "canva",
    level: "Beginner",
    description: "Designing posters, social posts and visuals quickly with Canva.",
  },
  {
    name: "Artificial Intelligence",
    icon: "ai",
    level: "Exploring",
    description: "Curious about how AI works and how it can help people build and create.",
  },
];

/**
 * PROJECTS — placeholders until Mahmoud adds his real ones.
 * Set `url` to a real link to activate the "View Project" button.
 * Leave it as null and the button shows "Coming soon" instead of a fake link.
 */
export const PROJECTS: {
  name: string;
  description: string;
  tech: string[];
  status: string;
  image: string;
  url: string | null;
}[] = [
  {
    name: "My Digital World",
    description: "This website — my personal portfolio with 3D scenes, animations and a floating contact dock.",
    tech: ["React", "TypeScript", "Three.js"],
    status: "Live",
    image: portfolioImg,
    url: "#home",
  },
  {
    name: "AI Helper Idea",
    description: "A placeholder for a friendly AI assistant project I'd love to build while learning about AI.",
    tech: ["AI", "Python"],
    status: "Idea",
    image: aiImg,
    url: null,
  },
  {
    name: "Python Mini Games",
    description: "A placeholder for small games and scripts I make while practising Python.",
    tech: ["Python"],
    status: "Placeholder",
    image: pythonImg,
    url: null,
  },
  {
    name: "Logo Experiments",
    description: "A placeholder for logo and visual design experiments made with Canva.",
    tech: ["Canva", "Logo Design"],
    status: "Placeholder",
    image: logosImg,
    url: null,
  },
];

/** JOURNEY — add, remove or reorder steps here. */
export const JOURNEY: { title: string; description: string }[] = [
  {
    title: "Starting my programming journey",
    description: "Got curious about how websites and apps are made — and decided to learn to build them myself.",
  },
  {
    title: "Learning HTML and CSS",
    description: "Wrote my first web pages and learned how structure and style come together.",
  },
  {
    title: "Exploring Python",
    description: "Started learning Python to understand logic, problem solving and real programming.",
  },
  {
    title: "Learning graphic and logo design",
    description: "Began designing visuals and logos with Canva to make my ideas look great.",
  },
  {
    title: "Discovering artificial intelligence",
    description: "Started exploring what AI is and how it is changing technology.",
  },
  {
    title: "Building personal projects",
    description: "Turning everything I learn into my own projects — this website is one of them.",
  },
];
