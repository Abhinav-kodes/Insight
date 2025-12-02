// services/tagImageMapper.js

// Using Unsplash IDs with optimization parameters for better performance and relevance
const getUnsplashUrl = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const tagImageMap = {
  // --- Computer Science & AI ---
  'Machine Learning': {
    image: getUnsplashUrl('1555949963-ff9fe0c870eb'), // Neural network visualization
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Deep Learning': {
    image: getUnsplashUrl('1677442120464-5e58c9c74091'), // Abstract AI brain/nodes
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Computer Vision': {
    image: getUnsplashUrl('1526374965328-7f61d4dc18c5'), // Cyberpunk eye/lens
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Natural Language Processing': {
    image: getUnsplashUrl('1555421689-491a97ff4181'), // Text/Code analysis
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Reinforcement Learning': {
    image: getUnsplashUrl('1535378437261-27fa533c7270'), // Robot/AI interaction
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Algorithms & Data Structures': {
    image: getUnsplashUrl('1509228911820-9171f1e44bbc'), // Mathematical geometric structure
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },
  'Distributed Systems': {
    image: getUnsplashUrl('1558494949-efc5270f9c63'), // Server farm/connections
    color: '#0891B2',
    bgColor: '#ECFEFF'
  },
  'Quantum Computing': {
    image: getUnsplashUrl('1635070041078-e363dbe005cb'), // Quantum dilution refrigerator (Gold)
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },

  // --- Physics & Mathematics ---
  'Quantum Physics': {
    image: getUnsplashUrl('1635070041078-e363dbe005cb'), // Quantum rig
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Theoretical Physics': {
    image: getUnsplashUrl('1636466438044-98361c420259'), // Blackboard formulas
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Applied Mathematics': {
    image: getUnsplashUrl('1635070041078-e363dbe005cb'), // Abstract math/geometry
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Statistical Mechanics': {
    image: getUnsplashUrl('1532094349884-543bc11b234d'), // Particles/Abstract
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Topology': {
    image: getUnsplashUrl('1614730370824-788968953186'), // Abstract shapes/Mobius strip vibe
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Number Theory': {
    image: getUnsplashUrl('1596495578062-b361124ebd79'), // Numbers/Math art
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Biology & Medicine ---
  'Genomics': {
    image: getUnsplashUrl('1530026405186-ed1f139313f8'), // DNA Helix
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Neuroscience': {
    image: getUnsplashUrl('1559757609-f31090325761'), // Brain scan/neurons
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Bioinformatics': {
    image: getUnsplashUrl('1576086213369-97a306d36557'), // Lab tech/Microscope
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  'Drug Discovery': {
    image: getUnsplashUrl('1584328843804-edbfd73c7602'), // Chemical structure/molecules
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  'Synthetic Biology': {
    image: getUnsplashUrl('1532187863486-03cda88e0e4e'), // Petri dishes/Lab
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Immunology': {
    image: getUnsplashUrl('1579684385127-1ef15d508118'), // Cells/Microscope
    color: '#10B981',
    bgColor: '#ECFDF5'
  },

  // --- Engineering ---
  'Robotics': {
    image: getUnsplashUrl('1561146126101-3158dc0a4d5e'), // Mechanical arm/Robot
    color: '#2563EB',
    bgColor: '#EFF6FF'
  },
  'Materials Science': {
    image: getUnsplashUrl('1581093450021-4a7360e9a6b5'), // Metallic texture/Carbon fiber
    color: '#475569',
    bgColor: '#F1F5F9'
  },
  'Nanotechnology': {
    image: getUnsplashUrl('1562835521-16959a4c0045'), // Microchip closeup
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Aerospace Engineering': {
    image: getUnsplashUrl('1517976487492-5750f3195933'), // Rocket launch
    color: '#0EA5E9',
    bgColor: '#E0F2FE'
  },
  'Chemical Engineering': {
    image: getUnsplashUrl('1603126857599-f6e157fa2fe6'), // Chemical plant/tubes
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Electrical Engineering': {
    image: getUnsplashUrl('1555664424-778a69032054'), // Circuit board/Soldering
    color: '#EAB308',
    bgColor: '#FEF9C3'
  },

  // --- Social Sciences ---
  'Economics': {
    image: getUnsplashUrl('1611974765219-03e921c78953'), // Stock chart/Money
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Psychology Research': {
    image: getUnsplashUrl('1507413245164-6160d8298b31'), // Abstract head/thought
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Sociology': {
    image: getUnsplashUrl('1531206715517-5c0ba140b2b8'), // Crowd of people
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Political Science': {
    image: getUnsplashUrl('1541872703-74c5963631df'), // Government building/Pillars
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },

  // --- Web Development ---
  'React': {
    image: getUnsplashUrl('1633356122544-f134324ef6db'), // React code/Atom symbol
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  'Vue.js': {
    image: getUnsplashUrl('1633356122544-f134324ef6db'), // Code screen
    color: '#4FC08D',
    bgColor: '#ECFDF5'
  },
  'Next.js': {
    image: getUnsplashUrl('1618477247222-ac59e27621b4'), // Dark modern code
    color: '#000000',
    bgColor: '#F3F4F6'
  },
  'TypeScript': {
    image: getUnsplashUrl('1516116216624-53e697fedbea'), // Organized code
    color: '#3178C6',
    bgColor: '#EFF6FF'
  },
  'Tailwind CSS': {
    image: getUnsplashUrl('1507721999472-8ed4421c4af2'), // Palette/Design
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Node.js': {
    image: getUnsplashUrl('1627398242454-45a1465c2479'), // JavaScript code
    color: '#68A063',
    bgColor: '#F0FDF4'
  },
  'Full Stack': {
    image: getUnsplashUrl('1498050108023-c5249f4df085'), // Laptop with code
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Mobile & Backend ---
  'React Native': {
    image: getUnsplashUrl('1512941937669-90a1b58e7e9c'), // Mobile phone usage
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  'Flutter': {
    image: getUnsplashUrl('1617042375876-a3a499c90d11'), // App dashboard
    color: '#02569B',
    bgColor: '#EFF6FF'
  },
  'Python': {
    image: getUnsplashUrl('1526379095098-d400e777f72e'), // Python code/Snake abstract
    color: '#3776AB',
    bgColor: '#EFF6FF'
  },
  'Go': {
    image: getUnsplashUrl('1555066931-4365d14bab8c'), // Fast/Motion blur (Go is fast)
    color: '#00ADD8',
    bgColor: '#ECFEFF'
  },
  'Rust': {
    image: getUnsplashUrl('1518770660439-4636190af475'), // Industrial gears (Rust safe)
    color: '#CE3262',
    bgColor: '#FFF1F2'
  },
  'Docker': {
    image: getUnsplashUrl('1605745341117-7c4187198409'), // Shipping containers
    color: '#2496ED',
    bgColor: '#F0F9FF'
  },
  'Kubernetes': {
    image: getUnsplashUrl('1667372393119-3d4c48d07fc9'), // Ship wheel/Helm vibe
    color: '#316CE6',
    bgColor: '#EFF6FF'
  },
  'AWS': {
    image: getUnsplashUrl('1451187580459-43490279c0fa'), // Cloud/Sky
    color: '#FF9900',
    bgColor: '#FFF7ED'
  },

  // --- Design & Creative ---
  'UI/UX Design': {
    image: getUnsplashUrl('1586717791821-3f44a5638d0f'), // Wireframes on paper
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  '3D Modeling': {
    image: getUnsplashUrl('1617791160505-6f00504e35d9'), // 3D abstract render
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Other Tech ---
  'Blockchain Development': {
    image: getUnsplashUrl('1639322537228-f710d846310a'), // Blockchain blocks abstract
    color: '#F7931A',
    bgColor: '#FFF7ED'
  },
  'Cybersecurity': {
    image: getUnsplashUrl('1563986768609-322da13575f3'), // Lock/Digital Security
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  'IoT': {
    image: getUnsplashUrl('1558346490-51899914d3bd'), // Smart home/Chips
    color: '#6B8CFF',
    bgColor: '#EFF6FF'
  }
};

// --- Helper Functions ---

// Fallback image (Abstract architectural)
const DEFAULT_IMAGE = {
  image: getUnsplashUrl('1504384308090-c54beed1f92b'),
  color: '#6366F1',
  bgColor: '#EEF2FF'
};

export function getTagImage(tag) {
  // Try exact match first
  if (tagImageMap[tag]) return tagImageMap[tag];
  
  // Try case-insensitive match
  const key = Object.keys(tagImageMap).find(k => k.toLowerCase() === tag?.toLowerCase());
  if (key) return tagImageMap[key];

  return DEFAULT_IMAGE;
}

export function getFirstTagImage(tags) {
  if (!tags || tags.length === 0) return DEFAULT_IMAGE;
  return getTagImage(tags[0]);
}