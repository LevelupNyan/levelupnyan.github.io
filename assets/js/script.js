;document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("menuBtn");
  const navOverlay = document.getElementById("navOverlay");

  if (menuBtn && navOverlay) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navOverlay.classList.toggle("open");
    });
  }

  const target = document.getElementById("typewriter-text");
  const phrases = ["Website Blocked", "Access Denied", "Site Restricted"];

  let pIdx = 0;
  let cIdx = 0;
  let isDel = false;

  function type() {
    if (!target) return;

    const current = phrases[pIdx];
    target.textContent = current.substring(0, cIdx);

    cIdx += isDel ? -1 : 1;

    let speed = isDel ? 60 : 120;

    if (!isDel && cIdx > current.length) {
      isDel = true;
      speed = 2500;
    } else if (isDel && cIdx < 0) {
      isDel = false;
      pIdx = (pIdx + 1) % phrases.length;
      cIdx = 0;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));

  const canvas = document.getElementById("background");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let particles = [];
  const shapes = ["square", "circle", "x", "triangle"];
  const colors = ["#00ff00", "#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#0099ff"];
  const particleCount = 24;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor(isInitialSpread = false) {
      this.init(isInitialSpread);
    }

    init(isInitialSpread = false) {
      this.x = Math.random() * canvas.width;

      if (isInitialSpread) {
        this.y = Math.random() * canvas.height;
      } else {
        this.y = canvas.height + 50 + Math.random() * 600;
      }

      this.size = Math.random() * 8 + 16;
      this.speed = Math.random() * 1.5 + 0.8;

      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.opacity = 1;
    }

    update() {
      this.y -= this.speed;
      this.angle += this.rotationSpeed;

      if (this.y < 150) {
        this.opacity = Math.max(0, this.y / 150);
      } else {
        this.opacity = 1;
      }

      if (this.y < -50 || this.opacity <= 0) {
        this.init(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      ctx.beginPath();

      if (this.shape === "square") {
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else if (this.shape === "circle") {
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.shape === "x") {
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);

        ctx.moveTo(this.size / 2, -this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);

        ctx.stroke();
      } else if (this.shape === "triangle") {
        const r = this.size / 2;

        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.866, r * 0.5);
        ctx.lineTo(-r * 0.866, r * 0.5);

        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function setup() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(false));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(loop);
  }

  setup();
  loop();
});