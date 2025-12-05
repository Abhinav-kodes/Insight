import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2
} from "lucide-react";

// Import the data structure 
import { CONTENT_MODES, INTERESTS_DATA } from "../constants/onboardingData";

// --- Sub-Component: Mode Selection Card ---
const ModeCard = ({ mode, isSelected, onClick }) => {
  const Icon = mode.icon;
  
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-6 rounded-xl border-2 text-left transition-all duration-300 group
        ${isSelected 
          ? "border-[#8B5E3C] bg-[#F3E5D8] shadow-md scale-[1.01]" 
          : "border-[#C6B29A]/50 bg-white hover:border-[#8B5E3C] hover:shadow-sm"
        }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isSelected ? "bg-[#8B5E3C] text-white" : "bg-[#F5EFE6] text-[#5C4633] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors"}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#3A2E22] mb-1">{mode.title}</h3>
          <p className="text-sm text-[#5C4633]/80 leading-relaxed">{mode.description}</p>
        </div>
        <div className="mt-1">
          {isSelected ? (
            <CheckCircle2 className="text-[#8B5E3C] w-6 h-6" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-[#C6B29A] group-hover:border-[#8B5E3C]" />
          )}
        </div>
      </div>
    </button>
  );
};

// --- Sub-Component: Interest Accordion ---
const InterestSection = ({ title, interests, selectedInterests, onToggle, isExpanded, onExpand }) => {
  const selectedCount = interests.filter(i => selectedInterests.includes(i)).length;

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${isExpanded ? 'border-[#8B5E3C] bg-white' : 'border-[#C6B29A] bg-white'}`}>
      <button
        onClick={onExpand}
        className="w-full p-4 flex items-center justify-between bg-[#F9F5F1] hover:bg-[#F3E5D8] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#3A2E22]">{title}</span>
          {selectedCount > 0 && (
            <span className="bg-[#8B5E3C] text-white text-xs px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronDown className="w-5 h-5 text-[#5C4633]" /> : <ChevronRight className="w-5 h-5 text-[#5C4633]" />}
      </button>

      {isExpanded && (
        <div className="p-4 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
          {interests.map((interest) => {
            const isActive = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => onToggle(interest)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border
                  ${isActive 
                    ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-sm" 
                    : "bg-white text-[#5C4633] border-[#E7D0C5] hover:border-[#8B5E3C] hover:text-[#3A2E22]"
                  }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Main Controller Component ---
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [contentMode, setContentMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('onboarding_completed').eq('id', user.id).single();
        if (data?.onboarding_completed) navigate('/home');
      }
    };
    checkStatus();
  }, [navigate]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update User Mode
      await supabase.from('users').update({ 
        content_mode: contentMode, 
        onboarding_completed: true 
      }).eq('id', user.id);

      // Insert Interests
      const interestPayload = selectedInterests.map(name => ({ user_id: user.id, interest_name: name }));
      await supabase.from('user_interests').insert(interestPayload);

      navigate('/home');
      // FIXED: Removed stray </button> tag here
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 border border-[#E7D0C5]">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3A2E22] text-[#F5EFE6] font-bold text-sm">
              {step}
            </span>
            <span className="text-[#C6B29A] text-sm uppercase tracking-widest font-semibold">
              Step {step} of 2
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#3A2E22]">
            {step === 1 ? "Choose your perspective" : "Curate your feed"}
          </h2>
          <p className="text-[#5C4633] mt-2">
            {step === 1 
              ? "How do you want to consume information on Insights?" 
              : "Select at least 3 topics to personalize your experience."}
          </p>
        </div>

        {/* Step 1: Mode Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {CONTENT_MODES.map((mode) => (
                <ModeCard 
                  key={mode.id}
                  mode={mode}
                  isSelected={contentMode === mode.id}
                  onClick={() => setContentMode(mode.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={!contentMode}
                className="flex items-center gap-2 px-8 py-3 bg-[#3A2E22] text-[#F3E5D8] rounded-lg font-semibold 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5C4633] transition-all"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interest Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(INTERESTS_DATA[contentMode] || {}).map(([category, list]) => (
                <InterestSection 
                  key={category}
                  title={category}
                  interests={list}
                  selectedInterests={selectedInterests}
                  onToggle={handleInterestToggle}
                  isExpanded={expandedCategory === category}
                  onExpand={() => setExpandedCategory(expandedCategory === category ? null : category)}
                />
              ))}
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E7D0C5]">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[#5C4633] hover:text-[#3A2E22] font-medium px-4 py-2"
              >
                <ArrowLeft size={18} /> Back
              </button>

              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${selectedInterests.length < 3 ? "text-red-500" : "text-green-600"}`}>
                  {selectedInterests.length} selected
                </span>
                <button
                  onClick={handleComplete}
                  disabled={selectedInterests.length < 3 || loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[#8B5E3C] text-white rounded-lg font-semibold 
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6E472F] shadow-md transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Setup"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;