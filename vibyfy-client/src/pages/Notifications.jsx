import { useEffect, useState } from "react";
import {
  Bell,
  Trash2,
  CheckCircle,
} from "lucide-react";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async (id) => {
    await markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, is_read: true }
          : n
      )
    );
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);

    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="space-y-8 pb-24">

      <h1 className="text-4xl font-bold">
        🔔 Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-10 text-center">
          <Bell
            size={60}
            className="mx-auto text-slate-600"
          />

          <h2 className="text-2xl mt-5">
            No Notifications
          </h2>

          <p className="text-slate-400 mt-2">
            You're all caught up.
          </p>
        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-6 flex justify-between ${
              item.is_read
                ? "bg-slate-900"
                : "bg-purple-900/30 border border-purple-700"
            }`}
          >
            <div>
              <h2 className="font-bold">
                {item.title}
              </h2>

              <p className="text-slate-400 mt-2">
                {item.message}
              </p>
            </div>

            <div className="flex gap-3">

              {!item.is_read && (
                <button
                  onClick={() => handleRead(item.id)}
                >
                  <CheckCircle />
                </button>
              )}

              <button
                onClick={() =>
                  handleDelete(item.id)
                }
              >
                <Trash2 />
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default Notifications;