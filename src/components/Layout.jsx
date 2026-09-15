import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import usePageTransitions from '../hooks/usePageTransitions';
import { useLenis, resetLenis } from '../hooks/useLenis';

import ThreeStarfield from './ThreeStarfield';
import ThreeBackground from './ThreeBackground';

export default function Layout({ isPreloaderDone }) {
  useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const isHeroPage = location.pathname === '/';

  const { hasNext, nextRoute, transitionTo } = usePageTransitions({ isActive: isPreloaderDone });

  // Reset scroll on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.style.overflow = '';
    }
    resetLenis();
  }, [location.pathname]);

  // Page entry animation & ScrollTrigger setup
  useEffect(() => {
    if (!isPreloaderDone) return;

    // Smooth page content entrance
    gsap.fromTo(
      '.page-transition-wrapper',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
    );

    const animFrameId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      // Hero Elements entrance
      if (isHeroPage) {
        gsap.fromTo(
          '.hero-elem',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.05 }
        );
      }

      // Smooth section reveals
      const reveals = gsap.utils.toArray('.gsap-reveal');
      reveals.forEach((elem) => {
        const words = elem.querySelectorAll('.word-inner');

        if (words.length > 0) {
          gsap.fromTo(
            words,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.04,
              ease: 'power2.out',
              clearProps: 'all',
              scrollTrigger: {
                trigger: elem,
                start: 'top 92%',
                once: true,
              },
            }
          );
        } else {
          gsap.fromTo(
            elem,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              ease: 'power2.out',
              clearProps: 'all',
              scrollTrigger: {
                trigger: elem,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }
      });

      // Work cards reveal
      if (document.querySelector('#work')) {
        gsap.fromTo(
          '.gsap-work-card',
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#work',
              start: 'top 80%',
            },
          }
        );
      }
    });

    return () => {
      cancelAnimationFrame(animFrameId);
      ScrollTrigger.getAll().forEach((t) => {
        if (
          t.vars &&
          t.vars.trigger &&
          !String(t.vars.trigger).includes('quantum') &&
          !String(t.vars.trigger).includes('timeline') &&
          !String(t.vars.trigger).includes('experience')
        ) {
          t.kill();
        }
      });
    };
  }, [location.pathname, isPreloaderDone, isHeroPage]);

  return (
    <>
      <CustomCursor />
      <ThreeStarfield isHeroPage={isHeroPage} />
      {isHeroPage && <ThreeBackground isHeroPage={isHeroPage} />}

      <Navbar isHeroPage={isHeroPage} />

      <main className="page-transition-wrapper">
        <Outlet />

        {hasNext && nextRoute && (
          <button
            type="button"
            onClick={() => (transitionTo ? transitionTo('next') : navigate(nextRoute))}
            className="scroll-hint scroll-hint-bottom font-mono text-gray hoverable"
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            Scroll down or click for next section ({nextRoute.slice(1)}) <span className="scroll-arrow">↓</span>
          </button>
        )}
      </main>
    </>
  );
}
