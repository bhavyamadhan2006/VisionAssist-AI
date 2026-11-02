import React, { useEffect, useRef, useState } from 'react';

export default function CameraView({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');

  const startCamera = async () => {
    setError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported by this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setIsPreview(false);
      setPreviewImage(null);
    } catch (err) {
      console.error('Camera error:', err);

      if (err?.name === 'NotAllowedError') {
        setError(
          'Camera permission was denied. Please allow camera access and try again.'
        );
      } else if (err?.name === 'NotFoundError') {
        setError('No camera was found on this device.');
      } else if (err?.name === 'NotReadableError') {
        setError('The camera is already being used by another application.');
      } else {
        setError('Unable to access the camera. Please try again.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera is not ready for capture.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera image is not ready yet. Please wait a moment.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    setPreviewImage(imageData);
    setIsPreview(true);
    setError('');

    if (onCapture) {
      onCapture(imageData);
    }
  };

  const retakeImage = () => {
    setPreviewImage(null);
    setIsPreview(false);
    setError('');
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-4">

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black">

        {!isPreview ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="aspect-video w-full object-cover"
          />
        ) : (
          <img
            src={previewImage}
            alt="Captured indoor scene"
            className="aspect-video w-full object-contain bg-black"
          />
        )}

      </div>

      <div className="flex flex-wrap gap-3">

        {!isCameraActive && !isPreview && (
          <button
            type="button"
            onClick={startCamera}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start Camera
          </button>
        )}

        {isCameraActive && !isPreview && (
          <>
            <button
              id="btn-capture-frame"
              type="button"
              onClick={captureFrame}
              className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
            >
              Capture Image
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
            >
              Stop Camera
            </button>
          </>
        )}

        {isPreview && (
          <button
            type="button"
            onClick={retakeImage}
            className="rounded-lg bg-slate-700 px-5 py-3 font-medium text-white hover:bg-slate-600"
          >
            Retake Image
          </button>
        )}

      </div>

      <div className="text-sm text-slate-400">
        {isPreview
          ? 'Image captured successfully. You can analyze this image below.'
          : isCameraActive
          ? 'Camera is active. Position the indoor scene and capture an image.'
          : 'Start the camera to begin indoor visual assistance.'}
      </div>

    </div>
  );
}