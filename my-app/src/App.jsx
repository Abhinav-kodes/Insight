import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import AIDigest from "./pages/AIDigest";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PaperDetail from "./pages/PaperDetail";

const App = () => {
  return (
    <Routes>
      {/* === Public Pages === */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Redirect /register to /login */}
      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route path="/onboarding" element={<Onboarding />} />

      {/* === Protected Light Theme Pages === */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <div className="bg-[#F5EFE6] text-[#352414] min-h-screen font-sans">
              <Navbar theme="light" />
              <Home />
              <Footer theme="light" />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/aidigest"
        element={
          <ProtectedRoute>
            <div className="bg-[#F5EFE6] text-[#352414] min-h-screen font-sans">
              <Navbar theme="light" />
              <AIDigest />
              <Footer theme="light" />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="bg-[#F5EFE6] text-[#352414] min-h-screen font-sans">
              <Navbar theme="light" />
              <Profile />
              <Footer theme="light" />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <div className="bg-[#F5EFE6] text-[#352414] min-h-screen font-sans">
              <Navbar theme="light" />
              <About />
              <Footer theme="light" />
            </div>
          </ProtectedRoute>
        }
      />

      {/* === Paper Detail Page (Light Theme) === */}
      <Route
        path="/paper/:id"
        element={
          <ProtectedRoute>
            <div className="bg-[#F5EFE6] text-[#352414] min-h-screen font-sans">
              <Navbar theme="light" />
              <PaperDetail />
              <Footer theme="light" />
            </div>
          </ProtectedRoute>
        }
      />

      {/* === Catch All - 404 === */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
