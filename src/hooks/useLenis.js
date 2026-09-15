import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function stopLenis() {
  // Safe no-op: never lock body overflow so user can always scroll smoothly
}

export function startLenis() {
  document.body.style.overflow = '';
}

export function resetLenis() {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function useLenis() {
  useEffect(() => {
    // 100% natural, reliable native browser scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflow = '';

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
