// services/tagImageMapper.js

const getUnsplashUrl = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const tagImageMap = {
  // --- Computer Science & AI ---
  'Machine Learning': {
    image: getUnsplashUrl('1534723452862-4c874018d66d'),
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Deep Learning': {
    image: getUnsplashUrl('1542831371-29b0f74f9713'),
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Computer Vision': {
    image: getUnsplashUrl('1504384308090-c54beed1f92b'),
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Natural Language Processing': {
    image: getUnsplashUrl('1526378722484-d6a56f1a2a8b'),
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Reinforcement Learning': {
    image: getUnsplashUrl('1581092918983-6a7c9a57a5bc'),
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Algorithms & Data Structures': {
    image: getUnsplashUrl('1518779578993-ec3579fee39f'),
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },
  'Distributed Systems': {
    image: getUnsplashUrl('1518770660439-4636190af475'),
    color: '#0891B2',
    bgColor: '#ECFEFF'
  },
  'Quantum Computing': {
    image: getUnsplashUrl('1607799279861-927d6d98c73a'),
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },

  // --- Physics & Mathematics ---
  'Quantum Physics': {
    image: getUnsplashUrl('1607799279861-927d6d98c73a'),
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Theoretical Physics': {
    image: getUnsplashUrl('1525909002-1b05e0c869d8'),
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Applied Mathematics': {
    image: getUnsplashUrl('1526374965328-7f61d4dc18c5'),
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  'Statistical Mechanics': {
    image: getUnsplashUrl('1482192596544-9eb780fc7f66'),
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Topology': {
    image: getUnsplashUrl('1545235617-46c48f884158'),
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Number Theory': {
    image: getUnsplashUrl('1529070538774-1843cb3265df'),
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Biology & Medicine ---
  'Genomics': {
    image: getUnsplashUrl('1559757175-5700dde67597'),
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  'Neuroscience': {
    image: getUnsplashUrl('1535930749574-1399327ce78f'),
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  'Bioinformatics': {
    image: getUnsplashUrl('1581093588401-22e0a4b5cda1'),
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  'Drug Discovery': {
    image: getUnsplashUrl('1581091012184-5c2af86d6c33'),
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  'Synthetic Biology': {
    image: getUnsplashUrl('1559757175-2b2cd0feebf1'),
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Immunology': {
    image: getUnsplashUrl('1559757175-57efb064d2cd'),
    color: '#10B981',
    bgColor: '#ECFDF5'
  },

  // --- Engineering ---
  'Robotics': {
    image: getUnsplashUrl('1581091010468-7bb49d20c141'),
    color: '#2563EB',
    bgColor: '#EFF6FF'
  },
  'Materials Science': {
    image: getUnsplashUrl('1579547621113-e4bb2a19bdd6'),
    color: '#475569',
    bgColor: '#F1F5F9'
  },
  'Nanotechnology': {
    image: getUnsplashUrl('1581093588401-22e0a4b5cda1'),
    color: '#7C3AED',
    bgColor: '#F5F3FF'
  },
  'Aerospace Engineering': {
    image: getUnsplashUrl('1504198266285-1659872e6590'),
    color: '#0EA5E9',
    bgColor: '#E0F2FE'
  },
  'Chemical Engineering': {
    image: getUnsplashUrl('1589811675921-2c5c95d441a4'),
    color: '#F59E0B',
    bgColor: '#FFFBEB'
  },
  'Electrical Engineering': {
    image: getUnsplashUrl('1518770660439-4636190af475'),
    color: '#EAB308',
    bgColor: '#FEF9C3'
  },

  // --- Social Sciences ---
  'Economics': {
    image: getUnsplashUrl('1520607162513-77705c0f0d4a'),
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  'Psychology Research': {
    image: getUnsplashUrl('1508385082359-f38ae991e8f2'),
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  'Sociology': {
    image: getUnsplashUrl('1508214751196-bcfd4ca60f91'),
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Political Science': {
    image: getUnsplashUrl('1522156373667-4c7234bbd804'),
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },

  // --- Web Development ---
  React: {
    image: getUnsplashUrl('1555949963-aa79dcee981d'),
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  'Vue.js': {
    image: getUnsplashUrl('1555949963-aa79dcee981d'),
    color: '#4FC08D',
    bgColor: '#ECFDF5'
  },
  'Next.js': {
    image: getUnsplashUrl('1618477247222-ac59e27621b4'),
    color: '#000000',
    bgColor: '#F3F4F6'
  },
  TypeScript: {
    image: getUnsplashUrl('1587620962725-abab7fe55159'),
    color: '#3178C6',
    bgColor: '#EFF6FF'
  },
  'Tailwind CSS': {
    image: getUnsplashUrl('1503387762-592deb58ef4e'),
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  },
  'Node.js': {
    image: getUnsplashUrl('1504805572947-34fad45aed93'),
    color: '#68A063',
    bgColor: '#F0FDF4'
  },
  'Full Stack': {
    image: getUnsplashUrl('1498050108023-c5249f4df085'),
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Mobile & Backend ---
  'React Native': {
    image: getUnsplashUrl('1517430816045-df4b7de11d1d'),
    color: '#61DAFB',
    bgColor: '#F0F9FF'
  },
  Flutter: {
    image: getUnsplashUrl('1611095973785-2614c3922f8b'),
    color: '#02569B',
    bgColor: '#EFF6FF'
  },
  Python: {
    image: getUnsplashUrl('1523475472560-d2df97ec485c'),
    color: '#3776AB',
    bgColor: '#EFF6FF'
  },
  Go: {
    image: getUnsplashUrl('1526374965328-7f61d4dc18c5'),
    color: '#00ADD8',
    bgColor: '#ECFEFF'
  },
  Rust: {
    image: getUnsplashUrl('1518770660439-4636190af475'),
    color: '#CE3262',
    bgColor: '#FFF1F2'
  },
  Docker: {
    image: getUnsplashUrl('1581091226314-7a8e30b94fda'),
    color: '#2496ED',
    bgColor: '#F0F9FF'
  },
  Kubernetes: {
    image: getUnsplashUrl('1581091012184-5c2af86d6c33'),
    color: '#316CE6',
    bgColor: '#EFF6FF'
  },
  AWS: {
    image: getUnsplashUrl('1501594907352-04cda38ebc29'),
    color: '#FF9900',
    bgColor: '#FFF7ED'
  },

  // --- Design & Creative ---
  'UI/UX Design': {
    image: getUnsplashUrl('1559027615-ce3c1b0ed09b'),
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  '3D Modeling': {
    image: getUnsplashUrl('1581093588401-22e0a4b5cda1'),
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },

  // --- Other Tech ---
  'Blockchain Development': {
    image: getUnsplashUrl('1611078489935-0cb964de46d6'),
    color: '#F7931A',
    bgColor: '#FFF7ED'
  },
  Cybersecurity: {
    image: getUnsplashUrl('1555949963-ff9fe0c870eb'),
    color: '#F43F5E',
    bgColor: '#FFF1F2'
  },
  IoT: {
    image: getUnsplashUrl('1581093588401-22e0a4b5cda1'),
    color: '#6B8CFF',
    bgColor: '#EFF6FF'
  }
};

// --- Fallback Image ---
const DEFAULT_IMAGE = {
  image: getUnsplashUrl('1504384308090-c54beed1f92b'),
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
