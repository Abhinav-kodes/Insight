// hooks/useHomeContent.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useHomeContent = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    userMode: 'researcher', // Default
    content: [],
    loading: true,
    userInterests: [],
    userId: null
  });

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 1. Fetch User Settings & Interests
      const [profileRes, interestsRes] = await Promise.all([
        supabase.from('users').select('content_mode').eq('id', user.id).single(),
        supabase.from('user_interests').select('interest_name').eq('user_id', user.id)
      ]);

      // 2. Determine Mode
      // fallback to 'researcher' if null
      const mode = profileRes.data?.content_mode || 'researcher'; 
      const interests = interestsRes.data?.map(i => i.interest_name) || [];

      setState(prev => ({ 
        ...prev, 
        userId: user.id, 
        userMode: mode, 
        userInterests: interests 
      }));
      
      // 3. Fetch Content based on Mode
      fetchBalancedContent(mode, interests);

    } catch (error) {
      console.error('Init Error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchBalancedContent = async (mode, interests) => {
    try {
      // 1. Map Mode to DB Content Type
      let contentType = 'research_paper'; // Default
      if (mode === 'hobbyist') contentType = 'hobby_article';
      if (mode === 'trend_watcher') contentType = 'news_article';

      // 2. Fetch latest content (LIMIT 300 to filter locally)
      // Note: We fetch a larger batch because we filter by tags on the client side
      // to allow for "fuzzy" matching (e.g. "AI" matches "Artificial Intelligence")
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', contentType)
        .order('publication_date', { ascending: false }) // Use publication_date for better sorting
        .limit(300);

      if (error) throw error;

      // 3. Smart Filtering
      // If user has no interests, show everything (latest). 
      // Otherwise, filter by tag overlap.
      let matchedContent = data;

      if (interests.length > 0) {
        matchedContent = data.filter(item => {
          if (!item.tags || item.tags.length === 0) return false;
          
          return item.tags.some(tag => 
            interests.some(interest => 
              tag.toLowerCase().includes(interest.toLowerCase()) || 
              interest.toLowerCase().includes(tag.toLowerCase())
            )
          );
        });
      }

      // If filtering resulted in 0 items, fallback to showing latest generic items
      // so the feed isn't empty.
      if (matchedContent.length === 0 && data.length > 0) {
        matchedContent = data.slice(0, 10);
      }

      // 4. Update State
      setState(prev => ({ 
        ...prev, 
        content: matchedContent.slice(0, 50), // Show top 50 matches
        loading: false 
      }));

    } catch (error) {
      console.error('Fetch Error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return state;
};