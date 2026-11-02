import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Assistance from './pages/Assistance';
import { getBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('assistance');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        await getBackendHealth();

        if (mounted) {
          setBackendStatus('connected');
        }
      } catch {
        if (mounted) {
          setBackendStatus('disconnected');
        }
      }
    };

    checkBackend();

    const interval = setInterval(checkBackend, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <div>
            <h1 className="text-xl font-bold">
              VisionAssist AI
            </h1>

            <p className="text-sm text-slate-400">
              Smart Indoor Navigation System
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-sm">
              {backendStatus === 'connected'
                ? 'Backend Connected'
                : backendStatus === 'disconnected'
                ? 'Backend Disconnected'
                : 'Checking Backend...'}
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => setActiveTab('assistance')}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  activeTab === 'assistance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Indoor Assistance
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Dashboard
              </button>

            </div>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'assistance' ? (
          <Assistance />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}