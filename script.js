/* The Athletic Standard — interactions */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });

    menu.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) {
        return;
      }
      closeMenu();
      // Keep keyboard focus meaningful: the activated link becomes unfocusable
      // when the menu collapses, so move focus to the destination section.
      var hash = link.getAttribute('href');
      if (hash && hash.charAt(0) === '#') {
        var target = document.querySelector(hash);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* Scroll reveal — skipped entirely for reduced motion */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReduced.matches && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.section .container, .hero > *, .intro > *, .chapter, .book-inner',
    );
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    targets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* Header: transparent over the hero image, solid bar with logo as soon
     as the image panel scrolls out (on mobile the panel leaves well before
     the rest of the intro, and the toggle needs the dark bar behind it). */
  var header = document.querySelector('.site-header');
  var sentinel = document.querySelector('.intro-brand') || document.getElementById('top');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      },
      { rootMargin: '-60px 0px 0px 0px' },
    ).observe(sentinel);
  } else if (header) {
    header.classList.add('is-scrolled');
  }

  /* Footer year */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
