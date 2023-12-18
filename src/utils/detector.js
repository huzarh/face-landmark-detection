import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";
import { framesData } from "./frames/frame_2";
import { framesData_1 } from "./frames/frame_1";
import { useEffect } from "react";

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
    const duration = 10000;

    frames.push({ time: elapsedTime, keypoints: faces[0]?.keypoints });
    requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);
    if (elapsedTime > duration) {
      const jsonString = JSON.stringify(frames);
      const blob = new Blob([jsonString], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "alphabes.json";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      console.log("Captured 10 seconds of data:", frames);
      startTime = null;
      frames = [];
    }

    //     const fixedKeypointIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];                                            A	B	C	Ç	D	E	F	G	Ğ	H	İ	I	J	K	L	M	N	O	Ö	P	R	S	Ş	T	U	Ü	V	Y	Z
    // const frameDelay = 100;

    // const replayFrames = (canvas, framesData, drawCallback) => {
    //   const ctx = canvas.getContext("2d");
    //   let frameIndex = 0;
    //   const startTime = performance.now();

    //   const fixedKeypoints = fixedKeypointIndices.map((index) => framesData[0].keypoints[index]);

    //   const renderFrame = () => {
    //     const elapsedTime = performance.now() - startTime;

    //     if (frameIndex < framesData.length && elapsedTime >= framesData[frameIndex].time) {
    //       const currentKeypoints = framesData[frameIndex].keypoints;
    //       const offsets = fixedKeypoints.map((fixedKeypoint, i) => ({
    //         offsetX: fixedKeypoint.x - currentKeypoints[fixedKeypointIndices[i]].x,
    //         offsetY: fixedKeypoint.y - currentKeypoints[fixedKeypointIndices[i]].y,
    //       }));

    //       drawCallback(currentKeypoints, ctx, offsets);

    //       frameIndex++;
    //     }

    //     if (frameIndex === framesData.length) {
    //       frameIndex = 0;
    //     }

    //     setTimeout(renderFrame, frameDelay);
    //   };

    //   renderFrame();
    // };

    // replayFrames(canvas, framesData, drawMesh);
  };

  detect(detector);
};
