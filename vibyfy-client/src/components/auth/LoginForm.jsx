import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn, formatAuthError } from "../../services/authService";
import VibyfyLogo from "../brand/VibyfyLogo";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      toast.success("Welcome back to VIBYFY 👋");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-slate-900/90 border border-slate-800 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-xl space-y-6 select-none"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <VibyfyLogo size="large" showText={true} />
        <h1 className="text-2xl font-black text-white tracking-tight mt-2">
          VIBYFY Login
        </h1>
        <p className="text-xs text-slate-400">
          Your vibe is waiting. Sign in to continue.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="listener@vibyfy.app"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 text-sm transition disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Login to VIBYFY"}
      </button>

      <p className="text-slate-400 text-center text-xs">
        Don't have an account?{" "}
        <Link to="/register" className="text-purple-400 font-bold hover:underline">
          Create VIBYFY Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;