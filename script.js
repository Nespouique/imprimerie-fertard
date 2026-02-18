/* ==========================================================================
   Imprimerie Fertard — Script
   Scroll reveals, parallax, form logic, navigation, tabs
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Hero load animation ---------- */
  window.addEventListener('load', function () {
    document.querySelector('.hero').classList.add('hero--loaded');
  });

  /* ---------- Navigation: scroll state ---------- */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('nav__links--open');
    navToggle.classList.toggle('nav__toggle--open', isOpen);
    nav.classList.toggle('nav--menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('nav__toggle--open');
      navLinks.classList.remove('nav__links--open');
      nav.classList.remove('nav--menu-open');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* ---------- Parallax on hero background ---------- */
  var heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'scale(1.1) translateY(' + (scrolled * 0.15) + 'px)';
      }
    }, { passive: true });
  }

  /* ---------- Product tabs ---------- */
  var tabs = document.querySelectorAll('.produits__tab');
  var panels = document.querySelectorAll('.produits__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        t.classList.remove('produits__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('produits__panel--active'); });

      tab.classList.add('produits__tab--active');
      tab.setAttribute('aria-selected', 'true');
      var activePanel = document.getElementById('panel-' + target);
      if (activePanel) {
        activePanel.classList.add('produits__panel--active');

        // Re-trigger reveal animation
        activePanel.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.remove('reveal--visible');
          void el.offsetWidth;
          el.classList.add('reveal--visible');
        });
      }
    });
  });

  /* ---------- Form: product checkbox → quantity toggle ---------- */
  document.querySelectorAll('.form-product').forEach(function (product) {
    var checkbox = product.querySelector('input[type="checkbox"]');
    var qtyInput = product.querySelector('.form-product__qty');

    if (checkbox && qtyInput) {
      checkbox.addEventListener('change', function () {
        qtyInput.disabled = !checkbox.checked;
        if (checkbox.checked) {
          qtyInput.focus();
        } else {
          qtyInput.value = '';
        }
      });

      // Prevent label click from toggling checkbox when clicking qty
      qtyInput.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  var SCROLL_OFFSET = 62;

  function smoothScrollTo(targetEl) {
    var top = targetEl.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top: top, behavior: 'smooth' });

    // Correct position after scroll settles (lazy images may shift layout)
    var scrollTimer;
    function onScrollEnd() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        window.removeEventListener('scroll', onScrollEnd);
        var corrected = targetEl.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
        if (Math.abs(corrected - window.pageYOffset) > 3) {
          window.scrollTo({ top: corrected, behavior: 'auto' });
        }
      }, 100);
    }
    window.addEventListener('scroll', onScrollEnd);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(targetEl);
      }
    });
  });

  /* ---------- Modal: Journal Clins d'Oeil ---------- */
  var modal = document.getElementById('modalJournal');
  var openBtn = document.getElementById('openJournal');
  var closeBtn = document.getElementById('closeJournal');
  var backdrop = document.getElementById('modalBackdrop');
  var journalToDevis = document.getElementById('journalToDevis');
  var previouslyFocused = null;

  function trapFocus(e) {
    var focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function openModal() {
    previouslyFocused = document.activeElement;
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    if (previouslyFocused) previouslyFocused.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // "Demander un devis" inside modal → close modal then scroll
  if (journalToDevis) {
    journalToDevis.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
      setTimeout(function () {
        var target = document.querySelector('#devis');
        if (target) {
          smoothScrollTo(target);
        }
      }, 300);
    });
  }

  /* ---------- Parallax on about section photos ---------- */
  var aproposPhotos = document.querySelectorAll('.apropos__photo');
  if (aproposPhotos.length > 0) {
    window.addEventListener('scroll', function () {
      var section = document.querySelector('.apropos');
      if (!section) return;
      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight;

      if (rect.top < viewH && rect.bottom > 0) {
        var progress = (viewH - rect.top) / (viewH + rect.height);
        aproposPhotos.forEach(function (photo, i) {
          var offset = (progress - 0.5) * (12 + i * 8);
          photo.style.transform = 'translateY(' + offset + 'px)';
        });
      }
    }, { passive: true });
  }

  /* ---------- Form submit with Formspree ---------- */
  var devisForm = document.querySelector('.devis__form');
  if (devisForm) {
    devisForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = devisForm.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      fetch(devisForm.action, {
        method: 'POST',
        body: new FormData(devisForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          showToast(true, 'Demande envoyée !', 'Nous vous contacterons dans les meilleurs délais.');
          devisForm.reset();
          // Re-disable all qty fields after reset
          devisForm.querySelectorAll('.form-product__qty').forEach(function (q) { q.disabled = true; });
        } else {
          showToast(false, 'Erreur', 'Un problème est survenu. Réessayez ou contactez-nous par téléphone.');
        }
      }).catch(function () {
        showToast(false, 'Erreur', 'Impossible d\u2019envoyer. Vérifiez votre connexion internet.');
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }

  function showToast(success, title, message) {
    var existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    var icon = success
      ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
      : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';

    var notif = document.createElement('div');
    notif.className = 'form-notification';
    notif.innerHTML = '<div class="form-notification__inner">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + icon + '</svg>' +
      '<div><strong>' + title + '</strong><p>' + message + '</p></div>' +
      '<button class="form-notification__close" aria-label="Fermer">&times;</button>' +
      '</div>';

    document.body.appendChild(notif);

    requestAnimationFrame(function () {
      notif.classList.add('form-notification--visible');
    });

    notif.querySelector('.form-notification__close').addEventListener('click', function () {
      notif.classList.remove('form-notification--visible');
      setTimeout(function () { notif.remove(); }, 400);
    });

    setTimeout(function () {
      if (notif.parentNode) {
        notif.classList.remove('form-notification--visible');
        setTimeout(function () { if (notif.parentNode) notif.remove(); }, 400);
      }
    }, 6000);
  }

})();
