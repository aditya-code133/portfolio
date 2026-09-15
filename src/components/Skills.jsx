import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../hooks/useAudio';
import MaskedTitle from './MaskedTitle';

const categories = [
  {
    id: '01',
    tag: 'CORE UI ENGINEERING',
    title: 'Frontend & UI Craft',
    summary: 'Responsive layouts, component structure, clean styling, and high-fidelity user experiences.',
    telemetry: '90% Proficiency • Responsive UI',
    skills: ['HTML5', 'CSS3 Layouts', 'Tailwind CSS', 'Responsive UI', 'JavaScript (ES6+)', 'React.js'],
  },
  {
    id: '02',
    tag: 'ALGORITHMS & OPTIMIZATION',
    title: 'Data Structures & Algorithms',
    summary: 'Rigorous algorithmic thinking, Big-O optimization, dynamic memory management, and problem solving.',
    telemetry: 'DSA Core • C & Python',
    skills: ['Data Structures', 'C Programming', 'Python', 'Algorithm Design', 'Time Complexity', 'Pointers & Memory'],
  },
  {
    id: '03',
    tag: 'BACKEND & ARCHITECTURE',
    title: 'System Design & Data Flows',
    summary: 'Decoupled presentation layers, client-server models, RESTful contracts, and WebSocket protocols.',
    telemetry: 'Decoupled Edge • Sub-85ms TTFB',
    skills: ['Decoupled Architecture', 'System Design', 'RESTful APIs', 'WebSocket Flows', 'Data Contracts', 'Authentication PKCE'],
  },
  {
    id: '04',
    tag: 'EDGE & CLOUD RUNTIMES',
    title: 'Cloud & Edge Deployments',
    summary: 'Edge-distributed static hosting, continuous deployment, serverless edge workers, and DNS routing.',
    telemetry: 'Cloudflare Pages • Vercel • Git',
    skills: ['Cloudflare Pages', 'GitHub Pages', 'Vercel', 'Git CLI', 'GitHub', 'CI/CD Deployments'],
  },
  {
    id: '05',
    tag: 'FULL STACK DEVELOPMENT',
    title: 'Full-Stack Frameworks',
    summary: 'Scalable web applications architected with modern full-stack workflows and database management.',
    telemetry: 'Production Ready • Full Stack',
    skills: ['Node.js', 'Express.js', 'React.js', 'Socket.io', 'MongoDB Atlas', 'PostgreSQL / MySQL'],
  },
  {
    id: '06',
    tag: 'COMPUTER SCIENCE CORE',
    title: 'Engineering Foundations',
    summary: 'Foundational computer science principles, OOP concepts, database systems, and OS fundamentals.',
    telemetry: 'OOP • OS • DBMS',
    skills: ['Object-Oriented Programming', 'Database Systems (DBMS)', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
  },
];

export default function Skills() {
  const { playHoverSound, playClickSound } = useAudio();
  const cylinderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const lastActiveRef = useRef(0);

  const totalCards = categories.length;
  const angleStep = 360 / totalCards; // 60 deg

  // 120 FPS Pure Hardware-Composited Rotation Loop (Zero React State Thrashing)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isPausedRef.current && !isDraggingRef.current) {
        // Smooth continuous 120 FPS glide (~14 deg/second)
        targetAngleRef.current += delta * 14;
      }

      // Smooth damped lerp towards target angle
      angleRef.current += (targetAngleRef.current - angleRef.current) * 0.12;

      // Update the 3D cylinder transform directly on the GPU compositor
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `rotateY(${-angleRef.current}deg)`;
      }

      // Calculate which card is facing the front
      const normalizedAngle = ((angleRef.current % 360) + 360) % 360;
      const frontCardIndex = Math.round(normalizedAngle / angleStep) % totalCards;

      if (frontCardIndex !== lastActiveRef.current) {
        lastActiveRef.current = frontCardIndex;
        setActiveIndex(frontCardIndex);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [angleStep, totalCards]);

  // Jump to specific card
  const rotateToCard = useCallback(
    (index) => {
      playClickSound();
      targetAngleRef.current = index * angleStep;
      setActiveIndex(index);
    },
    [angleStep, playClickSound]
  );

  // Drag controls
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    startAngleRef.current = targetAngleRef.current;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = clientX - startXRef.current;
    targetAngleRef.current = startAngleRef.current - deltaX * 0.28;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section id="skills" className="skills-page-section">
      {/* Header & Quick Jump Controls */}
      <div className="container gsap-reveal skills-header">
        <div className="skills-header-row">
          <MaskedTitle number="3." text="Core Capabilities" />

          {/* Quick Jump Category Pills */}
          <div className="skills-jump-bar font-mono">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                className={`skills-jump-pill hoverable ${activeIndex === idx ? 'is-active' : ''}`}
                onClick={() => rotateToCard(idx)}
                onMouseEnter={playHoverSound}
                aria-label={`Go to ${cat.title}`}
              >
                {cat.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 360-Degree Hardware-Accelerated Cylindrical Viewport */}
      <div
        className="skills-orbital-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
        role="region"
        aria-label="360 Degree Skills Carousel"
      >
        {/* Ambient Ring Accents */}
        <div className="orbital-ambient-halo" />
        <div className="orbital-core-ring ring-top" />
        <div className="orbital-core-ring ring-mid" />

        {/* 3D Hardware-Rotated Cylinder Stage */}
        <div className="skills-cylinder-stage" ref={cylinderRef}>
          {categories.map((cat, index) => {
            const isFront = index === activeIndex;

            return (
              <div
                key={cat.id}
                className={`skill-orbital-card hoverable ${isFront ? 'active-front' : ''}`}
                style={{
                  '--card-index': index,
                }}
                onClick={() => rotateToCard(index)}
              >
                <div className="orbital-card-inner">
                  {/* Top Bar: Code Index & Tag */}
                  <div className="orbital-card-top font-mono">
                    <span className="skill-id-badge">{cat.id}</span>
                    <span className="skill-tag uppercase">{cat.tag}</span>
                  </div>

                  {/* Title & Core Summary */}
                  <h3 className="skill-card-title uppercase text-glow">{cat.title}</h3>
                  <p className="skill-card-summary text-gray">{cat.summary}</p>

                  {/* Live Running Telemetry Meter */}
                  <div className="orbital-telemetry-badge font-mono">
                    <span className="telemetry-icon">⚡</span>
                    <span className="telemetry-text">{cat.telemetry}</span>
                  </div>

                  {/* Skill Chips List */}
                  <ul className="skill-list font-mono">
                    {cat.skills.map((s) => (
                      <li key={s} className="skill-pill">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floor Scanner Glow */}
        <div className="orbital-floor-grid" />
      </div>
    </section>
  );
}
