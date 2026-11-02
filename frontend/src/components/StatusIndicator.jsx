import React, { useEffect, useState } from "react";

export default function StatusIndicator() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/health"
        );

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        const data = await response.json();

        if (data.status === "ok") {
          setStatus("connected");
        } else {
          setStatus("disconnected");
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        setStatus("disconnected");
      }
    }

    checkBackend();

    const interval = setInterval(checkBackend, 10000);

    return () => clearInterval(interval);
  }, []);

  if (status === "checking") {
    return <p>Checking Backend...</p>;
  }

  if (status === "connected") {
    return (
      <div>
        <p>
          <strong>Backend Connected</strong>
        </p>

        <p>API Status: OK</p>

        <p>Database: Connected</p>

        <p>Version: 1.0.0-phase1</p>
      </div>
    );
  }

  return (
    <div>
      <p>
        <strong>Backend Disconnected (Service Unreachable)</strong>
      </p>
    </div>
  );
}