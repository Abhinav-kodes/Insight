// hooks/useHomeContent.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useHomeContent = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    userMode: 'research',
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

      // 1. Fetch User Settings
      const [profileRes, interestsRes] = await Promise.all([
        supabase.from('users').select('content_mode').eq('id', user.id).single(),
        supabase.from('user_interests').select('interest_name').eq('user_id', user.id)
      ]);

      const mode = profileRes.data?.content_mode === 'hobbyist' ? 'hobbyist' : 'research';
      const interests = interestsRes.data?.map(i => i.interest_name) || [];

      setState(prev => ({ ...prev, userId: user.id, userMode: mode, userInterests: interests }));
      
      if (interests.length > 0) {
        fetchBalancedContent(mode, interests);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Init Error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchBalancedContent = async (mode, interests) => {
    try {
      const contentType = mode === 'hobbyist' ? 'hobby_article' : 'research_paper';
      
      // Fetch raw data
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', contentType)
        .order('created_at', { ascending: false })
        .limit(300);

      if (error) throw error;

      // Filtering Logic (Same as your original logic, just cleaner)
      const matchedContent = data.filter(item => {
        if (!item.tags) return false;
        return item.tags.some(tag => 
          interests.some(interest => 
            tag.toLowerCase().includes(interest.toLowerCase()) || 
            interest.toLowerCase().includes(tag.toLowerCase())
          )
        );
      });

      // Simple deduping/limiting for now
      setState(prev => ({ 
        ...prev, 
        content: matchedContent.slice(0, 30), 
        loading: false 
      }));

    } catch (error) {
      console.error('Fetch Error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return state;
};