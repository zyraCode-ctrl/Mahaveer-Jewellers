(() => {
  const { $, $$, D, icon, escapeHTML } = Site;
  const row = $(".reel-row");
  if (!row) return;

  const COUNT = 5;
  const accounts = D.BRAND.instagramAccounts || [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  $(".reel-follow").innerHTML = accounts.map((a) => `
    <a class="insta-follow" href="${escapeHTML(a.url)}" target="_blank" rel="noopener" aria-label="Follow @${escapeHTML(a.handle)} on Instagram">
      <span class="insta-follow-icon">${icon("instagram", 16)}</span>
      <span class="insta-follow-text"><small>Follow on Instagram</small><strong>@${escapeHTML(a.handle)}</strong></span>
    </a>`).join("");

  const cardHTML = (reel) => {
    const account = accounts[reel.account] || accounts[0] || { handle: "" };
    return `
    <article class="reel-card" data-state="${reduceMotion ? "paused" : "playing"}">
      <video class="reel-video" src="${escapeHTML(reel.video)}"${reel.poster ? ` poster="${escapeHTML(reel.poster)}"` : ""} muted loop playsinline preload="metadata" disablepictureinpicture aria-hidden="true"></video>
      <span class="reel-missing" aria-hidden="true"><img src="images/brand/logo-icon.png" alt=""><small>@${escapeHTML(account.handle)}</small></span>
      <span class="reel-big-play" aria-hidden="true">${icon("play", 22)}</span>
      <button type="button" class="reel-toggle" aria-label="Pause video">${icon("pause", 14)}${icon("play", 14)}</button>
      <div class="reel-meta">
        <span class="reel-handle">@${escapeHTML(account.handle)}</span>
      </div>
    </article>`;
  };

  function setState(card, state) {
    const video = $("video", card);
    card.dataset.state = state;
    $(".reel-toggle", card).setAttribute("aria-label", state === "playing" ? "Pause video" : "Play video");
    if (state === "playing") video.play().catch(() => setState(card, "paused"));
    else video.pause();
  }

  function render(reels) {
    row.innerHTML = reels.slice(0, COUNT).map(cardHTML).join("");
    const cards = $$(".reel-card", row);

    cards.forEach((card) => {
      const video = $("video", card);
      video.addEventListener("error", () => card.classList.add("is-missing"), { once: true });
      card.addEventListener("click", (event) => {
        if (card.classList.contains("is-missing")) return;
        card.dataset.userPaused = card.dataset.state === "playing" ? "1" : "";
        setState(card, card.dataset.state === "playing" ? "paused" : "playing");
      });
    });

    // Play only the cards on screen; a card the visitor paused stays paused.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (target.classList.contains("is-missing") || target.dataset.userPaused || reduceMotion) return;
        setState(target, isIntersecting ? "playing" : "paused");
      });
    }, { threshold: 0.5 });
    cards.forEach((card) => observer.observe(card));
  }

  render(D.BRAND.instagramReels || []);
})();
