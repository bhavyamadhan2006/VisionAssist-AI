import React from 'react';

export default function DetectionResult({ result }) {
  if (!result) {
    return null;
  }

  const safetyLevel = result.safety_level || 'unknown';

  const safetyClasses = {
    safe: 'border-green-500/30 bg-green-500/10 text-green-300',
    medium: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    stop: 'border-red-500/30 bg-red-500/10 text-red-300',
    unknown: 'border-slate-700 bg-slate-800 text-slate-300',
  };

  const safetyClass =
    safetyClasses[safetyLevel] || safetyClasses.unknown;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            AI Detection Result
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Indoor scene analysis
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase ${safetyClass}`}
        >
          {safetyLevel}
        </div>
      </div>

      {result.navigation_message && (
        <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
          <div className="text-sm font-semibold text-blue-300">
            Navigation Guidance
          </div>

          <p className="mt-2 text-lg leading-7 text-white">
            {result.navigation_message}
          </p>
        </div>
      )}

      {result.scene_description && (
        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
          <div className="text-sm font-semibold text-slate-300">
            Scene Description
          </div>

          <p className="mt-2 leading-6 text-slate-200">
            {result.scene_description}
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-lg font-semibold">
          Detected Objects
        </h3>

        {Array.isArray(result.objects) && result.objects.length > 0 ? (
          <div className="space-y-3">
            {result.objects.map((object, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">

                  <span className="font-semibold capitalize">
                    {object.name || 'Unknown object'}
                  </span>

                  {object.position && (
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      Position: {object.position}
                    </span>
                  )}

                </div>

                {object.risk_level && (
                  <div className="mt-2 text-sm text-slate-400">
                    Risk level: {object.risk_level}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-400">
            No objects were detected.
          </div>
        )}
      </div>

      {result.warning && (
        <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          <strong>Warning:</strong> {result.warning}
        </div>
      )}

    </div>
  );
}