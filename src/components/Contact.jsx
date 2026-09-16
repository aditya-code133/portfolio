import { useState, useRef, useMemo } from 'react';
import { useAudio } from '../hooks/useAudio';
import Footer from './Footer';
import MaskedTitle from './MaskedTitle';

export default function Contact() {
  const monolithRef = useRef(null);
  const { playHoverSound, playClickSound } = useAudio();

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderMessage: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Flight sequence state: 'idle' | 'launching' | 'sent'
  const [sendState, setSendState] = useState('idle');
  const [launchProgress, setLaunchProgress] = useState(0);

  // Calculate dynamic completion status based on filled fields
  const signalPercentage = useMemo(() => {
    let score = 0;
    if (formData.senderName.trim().length > 1) score += 35;
    if (formData.senderEmail.trim().length > 3 && formData.senderEmail.includes('@')) score += 35;
    if (formData.senderMessage.trim().length > 4) score += 30;
    return score;
  }, [formData]);

  const signalTelemetry = useMemo(() => {
    if (signalPercentage === 0) return 'Awaiting your details';
    if (signalPercentage < 70) return 'In progress';
    if (signalPercentage < 100) return 'Almost ready';
    return 'Ready to send';
  }, [signalPercentage]);

  // Dynamic starlight specular rim-glow tracking mouse coordinates
  const handleMouseMove = (e) => {
    if (!monolithRef.current) return;
    const rect = monolithRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    monolithRef.current.style.setProperty('--mouse-x', `${x}px`);
    monolithRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText('adityaswain.0106@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    playClickSound();

    const name = formData.senderName.trim();
    const email = formData.senderEmail.trim();
    const message = formData.senderMessage.trim();

    let fullText = 'Hi Aditya,';
    if (name) {
      fullText += ` I am ${name}.`;
    }
    if (email) {
      fullText += ` My email is ${email}.`;
    }
    if (message) {
      fullText += `\n\n${message}`;
    } else {
      fullText += `\n\nI visited your portfolio and wanted to connect with you!`;
    }

    const whatsappUrl = `https://wa.me/918217293794?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    playClickSound();

    if (!formData.senderName || !formData.senderMessage) {
      setStatusMsg('Please enter your name and message.');
      return;
    }

    // Begin the rocket flight and 0-100% counter sequence
    setSendState('launching');
    setLaunchProgress(0);
    setStatusMsg('');

const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_KEY || '7bf1a052-1d39-4a74-b8e7-0151db67ca1a';

    // Dispatch real email transmission via Web3Forms directly to user's Gmail
    const sendPromise = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.senderName.trim(),
        email: formData.senderEmail.trim() || 'no-reply@portfolio.dev',
        message: formData.senderMessage.trim(),
        subject: `[Portfolio Inquiry] ${formData.senderName.trim()}`,
        from_name: `${formData.senderName.trim()} (Portfolio)`,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data?.message || 'Email dispatch failed.');
        }
        return data;
      })
      .catch((err) => {
        console.error('Web3Forms email delivery error:', err);
        throw err;
      });

    const startTime = performance.now();
    const duration = 3400; // 3.4 seconds smooth, slightly slower glide

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setLaunchProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(step);
      } else {
        // Rocket has reached its destination! Verify backend dispatch result
        sendPromise
          .then(() => {
            setTimeout(() => {
              setSendState('sent');
              playClickSound();
            }, 300);
          })
          .catch((err) => {
            setTimeout(() => {
              setSendState('idle');
              setStatusMsg(err.message || 'Transmission failed. Please try again or use direct email.');
            }, 500);
          });
      }
    };

    requestAnimationFrame(step);
  };

  const handleResetForm = () => {
    playClickSound();
    setSendState('idle');
    setLaunchProgress(0);
    setFormData({ senderName: '', senderEmail: '', senderMessage: '' });
    setStatusMsg('');
  };

  return (
    <>
      <section id="contact" className="container contact-page-section">
        <div className="contact-beacon-wrapper">
          {/* Centered Header */}
          <div className="contact-header centered gsap-reveal">
            <div className="beacon-eyebrow font-mono uppercase">
              <span>Get in Touch</span>
            </div>

            <MaskedTitle text="LET'S BUILD TOGETHER" className="section-title centered uppercase text-glow" />

            <p className="contact-lead centered text-gray">
              Have a project idea, a full-stack challenge, or an engineering opportunity to discuss? Send a direct message below.
            </p>
          </div>

          {/* Centered Monolithic Glass Transponder */}
          <div
            ref={monolithRef}
            onMouseMove={handleMouseMove}
            className="cosmic-monolith-card hoverable gsap-reveal font-mono"
          >
            {/* Monolith Topbar */}
            <div className="monolith-topbar">
              <div className="beacon-status-pill">
                <span className="beacon-freq-text">
                  {sendState === 'launching' ? 'Transmitting' : sendState === 'sent' ? 'Delivered' : 'Quick Mail'}
                </span>
              </div>
              <span className="monolith-title uppercase">
                {sendState === 'launching' ? 'Signal In Flight' : sendState === 'sent' ? 'Transmission Complete' : 'Direct Message'}
              </span>
            </div>

            {/* 1. Launching Flight State: Sideways Flying Paper Rocket + Gentle Wave + 0-100% Counter */}
            {sendState === 'launching' && (
              <div className="sideways-launch-stage">
                {/* 0-100% Counter in the center above the flight path */}
                <div className="launch-counter-overlay">
                  <div className="launch-counter-value text-glow">{launchProgress}%</div>
                  <div className="launch-status-subtext font-mono text-gray">
                    {launchProgress < 30 && 'Preparing flight trajectory...'}
                    {launchProgress >= 30 && launchProgress < 75 && 'Gliding across communications channel...'}
                    {launchProgress >= 75 && launchProgress < 100 && 'Approaching destination...'}
                    {launchProgress === 100 && 'Transmission Delivered!'}
                  </div>

                  {/* Progress Line */}
                  <div className="launch-meter-track">
                    <div className="launch-meter-fill" style={{ width: `${launchProgress}%` }} />
                  </div>
                </div>

                {/* The Flight Arena: Space Rocket traversing from side to side */}
                <div className="sideways-flight-arena">
                  {/* Space Rocket riding wave up & down across the arena */}
                  <div
                    className="paper-rocket-sideways-wrap"
                    style={{
                      transform: `translate(${((launchProgress / 100) * 440) - 220}px, ${
                        Math.sin((launchProgress / 100) * Math.PI * 3) * 25
                      }px) rotate(${Math.cos((launchProgress / 100) * Math.PI * 3) * 11 - 2}deg)`
                    }}
                  >
                    <svg viewBox="0 0 100 48" fill="none" className="space-rocket-side-svg">
                      {/* Upper Stabilizer Fin */}
                      <path
                        d="M44 14 L18 4 L24 14 Z"
                        fill="rgba(255, 255, 255, 0.9)"
                        stroke="rgba(255, 255, 255, 0.95)"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />

                      {/* Lower Ventral Fin */}
                      <path
                        d="M44 34 L18 44 L24 34 Z"
                        fill="rgba(255, 255, 255, 0.9)"
                        stroke="rgba(255, 255, 255, 0.95)"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />

                      {/* Main Fuselage Body (Aerodynamic Streamlined Hull) */}
                      <path
                        d="M88 24 C72 16 50 14 26 14 L20 16 L20 32 L26 34 C50 34 72 32 88 24 Z"
                        fill="url(#sideRocketBodyGrad)"
                        stroke="rgba(255, 255, 255, 0.95)"
                        strokeWidth="1.5"
                      />

                      {/* Forward Nosecone Cap Accent */}
                      <path
                        d="M88 24 C80 20 72 19 68 19 L68 29 C72 29 80 28 88 24 Z"
                        fill="rgba(255, 255, 255, 0.98)"
                      />

                      {/* Cockpit Canopy / Observation Visor */}
                      <path
                        d="M62 18 C56 18 52 20 52 23 C52 25 56 26 62 26 C66 26 68 24 68 23 C68 20 66 18 62 18 Z"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <path
                        d="M64 19.5 C60 19.5 56 21 55 22.5 C57 21 61 20 64 20 Z"
                        fill="#ffffff"
                        opacity="0.9"
                      />

                      {/* Hull Center Panel Seam */}
                      <line x1="26" y1="24" x2="68" y2="24" stroke="rgba(148, 163, 184, 0.45)" strokeWidth="1.2" strokeLinecap="round" />

                      {/* Rear Engine Bell Nozzle */}
                      <path d="M20 18 L14 16 L14 32 L20 30 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1" strokeLinejoin="round" />

                      {/* Ion Thruster Flame (Firing Backwards to the Left) */}
                      <path
                        d="M14 18 Q-12 24 14 30 Z"
                        fill="url(#sideThrusterGrad)"
                        className="rocket-side-thruster-plume"
                      />
                      <path
                        d="M14 20 Q-2 24 14 28 Z"
                        fill="#ffffff"
                        className="rocket-side-core-flame"
                      />

                      <defs>
                        <linearGradient id="sideRocketBodyGrad" x1="20" y1="14" x2="88" y2="34" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f8fafc" />
                          <stop offset="0.6" stopColor="#e2e8f0" />
                          <stop offset="1" stopColor="#cbd5e1" />
                        </linearGradient>
                        <linearGradient id="sideThrusterGrad" x1="14" y1="24" x2="-12" y2="24" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ffffff" />
                          <stop offset="0.3" stopColor="#60a5fa" />
                          <stop offset="0.75" stopColor="#3b82f6" />
                          <stop offset="1" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Starlight Plasma Particles behind the thruster */}
                    <div className="rocket-plasma-trail">
                      <span className="plasma-dot p1" />
                      <span className="plasma-dot p2" />
                      <span className="plasma-dot p3" />
                      <span className="plasma-dot p4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Sent Confirmation State */}
            {sendState === 'sent' && (
              <div className="sent-success-stage font-mono">
                <div className="sent-success-icon-wrap">
                  <span className="sent-success-check">✓</span>
                </div>
                <h3 className="sent-success-title text-glow uppercase">Message Dispatched</h3>
                <p className="sent-success-desc text-gray">
                  Thank you, <span style={{ color: '#ffffff' }}>{formData.senderName}</span>! Your message has launched successfully. I’ll review your details and get back to you shortly.
                </p>
                <button
                  type="button"
                  className="send-another-btn hoverable font-mono uppercase"
                  onClick={handleResetForm}
                  onMouseEnter={playHoverSound}
                >
                  Send Another Message ↺
                </button>
              </div>
            )}

            {/* 3. Normal Form State */}
            {sendState === 'idle' && (
              <>
                {/* Dynamic Signal Integrity Gauge */}
                <div className="signal-meter-section">
                  <div className="signal-meter-labels">
                    <span className="signal-label text-gray">{signalTelemetry}</span>
                    <span className="signal-percentage text-glow">{signalPercentage}%</span>
                  </div>
                  <div className="signal-meter-track">
                    <div
                      className="signal-meter-fill"
                      style={{ width: `${signalPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Dispatch Form */}
                <form className="contact-form" onSubmit={handleFormSubmit}>
                  <div className="form-field">
                    <label className="field-label text-gray uppercase" htmlFor="sender-name">
                      Your Name
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      className="field-input hoverable"
                      placeholder="e.g. Alex Mercer"
                      value={formData.senderName}
                      onFocus={playHoverSound}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label text-gray uppercase" htmlFor="sender-email">
                      Your Email
                    </label>
                    <input
                      id="sender-email"
                      type="email"
                      className="field-input hoverable"
                      placeholder="alex@company.com"
                      value={formData.senderEmail}
                      onFocus={playHoverSound}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label text-gray uppercase" htmlFor="sender-message">
                      Your Message
                    </label>
                    <textarea
                      id="sender-message"
                      className="field-input field-textarea hoverable"
                      placeholder="Describe your project, timeline, or engineering goals..."
                      rows={4}
                      value={formData.senderMessage}
                      onFocus={playHoverSound}
                      onChange={(e) => setFormData({ ...formData, senderMessage: e.target.value })}
                      required
                    />
                  </div>

                  <div className="contact-actions-row">
                    <button
                      type="submit"
                      className="stellar-transmit-btn hoverable uppercase"
                      onMouseEnter={playHoverSound}
                    >
                      <span className="transmit-btn-shimmer" />
                      <span className="transmit-btn-text">Send Message ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="stellar-whatsapp-btn hoverable uppercase font-mono"
                      onMouseEnter={playHoverSound}
                      title="Send message with entered details via WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.146-.54-1.859-.77-3.056-2.673-3.149-2.798-.093-.125-.757-.999-.757-1.906s.475-1.353.645-1.538c.17-.186.371-.232.495-.232.124 0 .248 0 .356.006.114.006.267-.042.417.321.155.371.53 1.288.577 1.381.047.093.078.202.016.326-.062.124-.093.202-.186.311-.093.109-.196.243-.28.326-.093.093-.19.196-.082.381.109.186.483.797 1.036 1.289.712.634 1.312.83 1.498.923.186.093.295.078.404-.047.109-.124.466-.543.59-.73.124-.186.248-.155.417-.093.17.062 1.077.508 1.263.601.186.093.31.14.356.217.047.078.047.45-.097.855zM12.029 2C6.495 2 2 6.495 2 12.028c0 1.93.548 3.731 1.498 5.263L2 22l4.863-1.458c1.474.887 3.204 1.396 5.166 1.396 5.533 0 10.029-4.495 10.029-10.028C22.058 6.495 17.562 2 12.029 2zm0 18.232c-1.688 0-3.25-.512-4.56-1.39l-.327-.219-2.873.86.874-2.804-.239-.344c-.985-1.417-1.507-3.094-1.507-4.811 0-4.526 3.682-8.208 8.209-8.208 4.526 0 8.208 3.682 8.208 8.208 0 4.526-3.682 8.208-8.208 8.208z"/>
                      </svg>
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>

                  {statusMsg && (
                    <div className="form-status-msg text-glow font-mono">
                      {statusMsg}
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Centered Direct Comms Deck */}
          <div className="direct-comms-deck gsap-reveal font-mono">
            <div className="comms-capsule">
              <div className="comms-channel-info">
                <span className="comms-tag text-gray">My Email:</span>
                <span className="comms-email">adityaswain.0106@gmail.com</span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                onMouseEnter={playHoverSound}
                className="copy-signal-btn hoverable"
              >
                {copied ? '✓ Copied' : 'Copy Email'}
              </button>
            </div>

            <div className="orbit-availability-tag text-gray">
              <span>Available for new projects & opportunities</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
