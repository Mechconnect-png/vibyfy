import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import VibyfyLogo from "../components/brand/VibyfyLogo";

// Lazy Loaded Pages
const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const Library = lazy(() => import("../pages/Library"));
const Mood = lazy(() => import("../pages/Mood"));
const Relief = lazy(() => import("../pages/Relief"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Player = lazy(() => import("../pages/Player"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const SpotifyCallback = lazy(() => import("../pages/SpotifyCallback"));

const ArtistDashboard = lazy(() => import("../pages/ArtistDashboard"));
const ArtistAnalytics = lazy(() => import("../pages/ArtistAnalytics"));
const ArtistProfile = lazy(() => import("../pages/ArtistProfile"));

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminUpload = lazy(() => import("../pages/AdminUpload"));
const Users = lazy(() => import("../pages/Users"));

const Favorites = lazy(() => import("../pages/Favorites"));
const QueuePage = lazy(() => import("../pages/Queue"));

const Playlists = lazy(() => import("../pages/Playlists"));
const PlaylistDetails = lazy(() => import("../pages/PlaylistDetails"));

const Notifications = lazy(() => import("../pages/Notifications"));
const Analytics = lazy(() => import("../pages/Analytics"));
const AnalyticsApiKeys = lazy(() => import("../pages/AnalyticsApiKeys"));
const Wrapped = lazy(() => import("../pages/Wrapped"));

const Lyrics = lazy(() => import("../pages/Lyrics"));
const AIPlaylistPage = lazy(() => import("../pages/AIPlaylistPage"));

const AppRoutes = ({ onOpenPremium }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none">
          <VibyfyLogo size="large" showText={true} />
          <div className="flex items-center gap-1.5 mt-6 h-6">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full animate-pulse" />
            <span className="w-1.5 h-8 bg-pink-500 rounded-full animate-pulse delay-75" />
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-pulse delay-150" />
            <span className="w-1.5 h-7 bg-purple-400 rounded-full animate-pulse delay-200" />
          </div>
          <p className="mt-3 text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Loading VIBYFY...
          </p>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/spotify-callback" element={<SpotifyCallback />} />

        {/* Main Application Shell */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout onOpenPremium={onOpenPremium} />
            </ProtectedRoute>
          }
        >
          {/* Core Product Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/player" element={<Player />} />

          {/* Mood Intelligence & Relief */}
          <Route path="/mood" element={<Mood />} />
          <Route path="/relief" element={<Relief />} />

          {/* Playlists */}
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetails />} />

          {/* Artist Dashboard */}
          <Route element={<RoleRoute allowedRoles={["artist", "admin"]} />}>
            <Route path="/artist" element={<ArtistDashboard />} />
            <Route path="/artist/analytics" element={<ArtistAnalytics />} />
          </Route>
          <Route path="/artist/:id" element={<ArtistProfile />} />

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<AdminUpload />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          {/* Utilities */}
          <Route path="/ai-playlist" element={<AIPlaylistPage />} />
          <Route path="/lyrics" element={<Lyrics />} />

          {/* User Profile */}
          <Route path="/profile" element={<Profile onOpenPremium={onOpenPremium} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/api-keys" element={<AnalyticsApiKeys />} />
          <Route path="/wrapped" element={<Wrapped />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;