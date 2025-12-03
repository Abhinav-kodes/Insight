import React from 'react';
import { useHomeContent } from '../hooks/useHomeContent';
import PaperCard from '../components/PaperCard';
import { Sparkles, Layers, Search, Filter } from 'lucide-react';

const HomeHeader = ({ userMode, interests }) => (
  <div className="relative bg-[#735c45] text-[#F3E5D8] pt-12 pb-24 px-6 md:px-12 overflow-hidden rounded-b-[3rem] shadow-xl">
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6B29A] opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5E3C] opacity-10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

    <div className="relative max-w-7xl mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3 text-[#E7D0C5] font-semibold tracking-wider text-xs uppercase bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
            <Sparkles size={12} />
            <span>{userMode === 'hobbyist' ? 'Curated Tech Feed' : 'Academic Research Feed'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Insight <br />
            <span className="text-[#E7D0C5] italic">Engine.</span>
          </h1>
        </div>
        
        {/* Interests Pills */}
        <div className="max-w-md w-full md:w-auto">
          <div className="flex items-center justify-between mb-3">
             <p className="text-sm text-[#E7D0C5]/80">Active Interests:</p>
             <button className="text-xs text-white underline hover:text-[#E7D0C5]">Edit</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 5).map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-[#F3E5D8] font-medium">
                {tag}
              </span>
            ))}
            {interests.length > 5 && (
              <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-[#C6B29A]">+ {interests.length - 5}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { content, loading, userMode, userInterests } = useHomeContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5F1] flex flex-col items-center justify-center gap-4">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-[#C6B29A]/30 border-t-[#8B5E3C] rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles size={16} className="text-[#8B5E3C] animate-pulse" />
           </div>
        </div>
        <p className="text-[#5C4633] font-medium tracking-wide animate-pulse">Aggregating sources...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F1] font-sans">
      <HomeHeader userMode={userMode} interests={userInterests} />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-20">
        
        {/* Simple Filter Bar (Visual Only for now) */}
        <div className="flex items-center justify-between mb-6 px-2">
           <h2 className="text-[#3A2E22] font-bold text-xl flex items-center gap-2">
             <Layers size={20} className="text-[#8B5E3C]" />
             Latest Updates
           </h2>
           <div className="flex gap-2">
             <button className="p-2 bg-white rounded-lg shadow-sm text-[#5C4633] hover:bg-[#F3E5D8] transition"><Search size={18} /></button>
             <button className="p-2 bg-white rounded-lg shadow-sm text-[#5C4633] hover:bg-[#F3E5D8] transition"><Filter size={18} /></button>
           </div>
        </div>

        {content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {content.map((item) => (
              <PaperCard
                key={item.id}
                {...item} // Passes thumbnail, content_type, metadata automatically
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-[#E7D0C5] mt-8">
            <div className="w-20 h-20 bg-[#F3E5D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#8B5E3C]">
              <Layers size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[#3A2E22] mb-3">Feed Empty</h3>
            <p className="text-[#5C4633] max-w-md mx-auto">
              We couldn't find content matching your tags. Try switching modes or adding more general topics like "AI" or "Web Development".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;