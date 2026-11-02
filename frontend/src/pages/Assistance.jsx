import React, { useState } from 'react';
import CameraView from '../components/CameraView';
import DetectionResult from '../components/DetectionResult';
import { analyzeImage, API_BASE_URL } from '../services/api';

export default function Assistance() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
    setAnalysisResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!capturedImage) {
      setError('Please capture an image first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const result = await analyzeImage(capturedImage);
      setAnalysisResult(result);
    } catch (err) {
      setError(
        err?.message ||
          'Unable to analyze the image. Please check the backend connection.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <div className="mb-2 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
            Phase 2 Active
          </div>

          <h1 className="text-3xl font-bold">
            Indoor Assistance
          </h1>

          <p className="mt-2 text-slate-400">
            Camera and AI-powered indoor visual assistance
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-blue-400">Step 1</div>
            <div className="mt-1 font-semibold">Start Camera</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-blue-400">Step 2</div>
            <div className="mt-1 font-semibold">Capture Image</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-blue-400">Step 3</div>
            <div className="mt-1 font-semibold">Analyze with AI</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-blue-400">Step 4</div>
            <div className="mt-1 font-semibold">View Guidance</div>
          </div>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Camera
          </h2>

          <CameraView onCapture={handleCapture} />

        </div>

        {capturedImage && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Captured Image
            </h2>

            <img
              src={capturedImage}
              alt="Captured indoor scene"
              className="max-h-96 w-full rounded-xl object-contain bg-black"
            />

            <div className="mt-4 flex flex-wrap gap-3">

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </button>

              <button
                onClick={handleRetake}
                disabled={isAnalyzing}
                className="rounded-lg bg-slate-700 px-5 py-3 font-medium text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Retake Image
              </button>

            </div>

          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">

            <div className="font-semibold">
              Analysis Error
            </div>

            <div className="mt-1 text-sm">
              {error}
            </div>

          </div>
        )}

        {analysisResult && (
          <div className="mt-6">
            <DetectionResult result={analysisResult} />
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="text-sm text-slate-400">
            AI Backend
          </div>

          <div className="mt-1 break-all font-mono text-sm text-slate-300">
            {API_BASE_URL}
          </div>

        </div>

        <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">

          <h3 className="font-semibold text-yellow-300">
            Important
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            AI analysis is intended to assist with indoor visual understanding.
            AI results may not always be accurate. Do not rely on the system as
            the only source of safety information.
          </p>

        </div>

      </div>
    </div>
  );
}