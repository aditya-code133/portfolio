import adityaPhoto from '../assets/MYphoto.jpeg';
import EngineeringTelemetry from './EngineeringTelemetry';
import Timeline from './Timeline';
import MaskedTitle from './MaskedTitle';

export default function About() {
  return (
    <div className="about-page-wrapper">
      {/* 1. Core Background & Engineering Philosophy */}
      <section id="about" className="container about-intro-section">
        <div className="about-grid">
          <div className="gsap-reveal">
            <MaskedTitle number="1." text="About Me" />
            <p className="text-gray about-text">
              I’m Aditya Swain, a 4th-year Computer Science & Engineering student. I specialize in building performant, modern web applications and have a deep interest in Data Structures & Algorithms, C, Python, and system-level performance. Driven by first-principles problem solving, I design clean component hierarchies, robust API endpoints, and scalable software solutions that operate reliably in production environments.
            </p>
            <div className="font-mono text-gray skill-list text-sm">
              <p><span style={{ color: '#fff' }}></span> Data Structures, Algorithms & Problem Solving</p>
              <p><span style={{ color: '#fff' }}></span> Full-Stack Web Development (React, Node.js, Express)</p>
              <p><span style={{ color: '#fff' }}></span> UI Layout Craft (HTML5, CSS3, Tailwind)</p>
              <p><span style={{ color: '#fff' }}></span> Cloud & Edge Deployments (Cloudflare & Vercel)</p>
            </div>
          </div>

          <div className="abstract-box hoverable gsap-reveal">
            <div className="about-photo-wrapper">
              <img
                src={adityaPhoto}
                alt="Aditya Swain - Software Developer & 4th-Year CSE Student"
                className="about-photo-img"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Real-Time Engineering Telemetry & Verified Command Channels */}
        <EngineeringTelemetry />
      </section>

      {/* 2. Interactive Evolution Roadmap */}
      <Timeline />
    </div>
  );
}
