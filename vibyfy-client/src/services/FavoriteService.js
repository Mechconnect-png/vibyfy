import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const getLocalFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("vibyfy_favorites") || "[]");
  } catch (e) {
    return [];
  }
};

const setLocalFavorites = (favs) => {
  localStorage.setItem("vibyfy_favorites", JSON.stringify(favs));
};

export const getFavorites = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const favsRef = collection(db, "users", user.uid, "favorites");
      const snap = await getDocs(favsRef);
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Firestore getFavorites notice:", e.message);
    }
  }
  return getLocalFavorites();
};

export const addFavorite = async (song) => {
  if (!song) return;
  const songId = typeof song === "string" ? song : song.spotifyId || song.id;
  const songObj = typeof song === "string" ? { id: songId, spotifyId: songId } : song;

  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      await setDoc(docRef, songObj, { merge: true });
    } catch (e) {
      console.warn("Firestore addFavorite notice:", e.message);
    }
  }

  const local = getLocalFavorites();
  if (!local.some((s) => (s.spotifyId || s.id) === songId)) {
    setLocalFavorites([...local, songObj]);
  }
};

export const removeFavorite = async (songId) => {
  if (!songId) return;
  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn("Firestore removeFavorite notice:", e.message);
    }
  }

  const local = getLocalFavorites();
  setLocalFavorites(local.filter((s) => (s.spotifyId || s.id) !== songId));
};

export const isFavorite = async (songId) => {
  if (!songId) return false;
  const user = auth.currentUser;
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid, "favorites", songId);
      const snap = await getDoc(docRef);
      if (snap.exists()) return true;
    } catch (e) {}
  }

  const local = getLocalFavorites();
  return local.some((s) => (s.spotifyId || s.id) === songId);
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
};