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

  if (homeHero) {
    gsap.from('.hero-top, .hero .eyebrow', { y: 18, opacity: 0, duration: .8, stagger: .12, delay: .15 });
    gsap.from('.hero h1', { y: 65, opacity: 0, duration: 1.15, ease: 'power3.out', delay: .25 });
    gsap.from('.hero-supporting-copy span, .hero-side-message span, .hero .scroll-cue', { y: 22, opacity: 0, duration: .8, stagger: .16, delay: .8, ease: 'power3.out' });
    ScrollTrigger.create({ trigger: homeHero, start: 'bottom 90%', onEnter: () => setNavigationState(true), onLeaveBack: () => setNavigationState(false) });
    gsap.to('.hero-image', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: homeHero, start: 'top top', end: 'bottom top', scrub: true } });

    // Wrap each major home panel so its content can overscroll while the panel pins and yields to the next slide.
    gsap.utils.toArray('.home-slide').forEach(panel => {
      const inner = document.createElement('div');
      inner.className = 'home-slide-inner';
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    });

    gsap.utils.toArray('.home-slide').forEach(panel => {
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
    gsap.from('.about-hero-top', { y: 18, opacity: 0, duration: .8, stagger: .12, delay: .15 });
    gsap.from('.about-hero h1', { y: 65, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .25 });
    gsap.from('.about-intro', { y: 24, opacity: 0, duration: .8, stagger: .12, delay: .72 });
    gsap.to('.about-hero-image', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: aboutHero, start: 'top top', end: 'bottom top', scrub: true } });
    document.querySelectorAll('.about-panel').forEach(section => {
      gsap.from(section.querySelectorAll('h2, h3, .eyebrow, p, .mission-list'), { y: 34, opacity: 0, duration: .75, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
    });
  }

  if (servicesHero) {
    ScrollTrigger.create({ trigger: servicesHero, start: 'bottom 90%', onEnter: () => setNavigationState(true), onLeaveBack: () => setNavigationState(false) });
    gsap.from('.services-hero-top, .services-hero .eyebrow', { y: 18, opacity: 0, duration: .8, stagger: .12, delay: .15 });
    gsap.from('.services-hero h1', { y: 65, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .25 });
    gsap.from('.services-hero-bottom, .services-hero .scroll-cue', { y: 24, opacity: 0, duration: .8, stagger: .12, delay: .72 });
    gsap.to('.services-hero-image', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: servicesHero, start: 'top top', end: 'bottom top', scrub: true } });
    document.querySelectorAll('.services-panel:not(.skill-areas)').forEach(section => {
      gsap.from(section.querySelectorAll('h2, h3, .eyebrow, p, ul, .package-meta, a, small'), { y: 32, opacity: 0, duration: .72, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 76%' } });
    });
    if (document.querySelector('.skill-area')) gsap.from('.skill-area', { opacity: 0, duration: .45, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: '.skill-areas', start: 'top 76%' } });
  }

  document.querySelectorAll('.panel:not(.final-cta):not(.about-panel):not(.services-panel)').forEach(section => {
    gsap.from(section.querySelectorAll('h2, .eyebrow, .intro-lead, .promise-list, .section-heading, .journey-heading'), { y: 38, opacity: 0, duration: .8, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
  });
  if (document.querySelector('.portrait-image')) gsap.from('.portrait-image', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: '.intro', start: 'top 65%' } });
  if (document.querySelector('.pillar-card')) gsap.from('.pillar-card', { y: 50, opacity: 0, duration: .75, stagger: .12, scrollTrigger: { trigger: '.pillar-grid', start: 'top 77%' } });
  if (document.querySelector('.marquee-track')) gsap.to('.marquee-track', { xPercent: -33.33, duration: 18, ease: 'none', repeat: -1 });
  if (document.querySelector('.step')) gsap.from('.step', { x: 45, opacity: 0, duration: .65, stagger: .13, scrollTrigger: { trigger: '.steps', start: 'top 75%' } });
  if (document.querySelector('.final-cta')) gsap.from('.final-cta > :not(.cta-orb)', { y: 30, opacity: 0, duration: .8, stagger: .1, scrollTrigger: { trigger: '.final-cta', start: 'top 68%' } });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  }));
});
