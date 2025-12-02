import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import GoogleSignInButton from "./GoogleSignInButton";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setError("Unable to connect to Google. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-7/12 bg-[#F3E5D8] flex flex-col justify-center items-center p-8 md:p-12 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-[#3A2E22]">Welcome Back</h2>
          <p className="text-[#5C4633] text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          <GoogleSignInButton 
            onClick={handleGoogleAuth} 
            loading={loading} 
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#C6B29A]/30"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#F3E5D8] text-[#5C4633]/60 uppercase tracking-wider">
                Secure Authentication
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-[#5C4633]/70 text-xs mt-8">
          By continuing, you acknowledge our{" "}
          <a href="/terms" className="underline decoration-[#C6B29A] hover:text-[#3A2E22]">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="underline decoration-[#C6B29A] hover:text-[#3A2E22]">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginForm;