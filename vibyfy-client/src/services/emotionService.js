import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

export const loadModels = async () => {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);

  console.log("✅ Face API Models Loaded");
};

export const detectEmotion = async (video) => {
  if (!video) return null;

  const detection = await faceapi
    .detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    )
    .withFaceExpressions();

  if (!detection) return null;

  const expressions = detection.expressions;

  const emotion = Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );

  return emotion;
};