import { supabase } from "../lib/supabase";

// ======================================
// Get Current User
// ======================================
const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

// ======================================
// Get Notifications
// ======================================
export const getNotifications = async () => {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

// ======================================
// Create Notification
// ======================================
export const createNotification = async (
  userId,
  title,
  message
) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ======================================
// Mark One Notification as Read
// ======================================
export const markAsRead = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", notificationId);

  if (error) throw error;
};

// ======================================
// Mark All Notifications as Read
// ======================================
export const markAllAsRead = async () => {
  const user = await getCurrentUser();

  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("user_id", user.id);

  if (error) throw error;
};

// ======================================
// Delete Notification
// ======================================
export const deleteNotification = async (
  notificationId
) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) throw error;
};

// ======================================
// Delete All Notifications
// ======================================
export const clearNotifications = async () => {
  const user = await getCurrentUser();

  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
};

// ======================================
// Get Unread Count
// ======================================
export const getUnreadCount = async () => {
  const user = await getCurrentUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) throw error;

  return count || 0;
};

// ======================================
// Subscribe to Live Notifications
// ======================================
export const subscribeToNotifications = (
  callback
) => {
  supabase.auth.getUser().then(({ data }) => {
    const user = data.user;

    if (!user) return;

    supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  });
};

// ======================================
// Unsubscribe
// ======================================
export const unsubscribeNotifications = async () => {
  const channels = supabase.getChannels();

  channels.forEach((channel) => {
    supabase.removeChannel(channel);
  });
};