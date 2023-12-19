import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";
export const runDetector = async (video, canvas, setFrames) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );

  let startTime = null;
  let currentFrames = [];

  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);

    const ctx = canvas.getContext("2d");

    if (!startTime) {
      startTime = performance.now();
    }

    const elapsedTime = performance.now() - startTime;

    currentFrames.push(";-1-;   " + currentFrames.length);
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      drawMesh(faces[0], ctx);
    });

    detect(detector);
    console.log(currentFrames.length);

    // const duration = 5000;
    setFrames(currentFrames);
    // if (elapsedTime > duration) {
    //   console.log("Captured 5 seconds of data:", currentFrames);
    //   startTime = null;
    //   currentFrames = [];
    // }
  };

  detect(detector);
};
