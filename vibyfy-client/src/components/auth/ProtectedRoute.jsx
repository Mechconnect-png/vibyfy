import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import VibyfyLogo from "../brand/VibyfyLogo";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none">
        <VibyfyLogo size="large" showText={true} />
        <div className="flex items-center gap-1.5 mt-6 h-6">
          <span className="w-1.5 h-6 bg-purple-500 rounded-full animate-pulse" />
          <span className="w-1.5 h-8 bg-pink-500 rounded-full animate-pulse delay-75" />
          <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-pulse delay-150" />
        </div>
        <p className="mt-3 text-xs text-slate-400 font-semibold tracking-wider uppercase">
          Authenticating VIBYFY Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;