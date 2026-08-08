// Faint venture-capital vocabulary drifting in the hero background.
(function () {
  const host = document.querySelector(".hero__symbols");
  if (!host) return;

  const words = [
    "PRE-SEED", "SEED", "TERM SHEET", "CAP TABLE", "SAFE",
    "VALUATION", "DILUTION", "RUNWAY", "TRACTION", "DILIGENCE",
    "CONVICTION", "PORTFOLIO", "SYNDICATE", "PRO RATA", "DEAL FLOW",
    "ALLOCATION", "FOLLOW-ON", "THESIS", "BURN RATE", "EQUITY"
  ];

  // Shuffle so the same words are not always the ones shown.
  const pool = words.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const count = 12;
  const rows = count;

  const placed = [];

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = pool[i % pool.length];
    // Spread vertically by band so they don't clump onto the headline.
    s.style.left = 2 + Math.random() * 88 + "%";
    s.style.top = ((i + Math.random() * 0.8) * (92 / rows) + 4).toFixed(2) + "%";
    s.style.fontSize = (0.58 + Math.random() * 0.34).toFixed(3) + "rem";
    s.style.setProperty("--dur", 12 + Math.random() * 14 + "s");
    s.style.setProperty("--delay", Math.random() * 14 + "s");
    s.style.setProperty("--peak", (0.035 + Math.random() * 0.045).toFixed(3));
    host.appendChild(s);
    placed.push(s);
  }

  // Words are far wider than glyphs, so a random left offset can push them off
  // the right edge and get them clipped. Measure once, then pull back any that
  // overhang. Done in a single batched pass to avoid layout thrash.
  requestAnimationFrame(function () {
    const hostWidth = host.clientWidth;
    if (!hostWidth) return;
    const widths = placed.map((s) => s.offsetWidth);
    placed.forEach(function (s, i) {
      const maxLeft = hostWidth - widths[i] - hostWidth * 0.02;
      if (maxLeft <= 0) return;
      const current = (parseFloat(s.style.left) / 100) * hostWidth;
      if (current > maxLeft) {
        s.style.left = ((maxLeft / hostWidth) * 100).toFixed(2) + "%";
      }
    });
  });
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
