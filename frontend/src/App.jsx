// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";
import About from "./Components/About";
import AdStrip from "./Components/Ad";
import { FeaturesSection } from "./Components/Features";
import Footer from "./Components/footer";
import ScrollRevealWrapper from "./Components/ui/ScrollRevealWrapper";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/profile/Profile";
import ProtectedRoute from "./Components/auth/ProtectedRoute";

// Home component that contains the main landing page content
function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] scroll-smooth overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 px-4 py-24">
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

        <Footer />
      </main>
    </div>
  );
}

function App() {
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
    </Routes>
  );
}

export default App;
