/* ============================================
   SCRIPT.JS — Morfion Materials Inc
   ============================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__nav a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Fade-up scroll animation ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Contact form submission ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.innerHTML = `
          <div style="text-align:center;padding:3rem 1rem;">
            <div style="width:60px;height:60px;border-radius:50%;background:rgba(34,197,94,.15);
                 display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#22C55E" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 style="color:#0A1628;margin-bottom:.5rem;">Message Received</h3>
            <p style="color:#6B7280;max-width:380px;margin:0 auto;">
              Thank you for reaching out. A member of our engineering team will respond within one business day.
            </p>
          </div>`;
      }, 1200);
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Stagger card animations ---- */
  document.querySelectorAll('.grid-3 .card, .grid-3 .service-card, .grid-4 .card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

  /* ---- Services Marquee ---- */
  const svcSlider = document.getElementById('svc-slider');
  if (svcSlider) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const originalItems = Array.from(svcSlider.children);

    if (!svcSlider.dataset.marqueeReady) {
      originalItems.forEach((item) => {
        svcSlider.appendChild(item.cloneNode(true));
      });
      svcSlider.dataset.marqueeReady = 'true';
    }

    let trackWidth = 0;
    const updateTrackWidth = () => {
      trackWidth = svcSlider.scrollWidth / 2;
    };

    updateTrackWidth();
    window.addEventListener('resize', updateTrackWidth);

    let rafId = null;
    let lastTime = 0;
    let scrollPos = 0;
    let isPaused = false;
    const speedPxPerMs = 0.035;

    const step = (timestamp) => {
      if (!rafId) {
        return;
      }
      if (!lastTime) {
        lastTime = timestamp;
      }
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isPaused && trackWidth > 0) {
        scrollPos += delta * speedPxPerMs;
        if (scrollPos >= trackWidth) {
          scrollPos -= trackWidth;
        }
        svcSlider.scrollLeft = scrollPos;
      }

      rafId = window.requestAnimationFrame(step);
    };

    const startMarquee = () => {
      if (rafId || prefersReducedMotion.matches) {
        return;
      }
      lastTime = 0;
      rafId = window.requestAnimationFrame(step);
    };

    const stopMarquee = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    startMarquee();

    svcSlider.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    svcSlider.addEventListener('mouseleave', () => {
      isPaused = false;
    });
    svcSlider.addEventListener('focusin', () => {
      isPaused = true;
    });
    svcSlider.addEventListener('focusout', () => {
      isPaused = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopMarquee();
      } else {
        startMarquee();
      }
    });

    if (prefersReducedMotion.addEventListener) {
      prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
          stopMarquee();
          svcSlider.scrollLeft = 0;
        } else {
          startMarquee();
        }
      });
    }
  }

})();
