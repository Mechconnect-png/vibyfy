export const lyrics = {
  "Arabic Kuthu": [
    { time: 0, text: "Halamithi Habibo..." },
    { time: 5, text: "Vaathi Coming..." },
    { time: 10, text: "Arabic Kuthu Starts..." },
    { time: 15, text: "Everybody Dance..." },
    { time: 20, text: "Enjoy the Music..." },
  ],

  "Naa Ready": [
    { time: 0, text: "Naa Ready..." },
    { time: 6, text: "Let's Go..." },
    { time: 12, text: "Thalapathy Entry..." },
    { time: 18, text: "Crowd Goes Crazy..." },
  ],
};

export const getLyrics = (songTitle) => {
  return lyrics[songTitle] || [];
};