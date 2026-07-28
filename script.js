document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 모바일 내비게이션 ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 이번 주 입고량 차트 ---------- */
  const weekData = [
    { day: '월', count: 480 },
    { day: '화', count: 520 },
    { day: '수', count: 610 },
    { day: '목', count: 690 },
    { day: '금', count: 740 },
    { day: '토', count: 820 },
    { day: '일', count: 340 }
  ];

  const weekBars = document.getElementById('weekBars');
  const weekTotal = document.getElementById('weekTotal');
  const totalCount = weekData.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...weekData.map(d => d.count));

  weekData.forEach(d => {
    const bar = document.createElement('div');
    bar.className = 'week-bar';
    bar.dataset.height = `${(d.count / maxCount) * 100}%`;
    bar.innerHTML = `<span>${d.day}</span>`;
    weekBars.appendChild(bar);
  });

  function animateCount(el, target, duration){
    if (reduceMotion){ el.textContent = target.toLocaleString(); return; }
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const weekObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        document.querySelectorAll('.week-bar').forEach(bar => {
          bar.style.height = bar.dataset.height;
        });
        animateCount(weekTotal, totalCount, 1200);
        weekObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  weekObserver.observe(weekBars);

  /* ---------- 구독 폼 ---------- */
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeMsg = document.getElementById('subscribeMsg');
  const subscribeEmail = document.getElementById('subscribeEmail');

  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = subscribeEmail.value.trim();
    if (!email) return;

    subscribeMsg.textContent = `${email} 주소로 구독 신청이 접수되었습니다.`;
    subscribeForm.reset();
  });

});
