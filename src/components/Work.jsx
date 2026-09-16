import { useAudio } from '../hooks/useAudio';
import MaskedTitle from './MaskedTitle';

const projects = [
  {
    id: '01',
    category: 'ON GOING',
    title: 'FUTURE PROJECT',
    bgClass: 'bg-1',
  },
  {
    id: '02',
    category: 'ON GOING',
    title: 'FUTURE PROJECT',
    bgClass: 'bg-2',
  },
  {
    id: '03',
    category: 'ON GOING',
    title: 'FUTURE PROJECT',
    bgClass: 'bg-3',
  },
];

export default function Work() {
  const { playHoverSound } = useAudio();

  return (
    <section id="work" className="container work-page-section">
      <div className="gsap-reveal work-header">
        <MaskedTitle number="2." text="Featured Work" />
        <div className="divider" />
      </div>

      <div className="work-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card hoverable gsap-work-card"
            onMouseEnter={playHoverSound}
          >
            <div className={`project-bg ${project.bgClass}`} />
            <div className="project-overlay" />
            <div className="project-info">
              <p className="font-mono project-category text-gray uppercase">
                {project.category}
              </p>
              <h3 className="project-title text-glow uppercase">
                {project.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
