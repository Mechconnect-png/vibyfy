import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";

const HomeHeader = () => {
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("Music Lover");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("☀️ Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("🌤 Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("🌙 Good Evening");
    } else {
      setGreeting("🌌 Good Night");
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      if (currentUser.displayName) {
        setUsername(currentUser.displayName);
      } else if (currentUser.email) {
        setUsername(currentUser.email.split("@")[0]);
      }
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 select-none">
      <div>
        <h2 className="text-4xl font-bold">{greeting}</h2>
        <p className="text-slate-400 text-lg mt-2">
          Welcome back,
          <span className="text-purple-400 font-semibold"> {username}</span>
        </p>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <div className="bg-slate-900 rounded-xl px-5 py-3 border border-slate-800">
          <p className="text-sm text-slate-400">Today</p>
          <h3 className="text-xl font-bold">🎵 Enjoy Your Music</h3>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;