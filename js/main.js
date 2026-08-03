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
