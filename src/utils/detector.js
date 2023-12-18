import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";
export const runDetector = async (video, canvas) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );

  let startTime = null;
  let frames = [];

  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);

    const ctx = canvas.getContext("2d");

    if (!startTime) {
      startTime = performance.now();
    }

    const elapsedTime = performance.now() - startTime;

    frames.push({ time: elapsedTime, keypoints: faces[0]?.keypoints });
    requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);

    const duration = 5000;
    if (elapsedTime > duration) {
      const jsonString = JSON.stringify(frames);
      const blob = new Blob([jsonString], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "alphabes.json";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      console.log("Captured 5 seconds of data:", frames);
      startTime = null;
      frames = [];
    }
  };

  detect(detector);
};
