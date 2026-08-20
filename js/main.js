// ===== Theme toggle =====
(function () {
  document.documentElement.classList.add("js");
  var stored = localStorage.getItem("theme");
  var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var theme = stored || system;
  document.documentElement.setAttribute("data-theme", theme);

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  });
})();

// ===== Typewriter =====
(function () {
  var phrases = [
    "Senior Full Stack Developer",
    "Especialista en .NET (C#) y Java",
    "Arquitecturas Hexagonal & BFF",
    "Spec-Driven Development"
  ];
  var el = document.getElementById("typewriter");
  if (!el) return;

  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function tick() {
    var current = phrases[phraseIndex];
    var text = deleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);
    el.innerHTML = text + '<span class="caret">|</span>';

    if (!deleting) {
      charIndex++;
      if (charIndex === current.length + 1) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 70);
    } else {
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 38);
    }
  }
  setTimeout(tick, 600);
})();

// ===== Reveal on scroll =====
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (n) { n.classList.add("visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(function (n) { io.observe(n); });
})();

// ===== Projects carousel (infinite) =====
(function () {
  var track = document.getElementById("projects-track");
  if (!track || track.children.length === 0) return;

  var viewport = track.parentElement;
  var originals = Array.prototype.slice.call(track.children);
  var N = originals.length;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MS = 500;
  var current = N - 1;
  var animating = false;

  // Clones for the infinite loop: prepend last N-1, append first N-1
  var i, j;
  for (i = N - 1; i >= 1; i--) {
    var c = originals[i].cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    track.insertBefore(c, track.firstChild);
  }
  for (j = 0; j < N - 1; j++) {
    var d = originals[j].cloneNode(true);
    d.setAttribute("aria-hidden", "true");
    track.appendChild(d);
  }

  var cards = track.children;
  var len = cards.length;

  function stepWidth() {
    var card = cards[0];
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function render(animate) {
    var cw = cards[0].getBoundingClientRect().width;
    var center = (viewport.clientWidth - cw) / 2;
    var offset = center - current * stepWidth();
    track.style.transition = animate
      ? "transform " + MS + "ms cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
    track.style.transform = "translate3d(" + offset + "px, 0, 0)";
  }

  function setActive(animate) {
    var k;
    if (animate === false) {
      for (k = 0; k < len; k++) cards[k].style.transition = "none";
    }
    for (k = 0; k < len; k++) cards[k].classList.remove("active");
    cards[current].classList.add("active");
    if (animate === false) {
      void track.offsetWidth;
      for (k = 0; k < len; k++) cards[k].style.transition = "";
    }
  }

  function snap() {
    var m;
    if (current >= N - 1 && current <= 2 * N - 2) return;
    if (current < N - 1) m = current + 1;
    else m = current - (2 * N - 1);
    current = N - 1 + m;
  }

  function go(dir) {
    if (animating) return;
    var next = current + dir;
    if (next < 0 || next >= len) return;
    animating = true;
    current = next;
    render(true);
    window.setTimeout(function () {
      snap();
      render(false);
      setActive(!reduced);
      animating = false;
    }, reduced ? 0 : MS);
  }

  var prev = document.querySelector(".carousel-prev");
  var next = document.querySelector(".carousel-next");
  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });
  window.addEventListener("resize", function () { render(false); });

  render(false);
  setActive(!reduced);
})();
