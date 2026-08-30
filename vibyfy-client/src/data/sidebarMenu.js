import {
  Home,
  Search,
  Library,
  Smile,
  HeartPulse,
  Heart,
  User,
  Settings,
  Bell,
  ListMusic,
  FolderOpen,
  BarChart3,
  Sparkles,
  FileMusic
} from "lucide-react";

const sidebarMenu = [
  {
    title: "Home",
    icon: Home,
    path: "/",
  },
  {
    title: "Search",
    icon: Search,
    path: "/search",
  },
  {
    title: "Library",
    icon: Library,
    path: "/library",
  },
  {
    title: "Favorites",
    icon: Heart,
    path: "/favorites",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    title: "Mood Scan",
    icon: Smile,
    path: "/mood",
  },
  {
    title: "Relief Zone",
    icon: HeartPulse,
    path: "/relief",
  },
  {
    title: "Queue",
    icon: ListMusic,
    path: "/queue",
  },
  {
    title: "Playlists",
    icon: FolderOpen,
    path: "/playlists",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },

  {
  title: "Analytics",
  path: "/analytics",
  icon: BarChart3,
},
{
    title: "AI Playlist",
    path: "/ai-playlist",
    icon: Sparkles,
},

{
    title: "Lyrics",
    path: "/lyrics",
    icon: FileMusic,
},
{
  title: "Wrapped",
  icon: Sparkles,
  path: "/wrapped",
},

];

export default sidebarMenu;