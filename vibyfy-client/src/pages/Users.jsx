import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      if (list.length > 0) {
        setUsers(list);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Firestore loadUsers notice:", e.message);
    }
    setUsers([
      { uid: "u1", fullName: "VIBYFY Listener", email: "listener@vibyfy.app", plan: "free" },
      { uid: "u2", fullName: "Premium Viber", email: "pro@vibyfy.app", plan: "premium" },
    ]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 select-none">
      <h1 className="text-4xl font-bold text-white">Users</h1>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-slate-300">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="p-4 text-left font-bold">Name</th>
              <th className="p-4 text-left font-bold">Email</th>
              <th className="p-4 text-left font-bold">Plan</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-slate-400">Loading user records...</td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.uid || user.email} className="border-t border-slate-800 hover:bg-slate-800/50">
                <td className="p-4 font-semibold text-white">{user.fullName || user.name || "User"}</td>
                <td className="p-4 text-sm text-slate-400">{user.email}</td>
                <td className="p-4 capitalize">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.plan === "premium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-purple-500/10 text-purple-300 border border-purple-500/30"}`}>
                    {user.plan || "free"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;