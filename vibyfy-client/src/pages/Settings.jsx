import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Bell,
  Volume2,
  Globe,
  Palette,
  Shield,
  LogOut,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [language, setLanguage] = useState("English");
  const [accentColor, setAccentColor] = useState("Purple");

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    toast(
      "Account deletion requires admin approval. Please contact support to permanently delete your account.",
      { icon: "⚠️" }
    );
  };

  return (
    <div className="pb-32">

      <h1 className="text-5xl font-bold mb-10">
        ⚙ Settings
      </h1>

      <div className="space-y-6">

        <SettingCard
          icon={<Moon />}
          title="Dark Mode"
          description="Enable dark appearance"
          value={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />

        <SettingCard
          icon={<Bell />}
          title="Notifications"
          description="Receive song & playlist updates"
          value={notifications}
          onChange={() =>
            setNotifications(!notifications)
          }
        />

        <SettingCard
          icon={<Volume2 />}
          title="High Quality Audio"
          description="Stream at highest quality"
          value={highQuality}
          onChange={() =>
            setHighQuality(!highQuality)
          }
        />

        <SettingCard
          icon={<Shield />}
          title="Auto Play"
          description="Automatically play next song"
          value={autoplay}
          onChange={() =>
            setAutoplay(!autoplay)
          }
        />

        <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Globe className="text-purple-500" />
            <div>
              <h3 className="font-semibold">
                Language
              </h3>

              <p className="text-slate-400 text-sm">
                {language}
              </p>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              toast.success(`Language set to ${e.target.value}`);
            }}
            className="bg-slate-800 rounded-lg px-3 py-2"
          >
            <option>English</option>
            <option>Tamil</option>
          </select>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Palette className="text-purple-500" />
            <div>
              <h3 className="font-semibold">
                Accent Color
              </h3>

              <p className="text-slate-400 text-sm">
                {accentColor}
              </p>
            </div>
          </div>

          <select
            value={accentColor}
            onChange={(e) => {
              setAccentColor(e.target.value);
              toast.success(`Accent color set to ${e.target.value}`);
            }}
            className="bg-slate-800 rounded-lg px-3 py-2"
          >
            <option>Purple</option>
            <option>Blue</option>
            <option>Green</option>
            <option>Orange</option>
            <option>Pink</option>
          </select>
        </div>

        <button
          onClick={handleLogout}
          className="
          w-full
          bg-red-600
          hover:bg-red-700
          py-4
          rounded-2xl
          flex
          justify-center
          items-center
          gap-3
          text-lg
          font-semibold
        "
        >
          <LogOut size={22} />
          Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          className="
          w-full
          border
          border-red-500
          py-4
          rounded-2xl
          flex
          justify-center
          items-center
          gap-3
          text-red-400
          hover:bg-red-600
          hover:text-white
        "
        >
          <Trash2 size={22} />
          Delete Account
        </button>

      </div>

    </div>
  );
};

const SettingCard = ({
  icon,
  title,
  description,
  value,
  onChange,
}) => (
  <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center">

    <div className="flex items-center gap-5">

      <div className="text-purple-500">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-slate-400 text-sm">
          {description}
        </p>
      </div>

    </div>

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className="sr-only peer"
      />

      <div
        className="
        w-12
        h-6
        bg-slate-700
        rounded-full
        peer
        peer-checked:bg-purple-600
        after:content-['']
        after:absolute
        after:top-0.5
        after:left-0.5
        after:bg-white
        after:h-5
        after:w-5
        after:rounded-full
        after:transition-all
        peer-checked:after:translate-x-6
      "
      />
    </label>
  </div>
);

export default Settings;