(() => {
  const { $, $$, D, icon, escapeHTML, imageFor } = Site;
  const grid = $(".insta-grid");
  if (!grid) return;

  const COUNT = 5;
  const EMBED_WIDTH = 326;
  const profileURL = D.BRAND.instagram;
  const canHover = matchMedia("(hover: hover)").matches;
  $(".insta-follow").href = profileURL;

  const embedURL = (permalink) => {
    const path = new URL(permalink).pathname.replace(/\/?$/, "/");
    return `https://www.instagram.com${path}embed/`;
  };
  const shortCaption = (text) => {
    const line = (text || "").split("\n")[0].replace(/#[^\s#]+/g, "").trim();
    return line.length > 60 ? `${line.slice(0, 57).trim()}…` : line;
  };

  grid.innerHTML = `<span class="insta-reel is-loading"></span>`.repeat(COUNT);
  grid.setAttribute("aria-busy", "true");

  // Official Instagram embed player in a modal
  const modal = document.createElement("div");
  modal.className = "modal insta-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Instagram Reel");
  modal.innerHTML = `
    <div class="modal-card insta-modal-card">
      <button class="modal-close" aria-label="Close">${icon("close", 18)}</button>
      <div class="insta-modal-frame"><iframe title="Instagram Reel" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen scrolling="no"></iframe></div>
      <a class="btn-primary insta-modal-open" target="_blank" rel="noopener">${icon("instagram", 16)} Open on Instagram</a>
    </div>`;
  document.body.append(modal);
  const frame = $("iframe", modal);
  const setModal = (open) => {
    modal.hidden = !open;
    document.body.classList.toggle("modal-open", open);
  };
  new MutationObserver(() => { if (modal.hidden) frame.src = "about:blank"; }).observe(modal, { attributes: true, attributeFilter: ["hidden"] });
  $(".modal-close", modal).addEventListener("click", () => setModal(false));
  modal.addEventListener("click", (event) => { if (event.target === modal) setModal(false); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) setModal(false); });
  const openReel = (permalink) => {
    frame.src = embedURL(permalink);
    $(".insta-modal-open", modal).href = permalink;
    setModal(true);
  };

  const playOnly = (video) => {
    $$("video", grid).forEach((v) => { if (v !== video) v.pause(); });
    if (video) video.play().catch(() => {});
  };

  function renderFeed(reels) {
    grid.innerHTML = reels.map((r) => {
      const caption = shortCaption(r.caption);
      return `
      <button type="button" class="insta-reel is-video" data-permalink="${escapeHTML(r.permalink)}" aria-label="Play Reel${caption ? `: ${escapeHTML(caption)}` : ""}">
        ${r.video
          ? `<video muted loop playsinline preload="none" poster="${escapeHTML(r.thumbnail || "")}" src="${escapeHTML(r.video)}"></video>`
          : `<img src="${escapeHTML(r.thumbnail || "")}" alt="" loading="lazy">`}
        ${caption ? `<span class="insta-caption">${escapeHTML(caption)}</span>` : ""}
        <span class="insta-play">${icon("play", 14)}</span>
        <span class="insta-hover"><span class="insta-hover-play">${icon("play", 22)}</span></span>
      </button>`;
    }).join("");

    $$(".insta-reel", grid).forEach((card) => {
      card.addEventListener("click", () => { playOnly(null); openReel(card.dataset.permalink); });
      const video = $("video", card);
      if (!video || !canHover) return;
      card.addEventListener("mouseenter", () => playOnly(video));
      card.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
    });

    if (!canHover) {
      const visible = new Map();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => visible.set(e.target, e.intersectionRatio));
        const [best, ratio] = [...visible].sort((a, b) => b[1] - a[1])[0] || [];
        playOnly(ratio > 0.7 ? best : null);
      }, { threshold: [0, 0.7, 1] });
      $$("video", grid).forEach((v) => observer.observe(v));
    }
  }

  function renderEmbeds(permalinks) {
    grid.innerHTML = permalinks.map((link) => `
      <div class="insta-reel is-embed">
        <iframe src="${escapeHTML(embedURL(link))}" title="Instagram Reel" loading="lazy" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </div>`).join("");
    const fit = () => $$(".insta-reel.is-embed", grid).forEach((card) => card.style.setProperty("--embed-scale", card.clientWidth / EMBED_WIDTH));
    fit();
    new ResizeObserver(fit).observe(grid);
  }

  function renderFallback() {
    const photoOf = (cat) => {
      const product = D.products.find((p) => p.cat === cat && p.images && p.images.length > 1);
      return product && imageFor(product, 1);
    };
    const tiles = [
      { caption: "Everyday diamond mangalsutra", photo: photoOf("mangalsutra") },
      { caption: "Stacked for the weekend", photo: photoOf("rings") },
      { caption: "Inside the showroom", photo: "images/showroom/gold-counter.jpg" },
      { caption: "Layered in 18kt gold", photo: photoOf("necklaces-pendants") },
      { caption: "A bracelet for every wrist", photo: photoOf("bracelets-bangles") },
    ].filter((t) => t.photo);
    grid.innerHTML = tiles.map((t) => `
      <a class="insta-reel" href="${profileURL}" target="_blank" rel="noopener" aria-label="${escapeHTML(t.caption)} on Instagram">
        <img src="${t.photo}" alt="" loading="lazy">
        <span class="insta-caption">${escapeHTML(t.caption)}</span>
        <span class="insta-hover">${icon("instagram", 30)}</span>
      </a>`).join("");
  }

  fetch(`/api/instagram/reels?limit=${COUNT}`, { headers: { Accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null)
    .then((data) => {
      const reels = (data && data.reels) || [];
      const manual = (D.BRAND.instagramReels || []).filter(Boolean);
      if (reels.length) renderFeed(reels.slice(0, COUNT));
      else if (manual.length) renderEmbeds(manual.slice(0, COUNT));
      else renderFallback();
      grid.removeAttribute("aria-busy");
    });
})();
