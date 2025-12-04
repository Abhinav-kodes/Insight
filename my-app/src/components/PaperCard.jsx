import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, Bookmark, ExternalLink, 
  FileText, Calendar, Coffee, Clock, BookOpen,
  Newspaper, TrendingUp, Globe
} from 'lucide-react';
import { getFirstTagImage } from '../services/tagImageMapper';

const PaperCard = ({
  id,
  title,
  description,
  text_summary,
  authors_list,
  publication_date,
  tags,
  url,
  pdf_url,
  citations_count,
  content_type, // 'research_paper', 'hobby_article', or 'news_article'
  thumbnail,    
  metadata,     
  scraped_at
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // 1. Determine Content Type
  const isPaper = content_type === 'research_paper';
  const isNews = content_type === 'news_article';
  const isBlog = content_type === 'hobby_article';
  
  // 2. Image Logic
  const tagStyle = getFirstTagImage(tags);
  // News often has low-res thumbnails, but we prefer them if available. 
  // Otherwise fall back to the nice tag gradients.
  const displayImage = thumbnail || tagStyle.image;

  // 3. Date Formatting
  const dateToFormat = publication_date || scraped_at || new Date();
  const dateStr = new Date(dateToFormat).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  // 4. Author / Source Formatting
  let sourceOrAuthor = 'Unknown';
  if (isNews && metadata?.source) {
    sourceOrAuthor = metadata.source.toUpperCase();
  } else if (authors_list?.length > 0) {
    sourceOrAuthor = authors_list.slice(0, 2).join(', ') + (authors_list.length > 2 ? '...' : '');
  }

  const handleCardClick = () => {
    navigate(`/paper/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-[450px] bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ease-out border border-[#E7D0C5]/40"
    >
      {/* --- Image Header Area --- */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={displayImage} 
          alt={title} 
          onError={(e) => { e.target.src = tagStyle.image; }} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isPaper ? 'from-black/70' : 'from-black/60'} to-transparent`} />

        {/* --- Categorization Badge --- */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isPaper && (
            <span className="backdrop-blur-md bg-blue-900/40 text-blue-50 text-xs font-bold px-3 py-1 rounded-full border border-blue-200/20 flex items-center gap-1 shadow-sm">
              <FileText size={12} /> Research
            </span>
          )}
          
          {isBlog && (
            <span className="backdrop-blur-md bg-emerald-900/40 text-emerald-50 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/20 flex items-center gap-1 shadow-sm">
              <Coffee size={12} /> Tech Blog
            </span>
          )}

          {isNews && (
            <span className="backdrop-blur-md bg-purple-900/40 text-purple-50 text-xs font-bold px-3 py-1 rounded-full border border-purple-200/20 flex items-center gap-1 shadow-sm">
              <Newspaper size={12} /> News
            </span>
          )}
          
          {/* Extra Badge: Reading Time (Blogs) or Country (News) */}
          {isBlog && metadata?.reading_time && (
            <span className="backdrop-blur-md bg-black/30 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <Clock size={12} /> {metadata.reading_time} min
            </span>
          )}
          {isNews && metadata?.country && (
            <span className="backdrop-blur-md bg-black/30 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1 uppercase">
              <Globe size={12} /> {metadata.country[0]}
            </span>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      {/* --- Content Body --- */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-[#FAFAFA]">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 font-medium">
            <span className="flex items-center gap-1 text-[#8B5E3C]">
              <Calendar size={12} /> {dateStr}
            </span>
            <span>•</span>
            <span className={`line-clamp-1 ${isNews ? 'font-bold text-[#8B5E3C]' : 'text-gray-600'}`}>
              {isNews ? 'Via ' : 'By '}{sourceOrAuthor}
            </span>
          </div>

          {/* Description / Summary */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {text_summary || description || "Click to read the full insights on this topic..."}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags?.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                  isPaper ? 'bg-[#F3E5D8] text-[#5C4633]' : 
                  isBlog ? 'bg-[#E0F2FE] text-[#0369A1]' :
                  'bg-[#F3E8FF] text-[#6B21A8]' // Purple for news tags
                }`}
              >
                {tag}
              </span>
            ))}
            {tags?.length > 2 && (
              <span className="text-[10px] px-2 py-1 text-gray-400">+{tags.length - 2}</span>
            )}
          </div>
        </div>
        
        {/* --- Action Footer --- */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-gray-400">
           {/* Left: Stats */}
           <div className="flex gap-4">
             <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
               {isPaper && (
                 <>
                   <BookOpen size={14} className="text-[#8B5E3C]" />
                   <span>{citations_count || 0} cit.</span>
                 </>
               )}
               {isBlog && (
                 <>
                   <ThumbsUp size={14} className="text-[#059669]" />
                   <span>{metadata?.reactions || 0}</span>
                 </>
               )}
               {isNews && (
                 <>
                   <TrendingUp size={14} className="text-purple-600" />
                   <span>Trending</span>
                 </>
               )}
             </div>
           </div>

           {/* Right: Actions */}
           <div className="flex gap-2">
             {/* PDF Link (Papers) */}
             {isPaper && pdf_url && (
                <a 
                  href={pdf_url} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-[#F3E5D8] rounded-full text-[#5C4633] transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
             )}
             
             {/* External Link (Blogs & News) */}
             {!isPaper && url && (
                <a 
                  href={url} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
             )}

             <button 
                onClick={(e) => { e.stopPropagation(); }} 
                className="p-2 hover:bg-[#F3E5D8] rounded-full text-[#5C4633] transition-colors"
             >
               <Bookmark size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;