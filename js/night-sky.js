(function () {
  const CANVAS_ID = 'night-sky-canvas';
  const STAR_COUNT_BASE = 60;
  const STAR_COUNT_FACTOR = 0.000025; // scale with screen area
  const STAR_MIN_SIZE = 0.35;
  const STAR_MAX_SIZE = 1.9;
  const STAR_MIN_SPEED = 0.008;
  const STAR_MAX_SPEED = 0.05;

  function createCanvas() {
    let canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = CANVAS_ID;
      document.body.prepend(canvas);
    }
    return canvas;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function buildStars(width, height) {
    const count = Math.floor(STAR_COUNT_BASE + width * height * STAR_COUNT_FACTOR);
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rand(STAR_MIN_SIZE, STAR_MAX_SIZE),
        alpha: rand(0.18, 0.62),
        twinkle: rand(0.002, 0.02),
        speed: rand(STAR_MIN_SPEED, STAR_MAX_SPEED)
      });
    }
    return stars;
  }

  function initSky() {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    let stars = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = buildStars(width, height);
    }

    function drawBackgroundGradient() {
      const gradient = ctx.createRadialGradient(
        width * 0.55,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, '#07111f');
      gradient.addColorStop(0.45, '#030814');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function animate() {
      drawBackgroundGradient();

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.y += s.speed;
        s.alpha += (Math.random() - 0.5) * s.twinkle;

        if (s.alpha < 0.2) s.alpha = 0.2;
        if (s.alpha > 1) s.alpha = 1;
        if (s.y > height + 2) {
          s.y = -2;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${s.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSky);
  } else {
    initSky();
  }
})();
