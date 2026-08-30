import React, { useRef, useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";
import {
  Camera,
  CameraOff,
  Sparkles,
  Lock,
  RotateCcw,
  Music,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import useMoodStore from "../../store/moodStore";
import useUsageStore from "../../store/usageStore";
import { getMoodTheme } from "../../theme/moods";
import toast from "react-hot-toast";

const MANUAL_MOOD_OPTIONS = [
  { label: "Happy", value: "happy", emoji: "😊" },
  { label: "Sad", value: "sad", emoji: "😢" },
  { label: "Calm", value: "calm", emoji: "😌" },
  { label: "Angry", value: "angry", emoji: "😡" },
  { label: "Stressed", value: "stressed", emoji: "😰" },
  { label: "Excited", value: "excited", emoji: "⚡" },
  { label: "Neutral", value: "neutral", emoji: "🙂" },
];

export const MoodScanner = ({ onDiscoveryRequested, onLimitReached }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const demoIntervalRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [autoLockMessage, setAutoLockMessage] = useState("");

  const { canStartMoodScan, recordMoodScan } = useUsageStore();

  const {
    liveMood,
    liveConfidence,
    lockedMood,
    lockedConfidence,
    isLocked,
    isScanning,
    startScan,
    stopScan,
    setLivePrediction,
    evaluateAutoLock,
    lockMoodManual,
    resetMoodScan,
  } = useMoodStore();

  const activeTheme = getMoodTheme(isLocked ? lockedMood : liveMood);

  const stopCameraResources = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCameraActive(false);
    setIsDemoMode(false);
    stopScan();
  }, [stopScan]);

  const triggerAutoLockSuccess = (mood, conf) => {
    stopCameraResources();
    recordMoodScan();
    toast.success(`🔒 VIBE LOCKED: ${mood.toUpperCase()} (${conf}%)`, {
      duration: 4000,
      icon: "✨",
    });
    setAutoLockMessage(`Auto-locked on stable ${mood.toUpperCase()} expression.`);
  };

  // STEP 12: Limit Check Before Camera
  const startCameraScan = async () => {
    if (!canStartMoodScan()) {
      if (onLimitReached) {
        onLimitReached();
      } else {
        toast.error("Daily Mood Scan Limit Reached. Watch ads or upgrade to Premium!");
      }
      return;
    }

    resetMoodScan();
    setCameraError("");
    setAutoLockMessage("");

    try {
      setLoadingModels(true);
      toast.loading("Loading face detection models...", { id: "vibyfy-models" });

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);
      } catch (e) {
        console.warn("Face-api models notice:", e);
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access is not supported by your browser or requires HTTPS.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
      setIsDemoMode(false);
      setLoadingModels(false);
      startScan();

      toast.success("Camera active. Analyzing expression...", { id: "vibyfy-models" });

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) return;

        try {
          const video = videoRef.current;
          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.35 }))
            .withFaceExpressions();

          if (detection && detection.expressions) {
            const expressions = detection.expressions;
            const topEmotion = Object.keys(expressions).reduce((a, b) =>
              expressions[a] > expressions[b] ? a : b
            );
            const score = Math.round((expressions[topEmotion] || 0.8) * 100);

            setLivePrediction(topEmotion, score);

            if (canvasRef.current && video.videoWidth && video.videoHeight) {
              const canvas = canvasRef.current;
              const displaySize = { width: video.clientWidth || 640, height: video.clientHeight || 480 };
              faceapi.matchDimensions(canvas, displaySize);
              const resized = faceapi.resizeResults(detection, displaySize);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (resized.detection) {
                  const { box } = resized.detection;
                  ctx.strokeStyle = "#A855F7";
                  ctx.lineWidth = 3;
                  ctx.strokeRect(box.x, box.y, box.width, box.height);
                }
              }
            }

            const result = evaluateAutoLock(75, 1200);
            if (result.locked) {
              triggerAutoLockSuccess(result.mood, result.confidence);
            }
          }
        } catch (err) {
          console.warn("Frame analysis warning:", err);
        }
      }, 300);
    } catch (err) {
      console.error("Camera access error:", err);
      setLoadingModels(false);
      stopCameraResources();

      let msg = "Camera unavailable. You can run Demo Mode or select your mood manually below.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera permission was denied in your browser settings. Try Demo Mode or choose manually.";
      }
      setCameraError(msg);
      toast.error(msg, { id: "vibyfy-models", duration: 5000 });
    }
  };

  const startDemoScan = () => {
    if (!canStartMoodScan()) {
      if (onLimitReached) onLimitReached();
      return;
    }

    stopCameraResources();
    resetMoodScan();
    setCameraError("");
    setIsDemoMode(true);
    setCameraActive(true);
    startScan();
    toast.success("AI Demo Scanner active", { id: "vibyfy-models" });

    const sampleMoods = ["happy", "calm", "sad", "sad", "sad"];
    let step = 0;

    demoIntervalRef.current = setInterval(() => {
      const current = sampleMoods[step % sampleMoods.length];
      const conf = 85 + Math.floor(Math.random() * 10);
      setLivePrediction(current, conf);
      step++;

      if (step >= 4) {
        const result = evaluateAutoLock(70, 1000);
        if (result.locked) {
          triggerAutoLockSuccess(result.mood, result.confidence);
        }
      }
    }, 400);
  };

  const handleManualMoodSelect = (moodValue) => {
    if (!canStartMoodScan()) {
      if (onLimitReached) onLimitReached();
      return;
    }
    stopCameraResources();
    recordMoodScan();
    lockMoodManual(moodValue, 100);
    toast.success(`Vibe manually set to ${moodValue.toUpperCase()} 🎯`);
    if (onDiscoveryRequested) {
      onDiscoveryRequested(moodValue);
    }
  };

  const handleScanAgain = () => {
    stopCameraResources();
    resetMoodScan();
    startCameraScan();
  };

  useEffect(() => {
    if (cameraActive && !isDemoMode && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
        video.play().catch((err) => console.warn("Video stream play notice:", err));
      }
    }
  }, [cameraActive, isDemoMode]);

  useEffect(() => {
    return () => {
      stopCameraResources();
    };
  }, [stopCameraResources]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* SCANNER CONTAINER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[80px] opacity-30 ${activeTheme.accent}`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Vibe Scanner 2.0</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI continuous expression analysis with Automatic Mood Lock.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isLocked && !cameraActive ? (
              <>
                <button
                  onClick={startCameraScan}
                  disabled={loadingModels}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 text-sm"
                >
                  <Camera size={18} />
                  <span>{loadingModels ? "Initializing AI..." : "Start Camera Scan"}</span>
                </button>

                <button
                  onClick={startDemoScan}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl transition text-sm"
                >
                  <PlayCircle size={18} />
                  <span>Demo Mode</span>
                </button>
              </>
            ) : isScanning ? (
              <button
                onClick={stopCameraResources}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-semibold px-4 py-2 rounded-xl transition text-sm"
              >
                <CameraOff size={18} />
                <span>Cancel Scanner</span>
              </button>
            ) : (
              <button
                onClick={handleScanAgain}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-semibold px-4 py-2.5 rounded-xl transition text-sm"
              >
                <RotateCcw size={18} />
                <span>Scan Again</span>
              </button>
            )}
          </div>
        </div>

        {cameraError && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-sm">
            <AlertCircle size={20} className="shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-white">Camera Access Note</p>
              <p className="text-xs text-slate-300 mt-1">{cameraError}</p>
            </div>
            <button
              onClick={startDemoScan}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shrink-0"
            >
              Try Demo AI Scan
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl aspect-video overflow-hidden flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] ${
                  cameraActive && !isDemoMode && !isLocked ? "block" : "hidden"
                }`}
              />

              <canvas
                ref={canvasRef}
                className={`absolute inset-0 pointer-events-none scale-x-[-1] ${
                  cameraActive && !isDemoMode && !isLocked ? "block" : "hidden"
                }`}
              />

              {cameraActive && isDemoMode && !isLocked && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-purple-950/60 via-slate-950 to-pink-950/40">
                  <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400"
                    />
                    <Sparkles size={32} className="text-pink-400 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Reading Expression...</h3>
                  <p className="text-xs text-purple-300 mt-1 uppercase tracking-widest font-semibold">
                    Live Vibe: {liveMood} ({liveConfidence}%)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Auto-locking once expression stabilizes (~1.5s)
                  </p>
                </div>
              )}

              {cameraActive && !isLocked && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 text-purple-200 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  <span>Scanning Vibe: {liveMood.toUpperCase()} ({liveConfidence}%)</span>
                </div>
              )}

              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-b ${activeTheme.accent}`} />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
                      <Lock size={14} />
                      <span>VIBE LOCKED</span>
                    </div>

                    <div className="text-6xl mb-2 filter drop-shadow-lg">
                      {activeTheme.emoji}
                    </div>

                    <h3 className="text-3xl font-extrabold text-white capitalize tracking-tight">
                      {lockedMood}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs">
                      "We've captured your current vibe."
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <button
                        onClick={() => onDiscoveryRequested && onDiscoveryRequested(lockedMood)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 text-sm transition"
                      >
                        <Music size={18} />
                        <span>Discover Your Sound</span>
                      </button>

                      <button
                        onClick={handleScanAgain}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
                      >
                        <RotateCcw size={16} />
                        <span>Scan Again</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {!cameraActive && !isLocked && (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                    <Camera size={32} />
                  </div>
                  <h3 className="font-bold text-white text-lg">AI Camera Scanner Ready</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Start Camera Scan" to let VIBYFY analyze your facial expressions and automatically lock your mood.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {isLocked ? "Session Locked Mood" : "Live Mood Indicator"}
                </span>
                <span className="text-xs font-semibold text-purple-400">
                  Confidence: {isLocked ? lockedConfidence : liveConfidence}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeTheme.emoji}</span>
                  <div>
                    <div className="text-2xl font-black text-white capitalize">
                      {isLocked ? lockedMood : liveMood}
                    </div>
                    <p className="text-xs text-slate-400">{activeTheme.tagline}</p>
                  </div>
                </div>
              </div>

              {isLocked ? (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>Locked. Facial changes will no longer update recommendations.</span>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-purple-400 shrink-0" />
                  <span>Detection locks automatically when stable for ~1.5s.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Or Choose Your Vibe Manually:
              </label>
              <div className="flex flex-wrap gap-2">
                {MANUAL_MOOD_OPTIONS.map((m) => {
                  const isSelected = (isLocked ? lockedMood : liveMood) === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => handleManualMoodSelect(m.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <HelpCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Privacy & Disclaimer:</strong> Camera facial analysis is processed strictly locally inside your browser. No image data is saved, recorded, or transmitted. VIBYFY is an entertainment & music discovery platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodScanner;