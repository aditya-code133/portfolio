import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAudio } from '../hooks/useAudio';
import { WebArchitectureCanvas } from './TimelineVisualizers';
import MaskedTitle from './MaskedTitle';

gsap.registerPlugin(ScrollTrigger);

const epochs = [
  {
    epoch: '01',
    date: '2023 – PRESENT',
    stageLabel: 'STAGE 01',
    category: 'ACADEMIC & CORE',
    title: 'Computer Science & Core Foundations',
    headline: 'DSA, C, Python & Algorithmic Rigor',
    summary:
      '4th-year Computer Science & Engineering journey at Sphitorium Engineering College. Focused on building strong fundamentals in Data Structures, Algorithms, C memory management, and Python scripting.',
    metrics: [
      { label: 'Degree', value: 'B.Tech CSE' },
      { label: 'Core Focus', value: 'DSA & Systems' },
      { label: 'Languages', value: 'C, Python, Java' },
    ],
    techStack: ['C', 'Python', 'Data Structures', 'Algorithms', 'OOP', 'Git'],
    Visualizer: WebArchitectureCanvas,
  },
  {
    epoch: '02',
    date: '2024 – PRESENT',
    stageLabel: 'STAGE 02',
    category: 'FULL-STACK SYSTEMS',
    title: 'Full-Stack Web Engineering & Systems',
    headline: 'Modern Architecture, APIs & Responsive Systems',
    summary:
      'Architecting robust web applications, RESTful services, and modern responsive interfaces. Focused on performance optimization, clean state management, and modern component design.',
    metrics: [
      { label: 'Architecture', value: 'Full-Stack' },
      { label: 'Methodology', value: 'Modular & Clean' },
      { label: 'Integration', value: 'REST & Cloud' },
    ],
    techStack: ['React', 'JavaScript', 'Node.js', 'Express', 'HTML5/CSS3', 'Git'],
    Visualizer: WebArchitectureCanvas,
  },
  {
    epoch: '03',
    date: 'UPCOMING • IN PROGRESS',
    stageLabel: 'STAGE 03',
    category: 'FUTURE BUILD',
    title: 'Reserved for Future Project',
    headline: 'Next Engineering Project in Development',
    summary:
      'Blank slot reserved for next major engineering build, full-stack application, or software architecture project. Currently in development.',
    metrics: [
      { label: 'Status', value: 'In Development' },
      { label: 'Slot', value: 'Reserved' },
      { label: 'Phase', value: 'Architecture' },
    ],
    techStack: ['Full Stack', 'Cloud', 'Databases', 'In Progress'],
    Visualizer: WebArchitectureCanvas,
  },
  {
    epoch: '04',
    date: 'UPCOMING • IN PROGRESS',
    stageLabel: 'STAGE 04',
    category: 'FUTURE BUILD',
    title: 'Reserved for Future Project',
    headline: 'Next Production Deployment',
    summary:
      'Blank slot reserved for future distributed systems or production cloud applications.',
    metrics: [
      { label: 'Status', value: 'In Progress' },
      { label: 'Slot', value: 'Reserved' },
      { label: 'Phase', value: 'Planning' },
    ],
    techStack: ['In Progress', 'Future Sprint'],
    Visualizer: WebArchitectureCanvas,
  },
];

export default function Timeline() {
  const { playClickSound } = useAudio();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const activeRef = useRef(0);
  const dotsRef = useRef([]);
  const pillRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = track.querySelectorAll('.tl-card-slide');
    const totalCards = cards.length;

    // Total horizontal distance to scroll = (n-1) card widths
    const getScrollWidth = () => track.scrollWidth - track.offsetWidth;

    // Update active dot indicator
    const setActive = (idx) => {
      activeRef.current = idx;
      dotsRef.current.forEach((el, i) => {
        if (!el) return;
        el.classList.toggle('is-active', i === idx);
      });
      if (pillRef.current) {
        pillRef.current.textContent = `STAGE 0${idx + 1}/0${totalCards}`;
      }
    };

    // Pin section and drive horizontal scroll on vertical scroll
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // Each card takes 100vh of scroll distance
          end: () => `+=${(totalCards - 1) * window.innerHeight}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Map 0→1 progress to card index
            const raw = self.progress * (totalCards - 1);
            const idx = Math.round(raw);
            if (idx !== activeRef.current) {
              setActive(idx);
            }
          },
        },
      });

      tl.to(track, {
        x: () => -getScrollWidth(),
        ease: 'none',
      });

      // Card entrance animations keyed to scroll progress
      cards.forEach((card, i) => {
        const content = card.querySelector('.tl-card-inner');
        if (!content) return;
        gsap.fromTo(
          content,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${i * window.innerHeight * 0.85} top`,
              end: () => `top+=${i * window.innerHeight * 0.85 + 200} top`,
              scrub: false,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    setActive(0);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="tl-section"
      id="experience"
    >
      {/* ── Header ── */}
      <div className="tl-header container">
        <div className="gsap-reveal">
          <MaskedTitle text="Engineering Journey" />
        </div>

        <div className="tl-header-right font-mono">
          {/* Live pill */}
          <div className="tl-meta-pill">
            <span className="meta-pulse-dot" />
            <span ref={pillRef} className="tl-pill-text">STAGE 01/04</span>
          </div>

          {/* Dot nav */}
          <div className="tl-dot-strip">
            {epochs.map((ep, i) => (
              <button
                key={ep.epoch}
                ref={(el) => (dotsRef.current[i] = el)}
                type="button"
                className="tl-dot hoverable"
                aria-label={`Stage 0${i + 1}`}
                onClick={() => {
                  playClickSound();
                  // Scroll to the appropriate position
                  const section = sectionRef.current;
                  if (!section) return;
                  const rect = section.getBoundingClientRect();
                  const top = window.scrollY + rect.top + i * window.innerHeight;
                  window.scrollTo({ top, behavior: 'smooth' });
                }}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Horizontal track ── */}
      <div className="tl-viewport">
        <div ref={trackRef} className="tl-track">
          {epochs.map((item) => {
            const Visualizer = item.Visualizer;
            return (
              <div key={item.epoch} className="tl-card-slide">
                <div className="tl-card-inner container">
                  <div className="tl-stage-card hoverable">
                    {/* Left pane */}
                    <div className="tl-narrative">
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

                    {/* Right pane */}
                    <div className="tl-visual-pane">
                      <div className="terminal-canvas-wrapper">
                        <Visualizer isActive />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="tl-scroll-hint font-mono">
        <span>scroll to explore</span>
        <span className="tl-hint-arrow">→</span>
      </div>
    </section>
  );
}
