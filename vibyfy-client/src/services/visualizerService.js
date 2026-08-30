let analyser = null;
let audioContext = null;
let source = null;

export const connectVisualizer = (audioElement) => {
  if (!audioElement) return null;

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (source) return analyser;

  source = audioContext.createMediaElementSource(audioElement);

  analyser = audioContext.createAnalyser();

  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  return analyser;
};

export const getAnalyser = () => analyser;