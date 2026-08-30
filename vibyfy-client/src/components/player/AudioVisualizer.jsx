import { useEffect, useRef } from "react";
import { audio } from "../../store/playerStore";
import {
  connectVisualizer,
  getAnalyser,
} from "../../services/visualizerService";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    connectVisualizer(audio);

    const analyser = getAnalyser();

    if (!analyser) return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      requestAnimationFrame(render);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth =
        canvas.width / bufferLength;

      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const height = dataArray[i];

        ctx.fillStyle =
          "rgb(168,85,247)";

        ctx.fillRect(
          x,
          canvas.height - height,
          barWidth - 1,
          height
        );

        x += barWidth;
      }
    };

    render();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={180}
      className="w-full rounded-xl bg-slate-900"
    />
  );
};

export default AudioVisualizer;