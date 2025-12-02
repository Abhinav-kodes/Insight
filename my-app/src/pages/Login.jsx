import React from "react";
import { motion } from "framer-motion";

// Components
import AnimatedBackground from "../components/AnimatedBackground"; // Keep your existing background
import LoginInfoPanel from "../components/LoginInfoPanel";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-[#F3E5D8]">
      {/* 1. Background Layer */}
      <AnimatedBackground />

      {/* 2. Content Layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // Custom ease for premium feel
          }}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-[#C6B29A]/40"
        >
          {/* Left: Branding & Aesthetics */}
          <LoginInfoPanel />

          {/* Right: Functional Form */}
          <LoginForm />
          
        </motion.div>
      </div>
    </div>
  );
};

export default Login;