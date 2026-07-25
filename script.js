/* ================================================================
   AISA – Aspirer International Skill Academy
   JavaScript – Scrollytelling, Navigation, Interactions
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ======================== MOBILE NAVIGATION ========================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const siteHeader = document.getElementById('siteHeader');

  // Create overlay element for mobile nav
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  function toggleNav() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleNav);
  overlay.addEventListener('click', toggleNav);

  // Close nav on link click
  document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleNav();
      }
    });
  });

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    siteHeader.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }, { passive: true });


  // ======================== ACTIVE NAV LINK TRACKING ========================
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  // ======================== SCROLLTELLING – INTERSECTION OBSERVER ========================
  const scrollSteps = document.querySelectorAll('.scroll-step');
  const pillarVisuals = document.querySelectorAll('.pillar-visual');
  const progressBar = document.getElementById('scrollProgressBar');
  const totalSteps = scrollSteps.length;

  // Observer for scroll steps
  const stepObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.1
  };

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepIndex = parseInt(entry.target.getAttribute('data-step'));

        // Update active step
        scrollSteps.forEach(step => step.classList.remove('active'));
        entry.target.classList.add('active');

        // Update visual panel
        pillarVisuals.forEach(visual => visual.classList.remove('active'));
        if (pillarVisuals[stepIndex]) {
          pillarVisuals[stepIndex].classList.add('active');
        }

        // Update progress bar
        const progress = ((stepIndex + 1) / totalSteps) * 100;
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      }
    });
  }, stepObserverOptions);

  scrollSteps.forEach(step => stepObserver.observe(step));


  // ======================== HERO STATS COUNTER ANIMATION ========================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        stat.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe hero stats
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  // ======================== TESTIMONIAL SLIDER ========================
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = document.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let currentSlide = 0;
  let autoSlideInterval;

  // Create dots
  if (dotsContainer) {
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalCards);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + totalCards) % totalCards);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

  // Auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  // Touch/swipe support for slider
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoSlide();
      }
    }, { passive: true });
  }


  // ======================== SCROLL REVEAL ANIMATIONS ========================
  const revealElements = document.querySelectorAll(
    '.about-grid, .program-card, .feature-item, .info-card, .section-header, .cta-content'
  );

  revealElements.forEach(el => el.classList.add('fade-in-up'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ======================== CONTACT FORM ========================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const phone = formData.get('phone');

      // Basic validation
      let isValid = true;

      [firstName, lastName, email, phone].forEach(value => {
        if (!value || !value.trim()) {
          isValid = false;
        }
      });

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isValid = false;
      }

      if (!isValid) {
        // Shake animation for invalid form
        contactForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => { contactForm.style.animation = ''; }, 500);
        return;
      }

      // Show success state
      contactForm.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon">✅</div>
          <h3>Thank You, ${firstName}!</h3>
          <p>Your message has been received. Our team will reach out to you within 24 hours to discuss your global readiness journey.</p>
        </div>
      `;
    });
  }


  // ======================== SMOOTH SCROLL FOR ANCHOR LINKS ========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
