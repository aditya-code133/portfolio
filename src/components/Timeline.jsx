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
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const dotsRef = useRef([]);
  const pillRef = useRef(null);
  const activeIdxRef = useRef(0);

  const setActive = (idx) => {
    activeIdxRef.current = idx;
    dotsRef.current.forEach((el, i) => {
      if (!el) return;
      el.classList.toggle('tl-dot--active', i === idx);
    });
    if (pillRef.current) {
      pillRef.current.textContent = `STAGE 0${idx + 1}/04`;
    }
  };

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Total scroll distance = (cards - 1) widths
    const scrollDist = () => inner.scrollWidth - outer.offsetWidth;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: () => `+=${scrollDist()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.round(self.progress * (epochs.length - 1));
            if (idx !== activeIdxRef.current) setActive(idx);
          },
        },
      });

      tl.to(inner, {
        x: () => -scrollDist(),
        ease: 'none',
      });
    }, outer);

    setActive(0);
    return () => ctx.revert();
  }, []);

  return (
    /* Use a div, not section — section tag gets forced global padding */
    <div className="tl-outer" ref={outerRef} id="experience">
      {/* ─── Header ─── */}
      <div className="tl-header container">
        <div className="gsap-reveal">
          <MaskedTitle text="Engineering Journey" />
        </div>

        <div className="tl-header-right font-mono">
          <div className="tl-meta-pill">
            <span className="meta-pulse-dot" />
            <span ref={pillRef} className="tl-pill-text">STAGE 01/04</span>
          </div>

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
                  const outer = outerRef.current;
                  if (!outer) return;
                  const top = outer.getBoundingClientRect().top + window.scrollY;
                  const dist = (outerRef.current.querySelector('.tl-inner')?.scrollWidth || 0)
                    - (outerRef.current.offsetWidth || window.innerWidth);
                  const perCard = dist / (epochs.length - 1);
                  window.scrollTo({ top: top + i * perCard, behavior: 'smooth' });
                }}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Horizontal scrolling viewport ─── */}
      <div className="tl-viewport">
        <div className="tl-inner" ref={innerRef}>
          {epochs.map((item) => {
            const Visualizer = item.Visualizer;
            return (
              <div key={item.epoch} className="tl-card-wrap">
                <div className="container tl-card-container">
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

      {/* scroll hint */}
      <div className="tl-scroll-hint font-mono" aria-hidden="true">
        <span>scroll to explore</span>
        <span className="tl-hint-arrow">→</span>
      </div>
    </div>
  );
}
