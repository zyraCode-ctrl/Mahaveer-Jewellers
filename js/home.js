(() => {
  const { $, $$, D, icon, listingURL, productURL, formatINR, cardHTML, escapeHTML, imageFor, mediaClass } = Site;
  Site.init();

  $$(".round-nav").forEach((btn) => {
    const back = /prev/.test(btn.className);
    btn.innerHTML = icon(back ? "arrowLeft" : "arrowRight", 18);
  });

  const IMG = window.SITE_IMAGES || {};
  const mobileQuery = window.matchMedia("(max-width: 900px)");
  const pickSrc = (slot) => (typeof slot === "string" ? slot : slot && ((mobileQuery.matches && slot.mobile) || slot.desktop)) || "";

  // Picks up to n products, alternating categories so rails don't show five near-identical pieces in a row.
  const diverse = (list, n) => {
    const queues = Object.values(list.reduce((acc, p) => ((acc[p.cat] ||= []).push(p), acc), {}));
    const out = [];
    while (out.length < n && queues.some((q) => q.length)) {
      queues.forEach((q) => { if (q.length && out.length < n) out.push(q.shift()); });
    }
    return out;
  };

  // Hero carousel
  const slides = $$(".hero-slide");
  const applyHeroPhotos = () => slides.forEach((s, i) => {
    const src = pickSrc((IMG.hero || [])[i]);
    const img = $(".hero-bg", s);
    if (!img.dataset.fallback) img.dataset.fallback = img.getAttribute("src");
    img.src = src || img.dataset.fallback;
  });
  applyHeroPhotos();
  mobileQuery.addEventListener("change", applyHeroPhotos);
  const dots = $(".hero-dots");
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}" data-index="${i}"></button>`).join("");
  let current = 0;
  const go = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === current);
      s.setAttribute("aria-hidden", String(i !== current));
      $$("a", s).forEach((a) => { a.tabIndex = i === current ? 0 : -1; });
    });
    $$("button", dots).forEach((d, i) => d.classList.toggle("on", i === current));
  };
  go(0);
  let timer;
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 6500);
  };
  restart();
  $(".hero-prev").addEventListener("click", () => { go(current - 1); restart(); });
  $(".hero-next").addEventListener("click", () => { go(current + 1); restart(); });
  const hero = $(".hero");
  let heroX = null;
  hero.addEventListener("touchstart", (e) => { heroX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (heroX === null) return;
    const dx = e.changedTouches[0].clientX - heroX;
    if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
    heroX = null;
  });
  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("button");
    if (!dot) return;
    go(Number(dot.dataset.index));
    restart();
  });

  // Shop by category: photo tiles linking to the listing
  const categoryTiles = [
    { label: "Earrings", query: { cat: "earrings" } },
    { label: "Rings", query: { cat: "rings" } },
    { label: "Necklaces", query: { cat: "necklaces-pendants", type: "Necklace" } },
    { label: "Bangles", query: { cat: "bracelets-bangles", type: "Bangle" } },
    { label: "Mangalsutra", query: { cat: "mangalsutra" } },
    { label: "Pendants", query: { cat: "necklaces-pendants", type: "Pendant" } },
    { label: "Bracelets", query: { cat: "bracelets-bangles", type: "Bracelet" } },
    { label: "Silver", query: { cat: "silver" } },
  ];
  const matchesQuery = (p, q) => Object.entries(q).every(([k, v]) => (k === "cat" ? p.cat === v : p[k] === v));
  $(".cat-grid").innerHTML = categoryTiles.map((t) => {
    const list = D.products.filter((x) => matchesQuery(x, t.query));
    const p = list.find((x) => x.images && x.images.length) || list[0];
    return `
    <a class="cat-tile" href="${listingURL(t.query)}">
      <span class="cat-photo plp-media ${p ? mediaClass(p) : "is-art"}"><img src="${p ? imageFor(p) : "assets/necklace.svg"}" alt="" loading="lazy"></span>
      <b>${escapeHTML(t.label)}</b>
      <small>${list.length} ${list.length === 1 ? "Design" : "Designs"}</small>
    </a>`;
  }).join("");
  const scrollRail = (el, dir) => el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });

  // Featured collections carousel (centre mode)
  const collTrack = $(".collection-track");
  collTrack.innerHTML = D.COLLECTIONS.map((c, i) => {
    const photo = (IMG.collections || {})[c.slug];
    const count = D.products.filter((p) => p.collection === c.slug).length;
    return `
    <a class="collection-banner tone-${c.tone}" href="${listingURL({ collection: c.slug })}" data-index="${i}">
      <div class="cb-art ${photo ? "has-photo" : ""}"><img src="${photo || `assets/${c.art}.svg`}" alt="" loading="lazy"></div>
      <div class="cb-copy">
        <p class="kicker">Collection</p>
        <h3>${escapeHTML(c.name)}</h3>
        <p>${escapeHTML(c.blurb)}</p>
        <span class="cb-meta">${count} designs</span>
        <span class="btn-text">Shop the Collection <span aria-hidden="true">&rarr;</span></span>
      </div>
    </a>`;
  }).join("");
  const banners = $$(".collection-banner");
  let collIndex = 1;
  const showCollection = (index) => {
    collIndex = (index + banners.length) % banners.length;
    const banner = banners[collIndex];
    const offset = banner.offsetLeft - (collTrack.parentElement.clientWidth - banner.offsetWidth) / 2;
    collTrack.style.transform = `translateX(${-offset}px)`;
    banners.forEach((b, i) => b.classList.toggle("active", i === collIndex));
  };
  requestAnimationFrame(() => showCollection(collIndex));
  window.addEventListener("resize", () => showCollection(collIndex));
  $(".coll-prev").addEventListener("click", () => showCollection(collIndex - 1));
  $(".coll-next").addEventListener("click", () => showCollection(collIndex + 1));
  let swipeX = null;
  collTrack.addEventListener("touchstart", (e) => { swipeX = e.touches[0].clientX; }, { passive: true });
  collTrack.addEventListener("touchend", (e) => {
    if (swipeX === null) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(dx) > 40) showCollection(collIndex + (dx < 0 ? 1 : -1));
    swipeX = null;
  });

  // Product sections
  const tagged = (tag) => D.products.filter((p) => p.tags.includes(tag));
  const newTabs = [
    { label: "All", query: {} },
    { label: "Earrings", query: { cat: "earrings" } },
    { label: "Rings", query: { cat: "rings" } },
    { label: "Necklaces", query: { cat: "necklaces-pendants" } },
    { label: "Bangles", query: { cat: "bracelets-bangles" } },
  ].filter((t) => tagged("new").some((p) => matchesQuery(p, t.query)));
  const newTabsEl = $(".new-tabs");
  newTabsEl.innerHTML = newTabs.map((t, i) => `<button class="chip" role="tab" data-index="${i}" aria-selected="${i === 0}">${escapeHTML(t.label)}</button>`).join("");
  const showNew = (index) => {
    const tab = newTabs[index];
    const list = tagged("new").filter((p) => matchesQuery(p, tab.query));
    $(".new-grid").innerHTML = (index === 0 ? diverse(list, 4) : list.slice(0, 4)).map(cardHTML).join("");
    $(".new-all").href = listingURL({ tag: "new", ...tab.query });
    $$(".chip", newTabsEl).forEach((c, i) => c.setAttribute("aria-selected", String(i === index)));
  };
  showNew(0);
  newTabsEl.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (chip) showNew(Number(chip.dataset.index));
  });

  const storyPick = D.products.find((p) => p.metal === "Diamond" && p.images && p.images.length && p.cat === "necklaces-pendants") || D.products.find((p) => p.metal === "Diamond");
  if (storyPick) {
    $(".story-inset").innerHTML = `<span class="plp-media ${mediaClass(storyPick)}"><span class="plp-img ${storyPick.bg}"><img src="${imageFor(storyPick)}" alt="" loading="lazy"></span></span><span class="story-inset-label">Shop Diamonds <span aria-hidden="true">&rarr;</span></span>`;
  }

  const bestRail = $(".best-rail");
  bestRail.innerHTML = diverse(tagged("best"), 10).map(cardHTML).join("");
  $(".best-prev").addEventListener("click", () => scrollRail(bestRail, -1));
  $(".best-next").addEventListener("click", () => scrollRail(bestRail, 1));

  const bridalPicks = [
    D.products.find((p) => p.cat === "necklaces-pendants" && p.type === "Necklace"),
    D.products.find((p) => p.cat === "mangalsutra"),
    D.products.find((p) => p.type === "Bangle"),
  ].filter(Boolean);
  $(".bridal-products").innerHTML = bridalPicks.map((p) => `
    <a class="mini-product" href="${productURL(p.id)}">
      <span class="plp-media ${mediaClass(p)}"><span class="plp-img ${p.bg}"><img src="${imageFor(p)}" alt="" loading="lazy"></span></span>
      <span class="mini-name">${escapeHTML(p.name)}</span>
      <b>${formatINR(p.price)}</b>
    </a>`).join("");

  $(".diamond-grid").innerHTML = diverse(D.products.filter((p) => p.metal === "Diamond"), 3).map(cardHTML).join("");
  $(".gold-grid").innerHTML = diverse(D.products.filter((p) => p.metal === "Plain Gold"), 3).map(cardHTML).join("");

  // Promises
  $(".pledge-grid").innerHTML = D.PROMISES.map((p) => `
    <a class="pledge-item" href="${p.href}">
      <span class="pledge-icon">${icon(p.icon, 24)}</span>
      <b>${escapeHTML(p.label)}</b>
      <small>${escapeHTML(p.note)}</small>
      <span class="pledge-more">Learn more ${icon("arrowRight", 13)}</span>
    </a>`).join("");

  // Jewellery guide
  const photoOf = (test) => D.products.find((p) => test(p) && p.images && p.images.length) || D.products.find(test);
  const guides = [
    { title: "Find your ring and bangle size", text: "Measure at home in two minutes with our printable size guide.", href: "info.html?page=size-guide", product: photoOf((p) => p.cat === "rings") },
    { title: "Understanding gold rate and hallmark", text: "How karatage, HUID and making charges shape the final price.", href: "gold-rate.html", product: photoOf((p) => p.metal === "Plain Gold") },
    { title: "Lifetime exchange, explained", text: "Upgrade or exchange your jewellery at today's value, for life.", href: "info.html?page=exchange", product: photoOf((p) => p.metal === "Diamond") },
  ];
  $(".guide-grid").innerHTML = guides.map((g) => `
    <a class="guide-card" href="${g.href}">
      <span class="guide-photo plp-media ${g.product ? mediaClass(g.product) : "is-art"}"><span class="plp-img ${g.product ? g.product.bg : ""}"><img src="${g.product ? imageFor(g.product, 1) : "assets/ring.svg"}" alt="" loading="lazy"></span></span>
      <span class="guide-body"><b>${escapeHTML(g.title)}</b><small>${escapeHTML(g.text)}</small><span class="btn-text">Read the guide <span aria-hidden="true">&rarr;</span></span></span>
    </a>`).join("");

  // Testimonials marquee
  const cards = D.TESTIMONIALS.map((t) => `
    <figure class="t-card">
      <div class="stars">${icon("star", 13).repeat(5)}</div>
      <blockquote>${escapeHTML(t.text)}</blockquote>
      <figcaption><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.city)} · ${escapeHTML(t.date)}</small></figcaption>
    </figure>`).join("");
  $(".marquee-track").innerHTML = cards + cards;
})();
