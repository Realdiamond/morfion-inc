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
    const statusEl = document.getElementById('contact-form-status');
    const endpoint = contactForm.dataset.formspreeEndpoint;

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const getSelectedLabel = (fieldId) => {
        const select = document.getElementById(fieldId);
        if (!select || select.selectedIndex < 0) return '';
        return select.options[select.selectedIndex]?.text || '';
      };

      if (statusEl) {
        statusEl.style.display = 'none';
        statusEl.textContent = '';
      }

      if (!endpoint) {
        if (statusEl) {
          statusEl.textContent = 'Form is not configured yet. Please add your Formspree endpoint.';
          statusEl.style.color = '#b91c1c';
          statusEl.style.display = 'block';
        }
        btn.textContent = 'Send Message';
        btn.disabled = false;
        return;
      }

      const payload = {
        _subject: `Contact Inquiry: ${getSelectedLabel('service') || 'General Consultation'}`,
        name: `${formData.get('first_name') || ''} ${formData.get('last_name') || ''}`.trim() || 'Website Contact',
        _replyto: formData.get('email') || '',
        first_name: formData.get('first_name') || '',
        last_name: formData.get('last_name') || '',
        email: formData.get('email') || '',
        company: formData.get('company') || '',
        phone: formData.get('phone') || '',
        service: getSelectedLabel('service') || '',
        industry: getSelectedLabel('industry') || '',
        message: formData.get('message') || ''
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || (typeof result.ok !== 'undefined' && !result.ok)) {
          throw new Error(result.error || result.errors?.[0]?.message || 'Unable to send message right now.');
        }

        contactForm.reset();
        if (statusEl) {
          statusEl.textContent = 'Thanks! Your inquiry was sent successfully.';
          statusEl.style.color = '#166534';
          statusEl.style.display = 'block';
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = error.message || 'Something went wrong. Please try again.';
          statusEl.style.color = '#b91c1c';
          statusEl.style.display = 'block';
        }
      } finally {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }
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
