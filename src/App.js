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
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [frames, setFrames] = useState([]);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (start) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [start]);
  const funcStart = () => {
    setFrames((arg) => {
      return [];
    });
    setStart(true);
  };
  const cancel = () => {
    clearInterval(intervalId);
    setTime(0);
    setStart(false);
  };

  const save = (arg) => {
    // const jsonString = JSON.stringify(arg);
    // const blob = new Blob([jsonString], { type: "application/json" });

    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = "alphabes.json";
    // document.body.appendChild(link);

    // link.click();

    // document.body.removeChild(link);

    // startTime = null;
    // arg = [];
    console.log(arg);
    clearInterval(intervalId);
    setTime(0);
    setStart(false);
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current, setFrames);
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
          backgroundColor: "blue",
          padding: 7,
          marginLeft: 800,
          marginTop: 200,
          color: "#fff",
          fontSize: 20,
          width: 100,
          borderRadius: 10,
        }}
        onClick={() => funcStart()}
      >
        başlat
      </button>
      {start && (
        <button
          style={{
            position: "absolute",
            backgroundColor: "red",
            padding: 7,
            marginLeft: 800,
            marginTop: 300,
            width: 100,
            color: "#fff",
            fontSize: 20,
            borderRadius: 10,
          }}
          onClick={() => cancel()}
        >
          İnder
        </button>
      )}
      {start && (
        <button
          style={{
            position: "absolute",
            backgroundColor: "red",
            padding: 7,
            marginLeft: 800,
            marginTop: 300,
            width: 100,
            color: "#fff",
            fontSize: 20,
            borderRadius: 10,
          }}
          onClick={() => save(frames)}
        >
          İnder
        </button>
      )}
      <div
        style={{
          ...css,
          marginTop: inputResolution.width / 2.7,
          marginLeft: inputResolution.height / 2,
        }}
      ></div>
      {time !== 0 && <h1 style={css}>{time}</h1>}
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
