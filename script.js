// Faint symbols of accumulation drifting in the hero background.
(function () {
  const host = document.querySelector(".hero__symbols");
  if (!host) return;

  const glyphs = ["∑", "∴", "→", "∆", "±", "∫", "⊕", "≫", "×", "∞", "∇", "√"];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = 4 + Math.random() * 92 + "%";
    s.style.top = 6 + Math.random() * 88 + "%";
    s.style.fontSize = 0.8 + Math.random() * 1.4 + "rem";
    s.style.setProperty("--dur", 10 + Math.random() * 14 + "s");
    s.style.setProperty("--delay", Math.random() * 12 + "s");
    s.style.setProperty("--peak", (0.04 + Math.random() * 0.05).toFixed(3));
    host.appendChild(s);
  }
})();

// Reveal sections on scroll.
// Position-based rather than intersection-based: an element that is jumped
// past (deep link, scroll restoration, fast flick) never "intersects", so an
// IntersectionObserver would leave it invisible forever.
(function () {
  let pending = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  let queued = false;

  function sweep() {
    queued = false;
    pending = pending.filter(function (el) {
      const top = el.getBoundingClientRect().top;
      // Reveal once scrolled into the lower 85% of the viewport, or past it.
      if (top < window.innerHeight * 0.85) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
})();
