/* AISA interactions: progressive enhancement; all content remains readable without JS. */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const homeHero = document.querySelector('.hero');
  const homeHeading = document.querySelector('#hero-heading');
  const aboutHero = document.querySelector('.about-hero');
  const servicesHero = document.querySelector('.services-hero');
  const heroLogo = document.querySelector('.hero-logo');
  const whatsappButton = document.querySelector('.whatsapp-float');
  const homeSupportingCopy = document.querySelector('.hero-bottom p');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelectorAll('.nav-links a');

  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', open);
  });
  links.forEach(link => link.addEventListener('click', () => nav.classList.remove('menu-open')));
  if (homeSupportingCopy) {
    homeSupportingCopy.className = 'hero-supporting-copy';
    homeSupportingCopy.innerHTML = '<span>The world has always had room for people who are ready for it.</span><span>AISA gives you exactly that - the skills, the confidence, the communication, and the clarity to walk into any room, any country, any opportunity, and belong there.</span>';
    homeSupportingCopy.insertAdjacentHTML('afterend', '<p class="hero-side-message"><span>The world doesn\'t grade on effort.</span><span>It rewards readiness.</span></p>');
  }
  if (homeHeading) homeHeading.innerHTML = homeHeading.innerHTML.replace('<br>Neither should you.', '<span class="hero-conclusion">Neither should you.</span>');
  const setNavigationState = visible => {
    nav?.classList.toggle('visible', visible);
    heroLogo?.classList.toggle('is-hidden', visible);
    whatsappButton?.classList.toggle('is-hidden', !visible);
  };

  if (!window.gsap) {
    setNavigationState(true);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const enableMagneticButton = zone => {
    const button = zone.querySelector('.hero-magnetic-button');
    const label = button?.querySelector('.magnetic-button-label');
    if (!button || !label || !window.matchMedia('(pointer: fine)').matches) return;
    zone.addEventListener('pointermove', event => {
      const bounds = zone.getBoundingClientRect();
      const x = (event.clientX - (bounds.left + bounds.width / 2)) * .28;
      const y = (event.clientY - (bounds.top + bounds.height / 2)) * .28;
      gsap.to(button, { x, y, duration: .4, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(label, { x: x * .55, y: y * .55, duration: .4, ease: 'power2.out', overwrite: true });
    });
    zone.addEventListener('pointerleave', () => {
      gsap.to(button, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)', overwrite: 'auto' });
      gsap.to(label, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)', overwrite: true });
    });
  };
  document.querySelectorAll('.hero-magnetic-zone, .magnetic-action-zone').forEach(enableMagneticButton);

  if (homeHero) {
    const heroImage = homeHero.querySelector('.hero-image');
    if (heroImage && window.matchMedia('(pointer: fine)').matches) {
      homeHero.addEventListener('pointermove', event => {
        const bounds = homeHero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        heroImage.style.setProperty('--hero-depth-x', `${x * -16}px`);
        heroImage.style.setProperty('--hero-depth-y', `${y * -10}px`);
      });
      homeHero.addEventListener('pointerleave', () => {
        heroImage.style.setProperty('--hero-depth-x', '0px');
        heroImage.style.setProperty('--hero-depth-y', '0px');
      });
    }
    gsap.from('.hero-top, .hero .eyebrow', { y: 18, opacity: 0, duration: .8, stagger: .12, delay: .15 });
    gsap.from('.hero h1', { y: 65, opacity: 0, duration: 1.15, ease: 'power3.out', delay: .25 });
    gsap.from('.hero-supporting-copy span, .hero-side-message span, .hero .scroll-cue', { y: 22, opacity: 0, duration: .8, stagger: .16, delay: .8, ease: 'power3.out' });
    ScrollTrigger.create({ trigger: homeHero, start: 'bottom 90%', onEnter: () => setNavigationState(true), onLeaveBack: () => setNavigationState(false) });
    gsap.to('.hero-image', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: homeHero, start: 'top top', end: 'bottom top', scrub: true } });

    // Wrap each major home panel so its content can overscroll while the panel pins and yields to the next slide.
    const homeSlides = gsap.utils.toArray('.home-slide');
    homeSlides.forEach(panel => {
      const inner = document.createElement('div');
      inner.className = 'home-slide-inner';
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    });

    const pinnedHomeSlides = homeSlides.filter(panel => panel.classList.contains('hero'));

    pinnedHomeSlides.forEach(panel => {
      const innerPanel = panel.querySelector('.home-slide-inner');
      const panelHeight = innerPanel.scrollHeight;
      const windowHeight = window.innerHeight;
      const difference = panelHeight - windowHeight;
      const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

      if (fakeScrollRatio) panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;

      const slideTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'bottom bottom',
          end: () => fakeScrollRatio ? `+=${innerPanel.offsetHeight}` : 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: true
        }
      });

      if (fakeScrollRatio) slideTimeline.to(innerPanel, { yPercent: -100, y: windowHeight, duration: 1 / (1 - fakeScrollRatio) - 1, ease: 'none' });
      slideTimeline.fromTo(panel, { scale: 1, opacity: 1 }, { scale: .7, opacity: .5, duration: .9 }).to(panel, { opacity: 0, duration: .1 });
    });
    ScrollTrigger.refresh();
  }

  if (aboutHero) {
    ScrollTrigger.create({ trigger: aboutHero, start: 'bottom 90%', onEnter: () => setNavigationState(true), onLeaveBack: () => setNavigationState(false) });
    gsap.from('.about-hero h1', { y: 65, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .25 });
    gsap.from('.about-intro', { y: 24, opacity: 0, duration: .8, stagger: .12, delay: .72 });
    const isMobileAbout = window.matchMedia('(max-width: 760px)').matches;
    gsap.set('.about-hero-image', { scale: isMobileAbout ? 1.08 : 1.18, transformOrigin: 'center center' });
    gsap.to('.about-hero-image', { yPercent: isMobileAbout ? -2 : 7, ease: 'none', scrollTrigger: { trigger: aboutHero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.timeline({
      scrollTrigger: { trigger: aboutHero, start: 'bottom bottom', end: 'bottom top', pin: true, pinSpacing: false, scrub: true }
    }).fromTo(aboutHero, { scale: 1, opacity: 1 }, { scale: .7, opacity: .5, duration: .9 })
      .to(aboutHero, { opacity: 0, duration: .1 });
    document.querySelectorAll('.about-panel').forEach(section => {
      gsap.from(section.querySelectorAll('h2, h3, .eyebrow, p, .mission-list'), { y: 34, opacity: 0, duration: .75, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
    });
  }

  if (servicesHero) {
    ScrollTrigger.create({ trigger: servicesHero, start: 'bottom 90%', onEnter: () => setNavigationState(true), onLeaveBack: () => setNavigationState(false) });
    gsap.from('.services-hero h1', { y: 65, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .25 });
    const isMobileServices = window.matchMedia('(max-width: 760px)').matches;
    if (isMobileServices) gsap.set('.services-hero-image', { scale: 1.08, transformOrigin: 'center center' });
    gsap.to('.services-hero-image', { yPercent: isMobileServices ? -2 : 10, ease: 'none', scrollTrigger: { trigger: servicesHero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.timeline({
      scrollTrigger: { trigger: servicesHero, start: 'bottom bottom', end: 'bottom top', pin: true, pinSpacing: false, scrub: true }
    }).fromTo(servicesHero, { scale: 1, opacity: 1 }, { scale: .7, opacity: .5, duration: .9 })
      .to(servicesHero, { opacity: 0, duration: .1 });
    document.querySelectorAll('.services-panel:not(.skill-areas)').forEach(section => {
      gsap.from(section.querySelectorAll('h2, h3, .eyebrow, p, ul, .package-meta, a, small'), { y: 32, opacity: 0, duration: .72, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 76%' } });
    });
    if (document.querySelector('.skill-area')) gsap.from('.skill-area', { opacity: 0, duration: .45, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: '.skill-areas', start: 'top 76%' } });
  }

  const serviceSkillAreas = [...document.querySelectorAll('.services-page .skill-area')];
  if (serviceSkillAreas.length && window.matchMedia('(min-width: 761px)').matches) {
    const activateSkillArea = activeCard => {
      serviceSkillAreas.forEach(card => {
        const active = card === activeCard;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-expanded', String(active));
      });
    };
    serviceSkillAreas.forEach(card => {
      card.addEventListener('click', () => activateSkillArea(card));
      card.addEventListener('mouseenter', () => activateSkillArea(card));
      card.addEventListener('focus', () => activateSkillArea(card));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateSkillArea(card);
        }
      });
    });
  }

  document.querySelectorAll('.panel:not(.final-cta):not(.about-panel):not(.services-panel)').forEach(section => {
    gsap.from(section.querySelectorAll('h2, .eyebrow, .intro-lead, .promise-list, .section-heading, .journey-heading'), { y: 38, opacity: 0, duration: .8, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
  });
  if (document.querySelector('.portrait-image')) gsap.from('.portrait-image', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: '.intro', start: 'top 65%' } });
  if (document.querySelector('.pillar-card')) gsap.from('.pillar-card', { opacity: 0, duration: .6, stagger: .08, scrollTrigger: { trigger: '.pillar-grid', start: 'top 77%' } });
  if (document.querySelector('.marquee-track')) gsap.to('.marquee-track', { xPercent: -33.33, duration: 18, ease: 'none', repeat: -1 });
  if (document.querySelector('.step')) gsap.from('.step', { x: 45, opacity: 0, duration: .65, stagger: .13, scrollTrigger: { trigger: '.steps', start: 'top 75%' } });
  if (document.querySelector('.final-cta')) gsap.from('.final-cta > :not(.cta-orb)', { y: 30, opacity: 0, duration: .8, stagger: .1, scrollTrigger: { trigger: '.final-cta', start: 'top 68%' } });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  }));

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const status = contactForm.querySelector('.form-status');
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const name = contactForm.elements.name.value.trim();
      status.textContent = `Thank you, ${name}. We will be in touch soon.`;
      contactForm.reset();
    });
  }
});
