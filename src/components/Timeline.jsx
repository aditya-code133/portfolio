import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '../hooks/useAudio';
import { WebArchitectureCanvas } from './TimelineVisualizers';
import MaskedTitle from './MaskedTitle';

export default function Timeline() {
  const { playHoverSound, playClickSound } = useAudio();
  const [activeEpochIndex, setActiveEpochIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [interactionKey, setInteractionKey] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const epochs = [
    {
      epoch: '01',
      date: '2023 – PRESENT',
      stageLabel: 'STAGE 01',
      category: 'ACADEMIC & CORE',
      dockLabel: 'FOUNDATIONS',
      title: 'Computer Science & Core Foundations',
      headline: 'DSA, C, Python & Algorithmic Rigor',
      summary:
        '4th-year Computer Science & Engineering student. Focused on building strong fundamentals in Data Structures, Algorithms, C memory management, and Python scripting.',
      metrics: [
        { label: 'Degree', value: 'B.Tech CSE' },
        { label: 'Core Focus', value: 'DSA & Systems' },
        { label: 'Languages', value: 'C, Python, Java' }
      ],
      techStack: ['C', 'Python', 'Data Structures', 'Algorithms', 'OOP', 'Git'],
      Visualizer: WebArchitectureCanvas
    },
    {
      epoch: '02',
      date: '2024 – PRESENT',
      stageLabel: 'STAGE 02',
      category: 'FULL-STACK SYSTEMS',
      dockLabel: 'WEB SYSTEMS',
      title: 'Full-Stack Web Engineering & Systems',
      headline: 'Modern Architecture, APIs & Responsive Systems',
      summary:
        'Architecting robust web applications, RESTful services, and modern responsive interfaces. Focused on performance optimization, clean state management, and modern component design.',
      metrics: [
        { label: 'Architecture', value: 'Full-Stack' },
        { label: 'Methodology', value: 'Modular & Clean' },
        { label: 'Integration', value: 'REST & Cloud' }
      ],
      techStack: ['React', 'JavaScript', 'Node.js', 'Express', 'HTML5/CSS3', 'Git'],
      Visualizer: WebArchitectureCanvas
    },
    {
      epoch: '03',
      date: 'UPCOMING • IN PROGRESS',
      stageLabel: 'STAGE 03',
      category: 'FUTURE BUILD',
      dockLabel: 'FUTURE SLOT',
      title: 'Reserved for Future Project',
      headline: 'Next Engineering Project in Development',
      summary:
        'Blank slot reserved for next major engineering build, full-stack application, or software architecture project. Currently in development.',
      metrics: [
        { label: 'Status', value: 'In Development' },
        { label: 'Slot', value: 'Reserved' },
        { label: 'Phase', value: 'Architecture' }
      ],
      techStack: ['Full Stack', 'Cloud', 'Databases', 'In Progress'],
      Visualizer: WebArchitectureCanvas
    },
    {
      epoch: '04',
      date: 'UPCOMING • IN PROGRESS',
      stageLabel: 'STAGE 04',
      category: 'FUTURE BUILD',
      dockLabel: 'FUTURE SLOT',
      title: 'Reserved for Future Project',
      headline: 'Next Production Deployment',
      summary:
        'Blank slot reserved for future distributed systems or production cloud applications.',
      metrics: [
        { label: 'Status', value: 'In Progress' },
        { label: 'Slot', value: 'Reserved' },
        { label: 'Phase', value: 'Planning' }
      ],
      techStack: ['In Progress', 'Future Sprint'],
      Visualizer: WebArchitectureCanvas
    }
  ];

  const handleNext = useCallback(() => {
    playClickSound();
    setActiveEpochIndex((prev) => (prev + 1) % epochs.length);
    setInteractionKey((k) => k + 1);
  }, [epochs.length, playClickSound]);

  const handlePrev = useCallback(() => {
    playClickSound();
    setActiveEpochIndex((prev) => (prev - 1 + epochs.length) % epochs.length);
    setInteractionKey((k) => k + 1);
  }, [epochs.length, playClickSound]);

  const goToEpoch = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= epochs.length) return;
    playClickSound();
    setActiveEpochIndex(targetIndex);
    setInteractionKey((k) => k + 1);
  }, [epochs.length, playClickSound]);

  // Automatic card change effect: cycles smoothly every 4.5s, pauses when hovering or interactive
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveEpochIndex((prev) => (prev + 1) % epochs.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, interactionKey, epochs.length]);

  // Keyboard Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <section className="container timeline-section" id="experience">
      <div className="timeline-header">
        <div className="gsap-reveal">
          <MaskedTitle text="Engineering Journey" />
        </div>
        <div className="timeline-header-meta font-mono">
          <div className="timeline-meta-pill">
            <span className={`meta-pulse-dot ${isPaused ? 'is-paused' : ''}`} />
            <span className="meta-pill-text">
              STAGE 0{activeEpochIndex + 1}/04 • {isPaused ? 'INTERACTIVE' : 'AUTO-RUNNING'}
            </span>
          </div>
          <div className="timeline-jump-strip">
            {epochs.map((ep, i) => (
              <button
                key={ep.epoch}
                type="button"
                onClick={() => goToEpoch(i)}
                onMouseEnter={playHoverSound}
                className={`timeline-jump-pill hoverable ${activeEpochIndex === i ? 'is-active' : ''}`}
                aria-label={`Jump to stage 0${i + 1}`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="timeline-stage-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className="timeline-side-arrow timeline-arrow-prev hoverable font-mono"
          onClick={handlePrev}
          onMouseEnter={playHoverSound}
          aria-label="Previous phase"
          title="Previous stage"
        >
          ‹
        </button>

        <div className="timeline-carousel-shell">
          <div
            className="timeline-cards-track"
            style={{ transform: `translateX(-${activeEpochIndex * 100}%)` }}
          >
            {epochs.map((item, idx) => {
              const Visualizer = item.Visualizer;
              const isActive = activeEpochIndex === idx;

              return (
                <div
                  key={item.epoch}
                  className={`timeline-card-slide ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => { if (!isActive) playHoverSound(); }}
                >
                  <div className="timeline-stage-card hoverable">
                    <div className="timeline-narrative-pane">
                      <div className="stage-topbar font-mono">
                        <div className="stage-topbar-left">
                          <span className="stage-badge uppercase">{item.category}</span>
                          <span className="stage-date uppercase">{item.date}</span>
                        </div>
                        <span className="stage-step-tag text-gray">{item.stageLabel}</span>
                      </div>

                      <div className="stage-title-wrap">
                        <h3 className="stage-title uppercase text-glow">{item.title}</h3>
                        <div className="stage-headline font-mono text-gray uppercase">{item.headline}</div>
                      </div>

                      <p className="stage-summary text-gray">{item.summary}</p>

                      <div className="stage-metrics-grid font-mono">
                        {item.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="stage-metric-box">
                            <span className="metric-lbl text-gray">{m.label}</span>
                            <span className="metric-val">{m.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="stage-tech-pills font-mono">
                        {item.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="stage-pill">{tech}</span>
                        ))}
                      </div>
                    </div>

                    <div className="timeline-simulation-pane">
                      <div className="terminal-canvas-wrapper">
                        <Visualizer isActive={isActive} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="timeline-side-arrow timeline-arrow-next hoverable font-mono"
          onClick={handleNext}
          onMouseEnter={playHoverSound}
          aria-label="Next phase"
          title="Next stage"
        >
          ›
        </button>
      </div>
    </section>
  );
}
