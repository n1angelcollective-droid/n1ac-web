// Faint venture-capital vocabulary drifting behind the whole page.
(function () {
  const host = document.querySelector(".wordfield");
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

  // Scale the count to the page height so density stays constant no matter
  // how long the page gets, rather than crowding into the first screen.
  const pageHeight = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  const rows = Math.min(60, Math.max(16, Math.round(pageHeight / 130)));
  const BRAND_COUNT = Math.max(3, Math.round(rows / 3.2));

  // The brand mark recurs through the field, larger and brighter than the
  // surrounding vocabulary so it reads as the dominant word. Its slots are
  // spaced evenly rather than shuffled in — two large marks landing in
  // adjacent vertical bands overlap and read as a mistake.
  const brandSlots = new Set();
  for (let k = 0; k < BRAND_COUNT; k++) {
    brandSlots.add(Math.floor(((k + 0.5) * rows) / BRAND_COUNT));
  }

  const items = [];
  let termIndex = 0;
  for (let i = 0; i < rows; i++) {
    if (brandSlots.has(i)) {
      items.push({ text: "N1AC", brand: true });
    } else {
      items.push({ text: pool[termIndex++ % pool.length], brand: false });
    }
  }
  const placed = [];

  items.forEach(function (item, i) {
    const s = document.createElement("span");
    s.textContent = item.text;
    if (item.brand) s.className = "is-brand";
    // One word per horizontal band, spread down the full document height.
    const left = 2 + Math.random() * 88;
    s.dataset.left = left.toFixed(3);
    s.style.left = left.toFixed(3) + "%";
    s.style.top = ((i + Math.random() * 0.8) * (98 / rows) + 1).toFixed(3) + "%";
    s.style.fontSize = item.brand
      ? (1.5 + Math.random() * 1.3).toFixed(3) + "rem"
      : (0.58 + Math.random() * 0.34).toFixed(3) + "rem";
    s.style.setProperty("--dur", 12 + Math.random() * 14 + "s");
    s.style.setProperty("--delay", Math.random() * 14 + "s");
    s.style.setProperty(
      "--peak",
      item.brand
        ? (0.13 + Math.random() * 0.08).toFixed(3)
        : (0.035 + Math.random() * 0.045).toFixed(3)
    );
    host.appendChild(s);
    placed.push(s);
  });

  // Words are far wider than glyphs, so a random left offset can push them off
  // the right edge and get them clipped. Measure, then pull back any that
  // overhang. Each word keeps its intended position so re-running on resize
  // clamps from the original rather than compounding previous corrections.
  function clamp() {
    const hostWidth = host.clientWidth;
    if (!hostWidth) return;
    const widths = placed.map((s) => s.offsetWidth);
    placed.forEach(function (s, i) {
      const intended = parseFloat(s.dataset.left);
      const maxLeft = hostWidth - widths[i] - hostWidth * 0.02;
      if (maxLeft <= 0) return;
      const wanted = (intended / 100) * hostWidth;
      const left = wanted > maxLeft ? maxLeft : wanted;
      s.style.left = ((left / hostWidth) * 100).toFixed(3) + "%";
    });
  }

  requestAnimationFrame(clamp);

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(clamp, 150);
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
