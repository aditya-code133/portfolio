import { useEffect, useRef } from 'react';

// ============================================================================
// STAGE 01: Web Foundations & Full-Stack Systems Architecture
// Interactive Live Canvas Simulation for Engineering Journey
// ============================================================================
export function WebArchitectureCanvas({ isActive = true }) {
  const canvasRef = useRef(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width = parent?.clientWidth || 380;
    let height = parent?.clientHeight || 280;

    const resize = () => {
      if (!canvas || !parent) return;
      width = parent.clientWidth || 380;
      height = parent.clientHeight || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // DOM & Systems Tree Nodes
    const domNodes = [
      { id: 'client', label: '<REACT.CLIENT>', x: 0.5, y: 0.18, children: ['api'] },
      { id: 'api', label: '<EXPRESS.API>', x: 0.5, y: 0.44, children: ['db', 'cloud', 'cache'] },
      { id: 'db', label: '<DATABASE>', x: 0.22, y: 0.72, children: [] },
      { id: 'cloud', label: '<CLOUDFLARE>', x: 0.5, y: 0.72, children: [] },
      { id: 'cache', label: '<SYSTEM.CACHE>', x: 0.78, y: 0.72, children: [] }
    ];

    const systemLogs = [
      'STATUS 200 OK • GET /api/telemetry',
      'ASYNC EVENT • Buffer Synchronized',
      'LATENCY 12ms • Edge Pipeline Active',
      'HEAP ALLOCATION • Stable 0 Memory Leak',
      'SYSTEM HEALTH • 100% Verified'
    ];

    let frame = 0;

    const render = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Tree Connections
      domNodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        node.children.forEach((childId) => {
          const target = domNodes.find((n) => n.id === childId);
          if (target) {
            const tx = target.x * width;
            const ty = target.y * height;
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = 'rgba(100, 255, 218, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Animated packet traversing the connection
            const t = ((frame * 0.015) % 1);
            const px = nx + (tx - nx) * t;
            const py = ny + (ty - ny) * t;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#64ffda';
            ctx.shadowColor = '#64ffda';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Render System Nodes
      domNodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        ctx.fillStyle = 'rgba(10, 10, 18, 0.95)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        const padX = 32;
        const padY = 11;
        ctx.strokeRect(nx - padX, ny - padY, padX * 2, padY * 2);
        ctx.fillRect(nx - padX, ny - padY, padX * 2, padY * 2);

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, nx, ny);
      });

      // Render Live Telemetry Console Log at Bottom
      const activeLogIndex = Math.floor(frame / 60) % systemLogs.length;
      ctx.fillStyle = 'rgba(100, 255, 218, 0.9)';
      ctx.font = '9.5px "Space Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`> ${systemLogs[activeLogIndex]}`, 16, height - 14);

      if (isActiveRef.current) frame++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
