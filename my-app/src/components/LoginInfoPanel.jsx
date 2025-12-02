import React from "react";
import { motion } from "framer-motion";

const LoginInfoPanel = () => {
  return (
    <div className="relative w-full md:w-5/12 bg-[#806a55] text-[#F3E5D8] flex flex-col justify-between p-8 md:p-12 overflow-hidden">
      {/* Decorative Circle */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C6B29A] rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-bold tracking-widest uppercase text-[#C6B29A]">
          Insights
        </h2>
      </motion.div>

      {/* Main Content */}
      <div className="z-10 mt-12 md:mt-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif font-medium leading-tight mb-6"
        >
          Curate your <br />
          <span className="text-[#C6B29A] italic">knowledge.</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[#E7D0C5]/80 text-lg font-light leading-relaxed max-w-sm"
        >
          Your personalized hub for discovery and evolution. Join the research platform built for depth.
        </motion.p>
      </div>

      {/* Footer / Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-xs text-[#C6B29A]/60 mt-12"
      >
        © 2025 Insights Platform. <br/>All rights reserved.
      </motion.div>
    </div>
  );
};

export default LoginInfoPanel;