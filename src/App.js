import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";

const inputResolution = {
  width: 1080,
  height: 900,
};
const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};
function App() {
  let frames = [];

  const save = (arg) => {
    const jsonString = JSON.stringify(arg);
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alphabes.json";
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    console.log("Captured 5 seconds of data:", arg);
    startTime = null;
    arg = [];
  };
  // Check if the browser supports navigator.mediaDevices.getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request access to the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        // If access is granted, display the video stream in a video element
        const video = document.querySelector("video");
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        // Handle the error
        console.error("Error accessing the webcam: ", err);
      });
  } else {
    console.error("getUserMedia is not supported in this browser");
  }

  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current, frames);
    setLoaded(true);
  };
  const css = {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "blue",

    width: 10,
    height: 10,
  };
  return (
    <div>
      <button
        style={{
          position: "absolute",
          backgroundColor: "red",
          padding: 20,
          marginLeft: 700,
          marginTop: 200,
        }}
        onClick={() => save(frames)}
      >
        İnder
      </button>
      <div
        style={{
          ...css,
          marginTop: inputResolution.width / 2.7,
          marginLeft: inputResolution.height / 2,
        }}
      ></div>
      <div
        style={{
          ...css,
          marginTop: inputResolution.width / 1.7,
          marginLeft: inputResolution.height / 2,
        }}
      ></div>
      <div
        style={{
          ...css,
          marginTop: inputResolution.width / 1.6,
          marginLeft: inputResolution.height / 2.2,
        }}
      ></div>
      <div
        style={{
          ...css,
          marginTop: inputResolution.width / 1.6,
          marginLeft: inputResolution.height / 1.8,
        }}
      ></div>
      <Webcam
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ visibility: "hidden", position: "absolute" }}
        videoConstraints={videoConstraints}
        onLoadedData={handleVideoLoad}
      />
      <canvas
        ref={canvasRef}
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ backgroundColor: "grey" }}
      />
      {loaded ? <></> : <header>Loading...</header>}
    </div>
  );
}

export default App;
