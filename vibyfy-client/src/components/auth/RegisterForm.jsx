import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, formatAuthError } from "../../services/authService";
import VibyfyLogo from "../brand/VibyfyLogo";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please retype password.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name.trim());
      toast.success("Account created successfully! Welcome to VIBYFY 🎉");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-slate-900/90 border border-slate-800 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-xl space-y-6 select-none"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <VibyfyLogo size="large" showText={true} />
        <h1 className="text-2xl font-black text-white tracking-tight mt-2">
          Create VIBYFY Account
        </h1>
        <p className="text-xs text-slate-400">
          Join VIBYFY to personalize your music journey.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

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
            Password (min 6 characters)
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 outline-none text-sm transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            minLength={6}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 text-sm transition disabled:opacity-50"
      >
        {loading ? "Creating Account & User Profile..." : "Create VIBYFY Account"}
      </button>

      <p className="text-slate-400 text-center text-xs">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-400 font-bold hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;