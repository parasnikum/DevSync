// src/App.jsx
import { FeaturesSection } from "./Components/Features";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7] relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 px-4 py-24">
        <Hero />
        <FeaturesSection />
      </main>
    </div>
  );
}

export default App;
