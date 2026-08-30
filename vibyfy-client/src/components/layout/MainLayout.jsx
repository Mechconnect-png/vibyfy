import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import MiniPlayer from "../player/MiniPlayer";

const MainLayout = ({ onOpenPremium }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar onOpenPremium={onOpenPremium} />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar onOpenPremium={onOpenPremium} />

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-36 md:pb-28">
          <Outlet />
        </main>

        {/* Audio Mini Player */}
        <MiniPlayer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default MainLayout;