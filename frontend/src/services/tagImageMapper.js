// services/tagImageMapper.js

const getUnsplashUrl = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const tagImageMap = {
  // --- Computer Science & AI ---
  'Machine Learning': {
    image: getUnsplashUrl('photo-1677442136019-21780ecad995'), // AI neural network visualization
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Deep Learning': {
    image: getUnsplashUrl('photo-1620712943543-bcc4688e7485'), // abstract neural network
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Computer Vision': {
    image: getUnsplashUrl('photo-1635070041078-e363dbe005cb'), // camera lens technology
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Natural Language Processing': {
    image: getUnsplashUrl('photo-1676299081847-824916de030a'), // text and code
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Reinforcement Learning': {
    image: getUnsplashUrl('photo-1591453089816-0fbb971b454c'), // robot learning
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Algorithms & Data Structures': {
    image: getUnsplashUrl('photo-1509228468518-180dd4864904'), // abstract data visualization
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },
  'Distributed Systems': {
    image: getUnsplashUrl('photo-1558494949-ef010cbdcc31'), // network connections
    color: '#0891B2',
    bgColor: '#ECFEFF'
  },
  'Quantum Computing': {
    image: getUnsplashUrl('photo-1635070041078-e363dbe005cb'), // quantum technology
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },

  // --- Physics & Mathematics ---
  'Quantum Physics': {
    image: getUnsplashUrl('photo-1635070041078-e363dbe005cb'), // quantum visualization
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Theoretical Physics': {
    image: getUnsplashUrl('photo-1636466497217-26a8cbeaf0aa'), // physics equations
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Applied Mathematics': {
    image: getUnsplashUrl('photo-1635372722656-389f87a941b7'), // mathematical patterns
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Statistical Mechanics': {
    image: getUnsplashUrl('photo-1509228468518-180dd4864904'), // particle physics
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Topology': {
    image: getUnsplashUrl('photo-1617791160505-6f00504e3519'), // geometric shapes
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Number Theory': {
    image: getUnsplashUrl('photo-1596495577886-d920f1fb7238'), // numbers and math
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Biology & Medicine ---
  'Genomics': {
    image: getUnsplashUrl('photo-1576086213369-97a306d36557'), // DNA strand
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Neuroscience': {
    image: getUnsplashUrl('photo-1617791160588-241658c0f566'), // brain neurons
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Bioinformatics': {
    image: getUnsplashUrl('photo-1628595351029-c2bf17511435'), // molecular biology
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  'Drug Discovery': {
    image: getUnsplashUrl('photo-1584308666744-24d5c474f2ae'), // laboratory research
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  'Synthetic Biology': {
    image: getUnsplashUrl('photo-1532187863486-abf9dbad1b69'), // biotech lab
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Immunology': {
    image: getUnsplashUrl('photo-1579154204601-01588f351e67'), // cells microscope
    color: '#10B981',
    bgColor: '#ECFDF5'
  },

  // --- Engineering ---
  'Robotics': {
    image: getUnsplashUrl('photo-1485827404703-89b55fcc595e'), // robot technology
    color: '#2563EB',
    bgColor: '#EFF6FF'
  },
  'Materials Science': {
    image: getUnsplashUrl('photo-1567789884554-0b844b597180'), // materials structure
    color: '#475569',
    bgColor: '#F1F5F9'
  },
  'Nanotechnology': {
    image: getUnsplashUrl('photo-1614935151651-0bea6508db6b'), // nano particles
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Aerospace Engineering': {
    image: getUnsplashUrl('photo-1614728894747-a83421e2b9c9'), // aerospace
    color: '#0EA5E9',
    bgColor: '#E0F2FE'
  },
  'Chemical Engineering': {
    image: getUnsplashUrl('photo-1582719471384-894fbb16e074'), // chemical lab
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Electrical Engineering': {
    image: getUnsplashUrl('photo-1581092160562-40aa08e78837'), // circuit board
    color: '#EAB308',
    bgColor: '#FEF9C3'
  },

  // --- Social Sciences ---
  'Economics': {
    image: getUnsplashUrl('photo-1611974789855-9c2a0a7236a3'), // financial charts
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Psychology Research': {
    image: getUnsplashUrl('photo-1516302752625-fcc3c50ae61f'), // psychology concept
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Sociology': {
    image: getUnsplashUrl('photo-1529156069898-49953e39b3ac'), // social networks
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Political Science': {
    image: getUnsplashUrl('photo-1541872703-74c5e44368f9'), // government building
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },

  // --- Web Development ---
  React: {
    image: getUnsplashUrl('photo-1633356122544-f134324a6cee'), // React code
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  'Vue.js': {
    image: getUnsplashUrl('photo-1619410283995-43d9134e7656'), // Vue development
    color: '#4FC08D',
    bgColor: '#ECFDF5'
  },
  'Next.js': {
    image: getUnsplashUrl('photo-1618477388954-7852f32655ec'), // modern web dev
    color: '#000000',
    bgColor: '#F3F4F6'
  },
  TypeScript: {
    image: getUnsplashUrl('photo-1587620962725-abab7fe55159'), // TypeScript code
    color: '#3178C6',
    bgColor: '#EFF6FF'
  },
  'Tailwind CSS': {
    image: getUnsplashUrl('photo-1507721999472-8ed4421c4af2'), // CSS styling
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Node.js': {
    image: getUnsplashUrl('photo-1627398242454-45a1465c2479'), // Node.js backend
    color: '#68A063',
    bgColor: '#F0FDF4'
  },
  'Full Stack': {
    image: getUnsplashUrl('photo-1461749280684-dccba630e2f6'), // full stack development
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Mobile & Backend ---
  'React Native': {
    image: getUnsplashUrl('photo-1512941937669-90a1b58e7e9c'), // mobile development
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  Flutter: {
    image: getUnsplashUrl('photo-1607252650355-f7fd0460ccdb'), // Flutter app
    color: '#02569B',
    bgColor: '#EFF6FF'
  },
  Python: {
    image: getUnsplashUrl('photo-1526379095098-d400fd0bf935'), // Python code
    color: '#3776AB',
    bgColor: '#EFF6FF'
  },
  Go: {
    image: getUnsplashUrl('photo-1629654297299-c8506221ca97'), // Go programming
    color: '#00ADD8',
    bgColor: '#ECFEFF'
  },
  Rust: {
    image: getUnsplashUrl('photo-1515879218367-8466d910aaa4'), // Rust code
    color: '#CE3262',
    bgColor: '#FFF1F2'
  },
  Docker: {
    image: getUnsplashUrl('photo-1605745341112-85968b19335b'), // Docker containers
    color: '#2496ED',
    bgColor: '#F0F9FF'
  },
  Kubernetes: {
    image: getUnsplashUrl('photo-1667372393119-3d4c48d07fc9'), // Kubernetes
    color: '#316CE6',
    bgColor: '#EFF6FF'
  },
  AWS: {
    image: getUnsplashUrl('photo-1523474253046-8cd2748b5fd2'), // cloud computing
    color: '#FF9900',
    bgColor: '#FFF7ED'
  },

  // --- Design & Creative ---
  'UI/UX Design': {
    image: getUnsplashUrl('photo-1561070791-2526d30994b5'), // UI/UX design
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  '3D Modeling': {
    image: getUnsplashUrl('photo-1618005182384-a83a8bd57fbe'), // 3D rendering
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Other Tech ---
  'Blockchain Development': {
    image: getUnsplashUrl('photo-1639762681485-074b7f938ba0'), // blockchain
    color: '#F7931A',
    bgColor: '#FFF7ED'
  },
  Cybersecurity: {
    image: getUnsplashUrl('photo-1550751827-4bd374c3f58b'), // security lock
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  IoT: {
    image: getUnsplashUrl('photo-1558346490-a72e53ae2d4f'), // IoT devices
    color: '#6B8CFF',
    bgColor: '#EFF6FF'
  }
};

// --- Fallback Image ---
const DEFAULT_IMAGE = {
  image: getUnsplashUrl('photo-1451187580459-43490279c0fa'), // technology abstract
  color: '#6366F1',
  bgColor: '#EEF2FF'
};

// --- Helpers ---
export function getTagImage(tag) {
  if (tagImageMap[tag]) return tagImageMap[tag];

  const key = Object.keys(tagImageMap).find(
    (k) => k.toLowerCase() === tag?.toLowerCase()
  );
  if (key) return tagImageMap[key];

  return DEFAULT_IMAGE;
}

export function getFirstTagImage(tags) {
  if (!tags || tags.length === 0) return DEFAULT_IMAGE;
  return getTagImage(tags[0]);
}