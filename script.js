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
    var targets = document.querySelectorAll('.section .container, .hero > *');
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

  /* Footer year */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
