import { BookOpenText, Code2, TrendingUp } from "lucide-react";

export const CONTENT_MODES = [
  {
    id: "researcher",
    title: "Researcher Mode",
    description: "Access research papers, ArXiv pre-prints, academic journals, and scientific publications.",
    icon: BookOpenText,
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
    "Artificial Intelligence": ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning"],
    "Computer Science": ["Algorithms", "Distributed Systems", "Cryptography", "Databases", "Operating Systems"],
    "Physics & Math": ["Quantum Computing", "Theoretical Physics", "Applied Mathematics", "Topology"],
    "Bio & Medicine": ["Genomics", "Neuroscience", "Bioinformatics", "Synthetic Biology"],
  },
  hobbyist: {
    "Core Development": [
      "programming", "webdev", "javascript", "python", "typescript", 
      "softwaredevelopment", "softwareengineering", "coding", "development"
    ],
    "Frontend & UI": [
      "react", "frontend", "css", "html", "design", "ux", "animation", 
      "webcomponents", "a11y", "reactnative", "android"
    ],
    "Backend & Systems": [
      "node", "go", "rust", "django", "database", "api", "architecture", 
      "devops", "aws", "git", "bash", "zsh"
    ],
    "AI & Data": [
      "ai", "machinelearning", "gemini", "llm", "rag", "agents", 
      "learngoogleaistudio", "adventofai", "mcp"
    ],
    "Career & Culture": [
      "career", "productivity", "discuss", "opensource", "startup", 
      "mentalhealth", "inclusion", "codenewbie", "beginners", "learning"
    ],
    "Tools & Ecosystem": [
      "tooling", "npm", "npx", "saas", "product", "performance", 
      "bugbounty", "buildinpublic", "gamedev", "blender"
    ]
  },
  trend_watcher: {
    "Headlines & Media": [
      "Breaking News", "Technology", "Media", "News", "Top Stories", 
      "Aggregator", "Curation"
    ],
    "Money & Industry": [
      "Money", "Business", "Deals", "Commerce", "Startups", 
      "Customer Service"
    ],
    "Innovation & AI": [
      "Artificial Intelligence", "Creativity", "Cybersecurity", "Security", 
      "Internet", "Computing"
    ],
    "Big Tech": [
      "Google", "Apple", "Nvidia", "Microsoft", "Samsung", 
      "Alphabet", "Amazon"
    ],
    "Lifestyle & Gaming": [
      "Gaming", "Video Games", "PlayStation", "Nintendo", 
      "Social Media", "Video Streaming", "Phones"
    ]
  },
};