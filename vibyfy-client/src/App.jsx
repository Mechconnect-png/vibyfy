import React, { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/brand/SplashScreen";
import PremiumModal from "./components/ui/PremiumModal";
import { Toaster } from "react-hot-toast";

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first visit per session
    const hasSeen = sessionStorage.getItem("vibyfy_splash_seen");
    return !hasSeen;
  });

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleSplashComplete = () => {
    sessionStorage.setItem("vibyfy_splash_seen", "true");
    setShowSplash(false);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#0F172A", color: "#FFF" } }} />
      
      {showSplash && <SplashScreen onComplete={handleSplashComplete} duration={2400} />}

      <AppRoutes onOpenPremium={() => setShowPremiumModal(true)} />

      <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}

export default App;