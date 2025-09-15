// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import Contact from "./Components/contact";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Loader from "./Components/ui/Loader"; 
import Pomodoro from "./Components/DashBoard/Pomodoro"; // ✅ Pomodoro Page
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Dashboard from "./Components/Dashboard";

import { ArrowUp } from "lucide-react"; 

// ✅ Home Component
function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] scroll-smooth overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 px-4 py-24 text-[var(--foreground)]">
        <ScrollRevealWrapper>
          <div id="home">
            <Hero />
          </div>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper delay={0.1}>
          <AdStrip />
        </ScrollRevealWrapper>

        <ScrollRevealWrapper delay={0.2}>
          <div id="features">
            <FeaturesSection />
          </div>
        </ScrollRevealWrapper>

        <div id="about">
          <About />
        </div>

        <ScrollRevealWrapper delay={0.2}>
          <div id="contact">
            <Contact />
          </div>
        </ScrollRevealWrapper>

        <Footer />
      </main>

      {/* ✅ Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

// ✅ App Component
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app/data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pomodoro" element={<Pomodoro />} /> 
    </Routes>
  );
}

export default App;
