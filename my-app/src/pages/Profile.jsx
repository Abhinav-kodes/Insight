import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { 
  Save, X, Plus, Loader, LogOut, User, 
  Settings, BookOpenText, Code2, TrendingUp,
  MapPin, Link as LinkIcon, Calendar
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);
  const [contentMode, setContentMode] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'settings'
  const [editingBio, setEditingBio] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);

  // Available Interests (You can expand this list dynamically later)
  const allInterests = [
    "Machine Learning", "Deep Learning", "Computer Vision", "NLP",
    "Quantum Computing", "Theoretical Physics", "Genomics", "Neuroscience",
    "Robotics", "Aerospace", "Economics", "Psychology", "React", "Node.js",
    "System Design", "Startups", "Venture Capital", "Generative AI"
  ];

  const contentModes = [
    { 
      id: 'researcher', 
      label: 'Researcher', 
      icon: BookOpenText, 
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      desc: 'Academic papers & journals' 
    },
    { 
      id: 'hobbyist', 
      label: 'Hobbyist', 
      icon: Code2, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      desc: 'Tech blogs & tutorials' 
    },
    { 
      id: 'trend_watcher', 
      label: 'Trend Watcher', 
      icon: TrendingUp, 
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      desc: 'Global news & markets' 
    }
  ];

  // Fetch Data
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }

        // 1. Fetch Profile (with self-healing)
        let { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (error && error.code === 'PGRST116') {
          // Self-heal missing profile
          await supabase.from('users').insert({
            id: user.id, email: user.email, 
            full_name: user.user_metadata?.full_name || 'User',
            avatar_url: user.user_metadata?.avatar_url,
            onboarding_completed: false
          });
          const retry = await supabase.from('users').select('*').eq('id', user.id).single();
          data = retry.data;
        }

        if (data) {
          setProfile(data);
          setBio(data.bio || "");
          setContentMode(data.content_mode || 'researcher');
        }

        // 2. Fetch Interests
        const { data: iData } = await supabase.from('user_interests').select('interest_name').eq('user_id', user.id);
        if (iData) setInterests(iData.map(i => i.interest_name));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handlers
  const handleUpdate = async (field, value) => {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('users').update({ [field]: value }).eq('id', profile.id);
      if (!error) {
        setProfile(prev => ({ ...prev, [field]: value }));
        if (field === 'content_mode') setContentMode(value);
        if (field === 'bio') { setBio(value); setEditingBio(false); }
      }
    } catch (err) { console.error(err); } 
    finally { setSaving(false); }
  };

  const handleToggleInterest = async (interest) => {
    if (!profile || saving) return;
    setSaving(true);
    
    const exists = interests.includes(interest);
    try {
      if (exists) {
        await supabase.from('user_interests').delete().eq('user_id', profile.id).eq('interest_name', interest);
        setInterests(prev => prev.filter(i => i !== interest));
      } else {
        await supabase.from('user_interests').insert({ user_id: profile.id, interest_name: interest });
        setInterests(prev => [...prev, interest]);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F9F5F1] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-[#8B5E3C] border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F5F1] font-sans text-[#3A2E22] flex flex-col md:flex-row">
      
      {/* --- Sidebar Navigation --- */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E7D0C5] flex-shrink-0">
        <div className="p-6 border-b border-[#E7D0C5]/50">
          <div className="flex items-center gap-3">
            <img 
              src={profile?.avatar_url || "https://i.pravatar.cc/150?img=12"} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C6B29A]"
            />
            <div className="overflow-hidden">
              <h2 className="font-bold truncate">{profile?.full_name}</h2>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-[#F3E5D8] text-[#8B5E3C]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User size={18} /> Profile Overview
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-[#F3E5D8] text-[#8B5E3C]' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={18} /> Preferences
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-[#E7D0C5]/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl text-sm transition">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3A2E22]">
              {activeTab === 'overview' ? 'My Profile' : 'Account Settings'}
            </h1>
            <p className="text-[#8B5E3C]">Manage your personal information and feed preferences.</p>
          </div>

          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Bio & Info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Bio Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E7D0C5]/60">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">About Me</h3>
                    {!editingBio && (
                      <button onClick={() => setEditingBio(true)} className="text-xs font-semibold text-[#8B5E3C] hover:underline">Edit</button>
                    )}
                  </div>
                  
                  {editingBio ? (
                    <div className="space-y-3">
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 bg-[#F9F5F1] rounded-xl text-sm border-none focus:ring-2 focus:ring-[#C6B29A]"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate('bio', bio)} disabled={saving} className="px-4 py-2 bg-[#3A2E22] text-white text-xs rounded-lg">Save</button>
                        <button onClick={() => setEditingBio(false)} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {bio || "No bio yet. Tell us what you're working on!"}
                    </p>
                  )}
                  
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><MapPin size={14}/> Earth</div>
                    <div className="flex items-center gap-1"><LinkIcon size={14}/> insight.engine</div>
                    <div className="flex items-center gap-1"><Calendar size={14}/> Joined 2025</div>
                  </div>
                </div>

                {/* Interests Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E7D0C5]/60">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg">Focus Areas</h3>
                     <button onClick={() => setEditingInterests(!editingInterests)} className="text-xs font-semibold text-[#8B5E3C] hover:underline">
                       {editingInterests ? 'Done' : 'Manage'}
                     </button>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                     {interests.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-[#F3E5D8] text-[#5C4633] text-xs font-medium rounded-full flex items-center gap-1">
                         {tag}
                         {editingInterests && (
                           <button onClick={() => handleToggleInterest(tag)} className="hover:text-red-500"><X size={12}/></button>
                         )}
                       </span>
                     ))}
                     {interests.length === 0 && <span className="text-sm text-gray-400 italic">No interests selected.</span>}
                   </div>

                   {editingInterests && (
                     <div className="mt-6 pt-6 border-t border-gray-100">
                       <p className="text-xs font-bold text-gray-400 uppercase mb-3">Add Topics</p>
                       <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                         {allInterests.filter(i => !interests.includes(i)).map(tag => (
                           <button 
                             key={tag}
                             onClick={() => handleToggleInterest(tag)}
                             disabled={saving}
                             className="px-3 py-1 border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-50 hover:border-gray-300 transition"
                           >
                             + {tag}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </div>

              {/* Right Column: Stats / Quick View */}
              <div className="space-y-6">
                 <div className="bg-[#3A2E22] text-[#F3E5D8] p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Current Mode</p>
                      <h2 className="text-2xl font-serif font-bold mb-4">
                        {contentModes.find(m => m.id === contentMode)?.label || 'Researcher'}
                      </h2>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="w-full bg-[#F3E5D8]/10 hover:bg-[#F3E5D8]/20 backdrop-blur-sm py-2 rounded-lg text-xs font-bold transition"
                      >
                        Change Mode
                      </button>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#8B5E3C] rounded-full blur-2xl opacity-50"></div>
                 </div>

                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E7D0C5]/60">
                   <h4 className="font-bold text-sm mb-4">Stats</h4>
                   <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Papers Read</span>
                       <span className="font-medium">12</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Saved Items</span>
                       <span className="font-medium">28</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Reputation</span>
                       <span className="font-medium">Novice</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          ) : (
            
            // --- SETTINGS TAB ---
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E7D0C5]/60">
              <h3 className="font-bold text-lg mb-6">Feed Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contentModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = contentMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleUpdate('content_mode', mode.id)}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                        isActive 
                          ? `border-[#8B5E3C] bg-[#F3E5D8] ring-1 ring-[#8B5E3C]` 
                          : 'border-gray-100 hover:border-[#C6B29A] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${mode.color}`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="font-bold text-[#3A2E22]">{mode.label}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{mode.desc}</p>
                      
                      {isActive && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-[#8B5E3C] rounded-full shadow-sm"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
                <p className="text-xs text-gray-500 mb-4">Irreversible actions regarding your account.</p>
                <button className="px-4 py-2 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;