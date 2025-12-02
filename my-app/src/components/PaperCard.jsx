import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, MessageCircle, Bookmark, Share2, 
  ExternalLink, FileText, Calendar, Sparkles 
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
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Visual helpers
  const tagStyle = getFirstTagImage(tags);
  const dateStr = new Date(publication_date).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  const authors = authors_list?.slice(0, 2).join(', ') + 
    (authors_list?.length > 2 ? ` +${authors_list.length - 2}` : '');

  return (
    <div 
      onClick={() => navigate(`/paper/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-[420px] bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ease-out border border-[#E7D0C5]/40"
    >
      {/* 1. Image Header Area */}
      <div className="relative h-48 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={tagStyle.image} 
            alt="topic-bg" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="backdrop-blur-md bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
            <FileText size={12} /> Paper
          </span>
        </div>

        {/* Title Overlay (appears on bottom of image) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-[#FAFAFA]">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 font-medium">
            <span className="flex items-center gap-1 text-[#8B5E3C]">
              <Calendar size={12} /> {dateStr}
            </span>
            <span>•</span>
            <span className="text-gray-600 line-clamp-1">By {authors}</span>
          </div>

          {/* Abstract Snippet */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {text_summary || description || "No abstract available for this paper."}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags?.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-[#F3E5D8] text-[#5C4633]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* 3. Action Footer (Slide up on hover) */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-gray-400">
           <div className="flex gap-4">
             <button className="hover:text-[#8B5E3C] transition-colors flex items-center gap-1 text-xs">
               <ThumbsUp size={16} />
             </button>
             <button className="hover:text-[#8B5E3C] transition-colors flex items-center gap-1 text-xs">
               <MessageCircle size={16} />
             </button>
           </div>

           <div className="flex gap-3">
             {pdf_url && (
                <a 
                  href={pdf_url} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-[#F3E5D8] rounded-full text-[#5C4633] transition-colors"
                  title="View PDF"
                >
                  <ExternalLink size={16} />
                </a>
             )}
             <button 
                onClick={(e) => e.stopPropagation()} 
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