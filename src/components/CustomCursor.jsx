import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Skip on touch devices without a mouse pointer
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    cursor.style.transform = 'translate3d(-100px, -100px, 0) translate(-50%, -50%)';
    cursor.style.opacity = '0';

    let targetX = -100;
    let targetY = -100;
    let isVisible = false;
    let rafId = null;

    const render = () => {
      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      rafId = null;
    };

    // Instant zero-lag 120 FPS hardware-synced mouse tracking
    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        cursor.style.opacity = '1';
        isVisible = true;
      }

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    // Fast delegation for interactive hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.classList.contains('hoverable') ||
          target.closest('.hoverable') ||
          target.closest('a') ||
          target.closest('button'))
      ) {
        cursor.classList.add('hovered');
      } else {
        cursor.classList.remove('hovered');
      }
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      isVisible = false;
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
      isVisible = true;
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return <div id="cursor" ref={cursorRef} />;
}
