import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { 
  Home, 
  Newspaper, 
  Sparkles,
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronDown 
} from "lucide-react";

// --- Sub-Component: Navigation Link ---
const NavLink = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
        ${isActive 
          ? "bg-[#E7D0C5]/40 text-[#3A2E22] shadow-sm border border-[#E7D0C5]/50" 
          : "text-[#5C4633] hover:bg-[#F3E5D8]/50 hover:text-[#3A2E22]"
        }`}
    >
      <Icon size={18} className={isActive ? "text-[#8B5E3C]" : "opacity-70"} />
      <span>{label}</span>
    </Link>
  );
};

// --- Sub-Component: User Dropdown ---
const UserDropdown = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserEmail(user.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-[#E7D0C5] hover:border-[#8B5E3C] bg-white transition-all shadow-sm group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C6B29A] flex items-center justify-center text-white font-serif font-bold text-sm shadow-inner">
          {userEmail ? userEmail[0].toUpperCase() : "U"}
        </div>
        <ChevronDown size={14} className={`text-[#5C4633] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-[#E7D0C5] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="px-4 py-3 border-b border-[#F3E5D8] mb-1 bg-[#F9F5F1]">
            <p className="text-sm font-bold text-[#3A2E22] truncate">My Account</p>
            <p className="text-xs text-[#5C4633] truncate">{userEmail || "User"}</p>
          </div>
          
          <button 
            onClick={() => { setIsOpen(false); navigate('/profile'); }} 
            className="w-full text-left px-4 py-2.5 text-sm text-[#5C4633] hover:bg-[#F3E5D8] flex items-center gap-3 transition-colors"
          >
            <User size={16} /> Profile Settings
          </button>

          <button 
            onClick={() => { setIsOpen(false); navigate('/onboarding'); }} 
            className="w-full text-left px-4 py-2.5 text-sm text-[#5C4633] hover:bg-[#F3E5D8] flex items-center gap-3 transition-colors"
          >
            <Sparkles size={16} /> Recurate Feed
          </button>
          
          <div className="h-px bg-[#F3E5D8] my-1" />
          
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Navbar Component ---
const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: "/home", label: "Feed", icon: Home },
    { to: "/aidigest", label: "AI Digest", icon: Newspaper },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-40 transition-all duration-300 border-b 
          ${scrolled 
            ? "bg-white/90 backdrop-blur-md border-[#E7D0C5] py-3 shadow-sm" 
            : "bg-[#E7C3A0] border-transparent py-5" /* Maintained Color Here */
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Section */}
          <div 
            onClick={() => navigate("/home")} 
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-[#3A2E22] rounded-lg flex items-center justify-center text-[#F3E5D8] shadow-md transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-serif font-bold text-[#3A2E22] tracking-tight group-hover:text-[#8B5E3C] transition-colors">
              INSIGHTS
            </span>
          </div>

          {/* Desktop Navigation (Centered Pill) */}
          <div className="hidden md:flex items-center gap-1 bg-white/60 px-2 py-1.5 rounded-full border border-[#E7D0C5]/50 backdrop-blur-sm shadow-sm">
            {navLinks.map(link => (
              <NavLink key={link.to} {...link} />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <UserDropdown navigate={navigate} />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#3A2E22] hover:bg-[#E7D0C5]/30 rounded-lg transition-colors"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#F9F5F1] animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-[#E7D0C5]">
            <span className="text-2xl font-serif font-bold text-[#3A2E22]">Menu</span>
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="p-2 bg-white rounded-full border border-[#E7D0C5] shadow-sm hover:scale-105 transition-transform"
            >
              <X size={24} className="text-[#3A2E22]" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            {navLinks.map(link => (
              <NavLink 
                key={link.to} 
                {...link} 
                onClick={() => setIsMobileOpen(false)} 
              />
            ))}
            
            <div className="h-px bg-[#E7D0C5] my-4" />
            
            <button 
              onClick={() => { setIsMobileOpen(false); navigate('/profile'); }}
              className="flex items-center gap-3 px-4 py-3 text-[#5C4633] font-medium bg-white rounded-lg border border-[#E7D0C5] shadow-sm"
            >
              <User size={20} /> Profile Settings
            </button>

            <button 
              onClick={() => {
                supabase.auth.signOut();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 text-red-600 font-medium bg-white rounded-lg border border-[#E7D0C5] shadow-sm mt-auto"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>
      )}
      
      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div className={`transition-all duration-300 ${scrolled ? "h-20" : "h-20"}`} />
    </>
  );
};

export default Navbar;