import React, { useRef, useState } from "react";
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
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current);
    setLoaded(true);
  };
  const css = {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "blue",

    marginLeft: inputResolution.height / 2,
    width: 10,
    height: 10,
  };
  return (
    <div>
      <div style={{ ...css, marginTop: inputResolution.width / 2.7 }}></div>
      <div style={{ ...css, marginTop: inputResolution.width / 1.7 }}></div>
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
