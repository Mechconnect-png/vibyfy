export const getNotifications = async () => {
  return [
    { id: "n1", title: "Welcome to VIBYFY!", message: "Explore AI mood intelligence soundscapes.", read: false, createdAt: new Date().toISOString() },
    { id: "n2", title: "Spotify Connected", message: "Spotify playback integration active.", read: true, createdAt: new Date().toISOString() },
  ];
};

export const markAsRead = async (id) => {
  return true;
};

export const deleteNotification = async (id) => {
  return true;
};

export default {
  getNotifications,
  markAsRead,
  deleteNotification,
};