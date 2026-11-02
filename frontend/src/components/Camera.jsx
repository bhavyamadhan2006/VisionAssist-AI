import React, { useEffect, useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);

      setCameraActive(false);

      setCameraError(
        "Camera access was not available. Please allow camera permission and try again."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setCameraActive(false);
  }

  return (
    <div className="camera-module">

      {/* Camera View */}
      <div className="camera-view">

        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
        ) : (
          <div className="camera-placeholder">
            <div className="camera-placeholder-icon">
              ◉
            </div>

            <h3>
              Camera unavailable
            </h3>

            <p>
              {cameraError ||
                "Waiting for camera access..."}
            </p>

            <button
              type="button"
              onClick={startCamera}
              className="camera-retry-button"
            >
              Enable Camera
            </button>
          </div>
        )}

        {/* Camera Overlay */}
        {cameraActive && (
          <>
            <div className="camera-overlay-top">
              <span className="camera-live-badge">
                <span></span>
                LIVE
              </span>

              <span className="camera-mode">
                NAVIGATION MODE
              </span>
            </div>

            <div className="camera-overlay-bottom">
              <div>
                <span className="camera-overlay-label">
                  VISION FEED
                </span>

                <strong>
                  Camera active
                </strong>
              </div>

              <div className="camera-status-indicator">
                <span></span>
                Ready
              </div>
            </div>
          </>
        )}
      </div>


      {/* Camera Controls */}
      <div className="camera-controls">

        <div className="camera-control-info">
          <span className="control-title">
            Navigation Camera
          </span>

          <span className="control-description">
            Continuous visual assistance
          </span>
        </div>

        <div className="camera-control-actions">

          {cameraActive ? (
            <button
              type="button"
              className="secondary-camera-button"
              onClick={stopCamera}
            >
              Stop Camera
            </button>
          ) : (
            <button
              type="button"
              className="primary-camera-button"
              onClick={startCamera}
            >
              Start Camera
            </button>
          )}

        </div>

      </div>

    </div>
  );
}