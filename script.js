(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VIEWS = [
    'Scocles Road, type A1, plot 8',
    'Ashworth, four bedroom detached',
    'Tretower, plot 91',
    'Raemoir, plots 8 to 10'
  ];
  var HOLD_B = 2000, HOLD_A = 2700;

  var frame = document.getElementById('frame'),
      imgs = [].slice.call(frame.querySelectorAll('img')),
      view = document.getElementById('sView'),
      state = document.getElementById('sState'),
      pipBox = document.getElementById('pips'),
      i = 0, after = false, t = null, running = false;

  var pips = VIEWS.map(function (name, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', name);
    b.addEventListener('click', function () { jump(k); });
    pipBox.appendChild(b);
    return b;
  });

  function paint() {
    imgs.forEach(function (im) {
      im.classList.toggle('on', +im.dataset.i === i && im.dataset.s === (after ? 'a' : 'b'));
    });
    view.textContent = VIEWS[i];
    state.textContent = after ? 'Realified' : 'Your CGI';
    state.classList.toggle('done', after);
    pips.forEach(function (p, k) { p.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }

  function step() {
    if (after) { i = (i + 1) % VIEWS.length; after = false; } else { after = true; }
    paint();
    t = setTimeout(step, after ? HOLD_A : HOLD_B);
  }

  function jump(n) {
    clearTimeout(t);
    i = n; after = false; paint();
    if (!reduce) t = setTimeout(step, HOLD_B + 700);
  }

  function start() { if (running || reduce) return; running = true; t = setTimeout(step, HOLD_B); }
  function stop() { running = false; clearTimeout(t); }

  paint();

  if (reduce) {
    after = true; paint();
  } else {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.2 }).observe(frame);
    } else { start(); }
  }

  var sticky = document.getElementById('stickybar'),
      hero = document.getElementById('top');
  function bar() {
    sticky.classList.toggle('show', window.scrollY > hero.offsetHeight - 60);
  }
  bar();
  window.addEventListener('scroll', bar, { passive: true });

  document.querySelectorAll('.qa-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', open ? 'false' : 'true');
      q.nextElementSibling.classList.toggle('open', !open);
    });
  });
})();
