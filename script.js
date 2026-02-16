/* ===================================================================
   SELVADURAI C – CINEMATIC PORTFOLIO SCRIPTS
   Typing, Particles, Counters, Parallax, Scroll Progress
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── TYPING ANIMATION ─── */
  const typedEl = document.getElementById('typed-output');
  const phrases = [
    'Digital Marketing Analyst',
    'AI & Data Science Enthusiast',
    'Python Developer',
    'Data-Driven Strategist'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typedEl.innerHTML = current.slice(0, charIdx) + '<span class="cursor"></span>';
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 55);
    } else {
      charIdx--;
      typedEl.innerHTML = current.slice(0, charIdx) + '<span class="cursor"></span>';
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 25);
    }
  }
  type();

  /* ─── SCROLL REVEAL ─── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  /* ─── ANIMATED COUNTERS ─── */
  const counters = document.querySelectorAll('.counter');
  let countersDone = false;

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !countersDone) {
        countersDone = true;
        counters.forEach(c => animateCounter(c));
        counterObs.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (counters.length) counterObs.observe(counters[0].closest('.hero-stats'));

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── PARALLAX HERO IMAGE ─── */
  const parallaxEl = document.querySelector('[data-parallax]');
  if (parallaxEl) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroH = document.getElementById('hero').offsetHeight;
      if (scrollY < heroH) {
        parallaxEl.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
    }, { passive: true });
  }

  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('active');
  }));

  /* ─── ACTIVE NAV LINK ─── */
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.25 });
  sections.forEach(s => navObs.observe(s));

  /* ─── PARTICLE CANVAS ─── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const COUNT = 60;
    const MAX_DIST = 130;

    function resize() {
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class P {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.8 + 0.5;
        this.a = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new P());

    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) { p.update(); p.draw(); }
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ─── MOUSE GLOW FOLLOW (subtle) ─── */
  document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.blob-3');
    blobs.forEach(b => {
      const speed = 0.02;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) * speed;
      const dy = (e.clientY - cy) * speed;
      b.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });

});
