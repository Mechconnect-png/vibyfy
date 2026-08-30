import { useState } from "react";
import { signUp } from "../services/authService";
import toast from "react-hot-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await signUp(name, email, password);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email if confirmation is enabled.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl w-96">
        <h1 className="text-3xl font-bold text-white mb-6">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded mb-4 bg-slate-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-4 bg-slate-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded mb-6 bg-slate-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;