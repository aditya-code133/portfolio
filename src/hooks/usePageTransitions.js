import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { resetLenis } from './useLenis';

gsap.registerPlugin(Observer);

const ROUTES = ['/', '/about', '/work', '/skills', '/contact'];
const COOLDOWN_MS = 380;

export default function usePageTransitions({ isActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigating = useRef(false);
  const observerRef = useRef(null);
  const cooldownTimer = useRef(null);

  const isModalOrMenuOpen = useCallback(() => {
    return (
      document.querySelector('.mobile-nav-drawer.open') !== null
    );
  }, []);

  const transitionTo = useCallback(
    (direction) => {
      if (isNavigating.current || isModalOrMenuOpen()) return;

      const currentIndex = ROUTES.indexOf(location.pathname);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (direction === 'next' && currentIndex < ROUTES.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === 'prev' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex === -1) return;

      isNavigating.current = true;
      if (observerRef.current) {
        observerRef.current.disable();
      }

      const targetRoute = ROUTES[nextIndex];

      // Ultra-smooth GSAP section exit transition
      gsap.to('.page-transition-wrapper', {
        opacity: 0,
        y: direction === 'next' ? -20 : 20,
        duration: 0.28,
        ease: 'power2.inOut',
        onComplete: () => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) {
            document.body.scrollTop = 0;
            document.body.style.overflow = '';
          }
          resetLenis();
          navigate(targetRoute);
        },
      });
    },
    [location.pathname, navigate, isModalOrMenuOpen]
  );

  // Release navigation lock reliably after new route transition
  useEffect(() => {
    clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      isNavigating.current = false;
      if (observerRef.current) {
        observerRef.current.enable();
      }
    }, COOLDOWN_MS);

    return () => clearTimeout(cooldownTimer.current);
  }, [location.pathname]);

  // Robust, 100% reliable wheel & touch observer
  useEffect(() => {
    if (!isActive) return;

    observerRef.current = Observer.create({
      type: 'wheel,touch',
      wheelSpeed: -1,
      // Lower tolerance so every mouse wheel click or trackpad gesture registers immediately
      tolerance: 20,
      preventDefault: false,
      onUp: () => {
        // User scrolling down / intent to go to next section
        if (isNavigating.current || isModalOrMenuOpen()) return;

        const isHero = location.pathname === '/';
        if (isHero) {
          transitionTo('next');
          return;
        }

        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
        const clientHeight = window.innerHeight;

        // Generous, DPI-safe bottom threshold (handles 125%/150% Windows scaling)
        const atBottom = clientHeight + scrollY >= scrollHeight - 45;

        if (atBottom) {
          transitionTo('next');
        }
      },
      onDown: () => {
        // User scrolling up / intent to go to previous section
        if (isNavigating.current || isModalOrMenuOpen()) return;

        const isHero = location.pathname === '/';
        if (isHero) return;

        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        const atTop = scrollY <= 30;

        if (atTop) {
          transitionTo('prev');
        }
      },
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
    };
  }, [isActive, location.pathname, transitionTo, isModalOrMenuOpen]);

  const currentIndex = ROUTES.indexOf(location.pathname);
  return {
    currentIndex,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex !== -1 && currentIndex < ROUTES.length - 1,
    prevRoute: currentIndex > 0 ? ROUTES[currentIndex - 1] : null,
    nextRoute: currentIndex < ROUTES.length - 1 ? ROUTES[currentIndex + 1] : null,
    transitionTo,
  };
}
