import React from 'react';
import { useHomeContent } from '../hooks/useHomeContent'; // Import the hook above
import PaperCard from '../components/PaperCard';
import { Sparkles, Layers, BookOpen } from 'lucide-react';

const HomeHeader = ({ userMode, interests }) => (
  <div className="relative bg-[#735c45] text-[#F3E5D8] pt-12 pb-24 px-6 md:px-12 overflow-hidden rounded-b-[3rem]">
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6B29A] opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5E3C] opacity-10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <div className="relative max-w-7xl mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#C6B29A] font-medium tracking-wider text-sm uppercase">
            <Sparkles size={16} />
            <span>{userMode === 'hobbyist' ? 'Creative Feed' : 'Research Feed'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Your Knowledge <br />
            <span className="text-[#C6B29A] italic">Curated.</span>
          </h1>
        </div>
        
        {/* Interests Pills */}
        <div className="max-w-md">
          <p className="text-sm text-[#C6B29A]/80 mb-3">Based on your interests:</p>
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 5).map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs text-[#F3E5D8]">
                {tag}
              </span>
            ))}
            {interests.length > 5 && (
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-[#C6B29A]">+ {interests.length - 5} more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  // Use the custom hook to get data
  const { content, loading, userMode, userInterests } = useHomeContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5F1] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C6B29A] border-t-[#3A2E22] rounded-full animate-spin"></div>
        <p className="text-[#5C4633] font-medium animate-pulse">Curating your insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F1] font-sans">
      
      {/* 1. Creative Header */}
      <HomeHeader userMode={userMode} interests={userInterests} />

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
        
        {content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {content.map((item) => (
              <PaperCard
                key={item.id}
                {...item} // Pass all properties
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-[#E7D0C5]">
            <div className="w-16 h-16 bg-[#F3E5D8] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B5E3C]">
              <Layers size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#3A2E22] mb-2">No matches found</h3>
            <p className="text-[#5C4633]">
              We couldn't find fresh content for your specific tags today. <br/>
              Try adding broader interests in your settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;