import React from "react";
import StatusIndicator from "../components/StatusIndicator";
import Camera from "../components/Camera";

export default function Dashboard() {
  return (
    <div className="vision-app">

      {/* Top Navigation */}
      <header className="topbar">
        <div className="brand-section">
          <div className="brand-icon">
            VA
          </div>

          <div>
            <h1>VisionAssist AI</h1>
            <p>Smart Indoor Navigation</p>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          <span>System Ready</span>
        </div>
      </header>


      {/* Main Content */}
      <main className="main-content">

        {/* Welcome Section */}
        <section className="welcome-section">
          <div>
            <p className="eyebrow">
              ACCESSIBILITY ASSISTANT
            </p>

            <h2>
              Navigate your surroundings
              <span> with confidence.</span>
            </h2>

            <p className="welcome-text">
              VisionAssist AI uses your camera to identify
              obstacles and provide real-time navigation
              guidance through voice assistance.
            </p>
          </div>
        </section>


        {/* Main Workspace */}
        <section className="workspace">

          {/* Camera Area */}
          <div className="camera-panel">
            <div className="panel-header">
              <div>
                <h3>Live Camera</h3>
                <p>Visual navigation feed</p>
              </div>

              <div className="live-indicator">
                <span></span>
                LIVE
              </div>
            </div>

            <div className="camera-container">
              <Camera />
            </div>
          </div>


          {/* Right Information Panel */}
          <aside className="control-panel">

            {/* Navigation Card */}
            <div className="navigation-card">
              <div className="card-heading">
                <span>Current Guidance</span>
              </div>

              <div className="guidance-status">
                <div className="guidance-icon">
                  →
                </div>

                <div>
                  <p className="guidance-label">
                    READY
                  </p>

                  <h3>
                    Start assistance
                  </h3>

                  <p>
                    Camera guidance will appear here.
                  </p>
                </div>
              </div>
            </div>


            {/* Detection Card */}
            <div className="info-card">
              <div className="card-heading">
                <span>Detected Objects</span>
                <span className="count-badge">0</span>
              </div>

              <div className="empty-detection">
                <div className="empty-icon">
                  ◉
                </div>

                <p>
                  No objects detected yet
                </p>

                <span>
                  Start assistance to begin detection.
                </span>
              </div>
            </div>


            {/* Voice Card */}
            <div className="info-card voice-card">
              <div className="card-heading">
                <span>Voice Guidance</span>

                <div className="voice-status">
                  <span className="voice-dot"></span>
                  Ready
                </div>
              </div>

              <p className="voice-description">
                Audio instructions will guide the user
                when an obstacle or important location
                is detected.
              </p>
            </div>


            {/* System Status */}
            <div className="info-card system-card">
              <div className="card-heading">
                <span>System Status</span>
              </div>

              <StatusIndicator />
            </div>

          </aside>

        </section>


        {/* Feature Cards */}
        <section className="features-section">

          <div className="feature-card">
            <div className="feature-number">
              01
            </div>

            <div>
              <h3>Object Detection</h3>
              <p>
                Identifies people, furniture,
                doors and obstacles.
              </p>
            </div>
          </div>


          <div className="feature-card">
            <div className="feature-number">
              02
            </div>

            <div>
              <h3>Smart Navigation</h3>
              <p>
                Determines whether to move
                forward, left, right or stop.
              </p>
            </div>
          </div>


          <div className="feature-card">
            <div className="feature-number">
              03
            </div>

            <div>
              <h3>Voice Assistance</h3>
              <p>
                Provides short and clear
                spoken navigation instructions.
              </p>
            </div>
          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="app-footer">
        <span>
          VisionAssist AI
        </span>

        <span>
          Smart Indoor Navigation for the Visually Impaired
        </span>
      </footer>

    </div>
  );
}