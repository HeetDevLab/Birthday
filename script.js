(() => {
  const body = document.body;
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const scrim = document.getElementById('navScrim');
  const progress = document.getElementById('readingProgress');
  const setMenu = (open) => {
    if (!toggle || !mobileNav || !scrim) return;
    body.classList.toggle('menu-open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.setAttribute('aria-hidden', String(!open));
  };

  toggle?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  scrim?.addEventListener('click', () => setMenu(false));
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false); }, { passive: true });

  const updateProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach(item => revealObserver.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const portrait = document.querySelector('.portrait-image-wrap img');
  const showPortraitFallback = () => portrait?.closest('.portrait-image-wrap')?.classList.add('image-missing');
  portrait?.addEventListener('error', showPortraitFallback, { once: true });
  if (portrait && portrait.complete && portrait.naturalWidth === 0) showPortraitFallback();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
