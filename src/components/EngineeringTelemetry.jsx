import { useAudio } from '../hooks/useAudio';
import adityaPhoto from '../assets/MYphoto.jpeg';

export default function EngineeringTelemetry() {
  const { playHoverSound, playClickSound } = useAudio();

  return (
    <div className="telemetry-command-deck gsap-reveal font-mono">
      {/* Top Header Bar - Clean and Professional */}
      <div className="telemetry-header">
        <div className="telemetry-header-left">
          <span className="telemetry-live-dot" />
          <span className="telemetry-hud-tag">Current Activity & Profiles</span>
        </div>
        <span className="telemetry-hud-status">Active in 2026 • Open for Opportunities</span>
      </div>

      {/* 3-Column Profile & Activity Grid */}
      <div className="telemetry-grid">
        {/* Card 1: What I'm Working On */}
        <div className="telemetry-card hoverable">
          <div className="telemetry-card-top">
            <span className="card-badge">CURRENT FOCUS</span>
            <span className="card-indicator">Active</span>
          </div>
          <h3 className="telemetry-card-title">Full-Stack &amp; DSA Systems</h3>
          <p className="telemetry-card-text text-gray">
            Designing responsive, decoupled web applications, writing clean algorithmic solutions in C &amp; Python, and delivering production-ready web platforms.
          </p>
          <div className="telemetry-meta-row text-gray">
            <span>CORE STACK:</span>
            <span className="meta-highlight">React.js, Node.js, Python, C, Tailwind CSS, DSA</span>
          </div>
        </div>

        {/* Card 2: GitHub Projects */}
        <div className="telemetry-card hoverable">
          <div className="telemetry-card-top">
            <span className="card-badge">GITHUB CODE</span>
            <span className="card-indicator">Active Repositories</span>
          </div>
          <h3 className="telemetry-card-title">Production &amp; Core Code</h3>
          <p className="telemetry-card-text text-gray">
            Public repositories including live production e-commerce platforms, algorithmic problem-solving suites, and full-stack web applications.
          </p>
          <div className="telemetry-actions-list">
            <a
              href="https://github.com/aditya-code133"
              target="_blank"
              rel="noopener noreferrer"
              className="telemetry-btn hoverable"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>View GitHub Repositories</span>
              <span className="telemetry-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Card 3: LinkedIn Profile & Quick Contact */}
        <div className="telemetry-card telemetry-card-comms hoverable">
          <div className="telemetry-card-top">
            <span className="card-badge">PROFESSIONAL PROFILE</span>
            <span className="card-indicator">Open to Roles</span>
          </div>

          {/* Clean LinkedIn Identity Preview */}
          <div className="linkedin-profile-preview">
            <img
              src={adityaPhoto}
              alt="Aditya Swain"
              className="linkedin-preview-avatar"
            />
            <div className="linkedin-preview-info">
              <div className="linkedin-preview-name">
                <span>Aditya Swain</span>
                <span className="linkedin-check" title="Verified Profile">✓</span>
              </div>
              <div className="linkedin-preview-role text-gray">
                Software Developer • 4th-Year CSE
              </div>
            </div>
          </div>

          <p className="telemetry-card-text text-gray" style={{ marginBottom: '1rem' }}>
            Open for software engineering roles, full-stack internships, and collaborative development projects.
          </p>

          <div className="telemetry-actions-list">
            <a
              href="https://www.linkedin.com/in/aditya-swain-a179a83b3/"
              target="_blank"
              rel="noopener noreferrer"
              className="telemetry-btn hoverable"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>Connect on LinkedIn</span>
              <span className="telemetry-arrow">↗</span>
            </a>

            <a
              href="https://wa.me/918217293794?text=Hi%20Aditya,%20saw%20your%20portfolio%20and%20wanted%20to%20connect!"
              target="_blank"
              rel="noopener noreferrer"
              className="telemetry-btn telemetry-btn-ping hoverable"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              <span>Chat on WhatsApp</span>
              <span className="telemetry-arrow">💬</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
