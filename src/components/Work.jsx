import MaskedTitle from './MaskedTitle';

export default function Work() {
  return (
    <section id="work" className="container work-page-section">
      <div className="gsap-reveal work-header">
        <MaskedTitle number="2." text="Featured Work" />
      </div>

      <div className="work-grid">
        {/* Slot 01: Future Project Box */}
        <div className="project-card project-card-future gsap-work-card">
          <div className="future-card-content">
            <div className="future-card-badge font-mono">SLOT 01 • AVAILABLE</div>
            <div className="future-card-icon">+</div>
            <h3 className="future-card-title font-mono uppercase">Future Project</h3>
            <p className="future-card-desc text-gray">
              Reserved for upcoming full-stack web application, software engineering build, or system architecture project.
            </p>
            <span className="future-card-status font-mono">● In Planning Phase</span>
          </div>
        </div>

        {/* Slot 02: Future Project Box */}
        <div className="project-card project-card-future gsap-work-card">
          <div className="future-card-content">
            <div className="future-card-badge font-mono">SLOT 02 • AVAILABLE</div>
            <div className="future-card-icon">+</div>
            <h3 className="future-card-title font-mono uppercase">Future Project</h3>
            <p className="future-card-desc text-gray">
              Reserved for upcoming distributed systems, cloud platform, or backend API service.
            </p>
            <span className="future-card-status font-mono">● In Architecture Phase</span>
          </div>
        </div>

        {/* Slot 03: Future Project Box */}
        <div className="project-card project-card-future gsap-work-card">
          <div className="future-card-content">
            <div className="future-card-badge font-mono">SLOT 03 • AVAILABLE</div>
            <div className="future-card-icon">+</div>
            <h3 className="future-card-title font-mono uppercase">Future Project</h3>
            <p className="future-card-desc text-gray">
              Reserved for upcoming algorithmic system, AI/ML integration, or data engineering project.
            </p>
            <span className="future-card-status font-mono">● In Research Phase</span>
          </div>
        </div>
      </div>
    </section>
  );
}
