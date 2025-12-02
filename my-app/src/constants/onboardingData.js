// constants/onboardingData.js
import { BookOpenText, Code2, TrendingUp } from "lucide-react";

export const CONTENT_MODES = [
  {
    id: "researcher",
    title: "Researcher Mode",
    description: "Access research papers, ArXiv pre-prints, academic journals, and scientific publications.",
    icon: BookOpenText, // Lucide Component reference
  },
  {
    id: "hobbyist",
    title: "Hobbyist & Builder",
    description: "Hands-on tutorials, dev logs, engineering blogs, and practical guides.",
    icon: Code2,
  },
  {
    id: "trend_watcher",
    title: "Trend Watcher",
    description: "Industry news, tech acquisitions, market movements, and high-level analysis.",
    icon: TrendingUp,
  },
];

export const INTERESTS_DATA = {
  researcher: {
    "Computer Science": ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Algorithms", "Quantum Computing"],
    "Physics & Math": ["Quantum Physics", "Theoretical Physics", "Applied Math", "Topology"],
    "Bio & Medicine": ["Genomics", "Neuroscience", "Bioinformatics", "Synthetic Biology"],
  },
  hobbyist: {
    "Web Development": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Full Stack"],
    "Systems": ["Rust", "Go", "Docker", "Kubernetes", "Microservices"],
    "Creative": ["UI/UX Design", "3D Modeling", "Game Dev", "Creative Coding"],
  },
  trend_watcher: {
    "Market Movers": ["AI Startups", "Big Tech News", "Venture Capital", "IPOs"],
    "Emerging Tech": ["Generative AI", "Web3 & Crypto", "Space Tech", "EVs"],
    "Society": ["Tech Policy", "AI Ethics", "Climate Tech", "Digital Rights"],
  },
};