window.Site = (() => {
  const D = window.SiteData;
  const B = D.BRAND;
  const { icon } = window.Icons;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const formatINR = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = () => new URLSearchParams(location.search);
  const listingURL = (query) => `listing.html?${new URLSearchParams(query)}`;
  const productURL = (id) => `product.html?id=${encodeURIComponent(id)}`;
  const findProduct = (id) => D.products.find((p) => p.id === id);
  const findCategory = (slug) => D.CATEGORIES.find((c) => c.slug === slug);
  const imageFor = (p, index = 0) => (p.images && p.images.length ? p.images[index % p.images.length] : `assets/${p.icon}.svg`);
  const whatsappURL = () => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(`Hello ${B.name}`)}`;
  const mapURL = () => B.mapURL;
  const productEnquiry = (p) => whatsappURL(`Hello ${B.name}, I would like to know more about ${p.name} (${p.id}), listed at ${formatINR(p.price)}.`);

  // Placeholder artwork is tinted to hint at the metal until real photos are added.
  const mediaClass = (p) => {
    if (p.images && p.images.length) return "is-photo";
    if (p.metal === "Silver") return "is-art tone-silver";
    if (p.metal === "Rose Gold") return "is-art tone-rose";
    return "is-art";
  };
  const specLine = (p) => {
    if (p.metal === "Silver") return "925 Sterling Silver";
    const gold = `${p.karat}KT ${p.metal === "Rose Gold" ? "Rose" : "Yellow"} Gold`;
    if (p.metal === "Diamond") return `${gold} · ${p.diamondCt} ct Diamond`;
    if (p.metal === "Gemstone") return `${gold} · Gemstone`;
    if (p.metal === "Pearl") return `${gold} · Pearl`;
    return gold;
  };

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const store = {
    bag: () => read("site.bag", []),
    wish: () => read("site.wish", []),
    user: () => read("site.user", null),
    recent: () => read("site.recent", []),
    setBag(items) { write("site.bag", items); updateCounts(); },
    addToBag(id, size = null) {
      const items = store.bag();
      const existing = items.find((i) => i.id === id && i.size === size);
      existing ? (existing.qty += 1) : items.push({ id, size, qty: 1 });
      store.setBag(items);
      toast("Added to your bag");
    },
    isWished: (id) => store.wish().includes(id),
    toggleWish(id) {
      const list = store.wish();
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      write("site.wish", next);
      updateCounts();
      toast(next.includes(id) ? "Saved to wishlist" : "Removed from wishlist");
      return next.includes(id);
    },
    setUser(user) { write("site.user", user); },
    pushRecent(id) { write("site.recent", [id, ...store.recent().filter((x) => x !== id)].slice(0, 8)); },
  };

  function updateCounts() {
    const bagQty = store.bag().reduce((sum, i) => sum + i.qty, 0);
    $$(".bag-count:not(.wish-count)").forEach((el) => {
      el.textContent = bagQty;
      el.hidden = bagQty === 0;
    });
    $$(".wish-count").forEach((el) => {
      const n = store.wish().length;
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function setDrawer(drawer, open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  function bindDrawers() {
    $$(".drawer").forEach((drawer) => {
      $$(".close-drawer", drawer).forEach((btn) => btn.addEventListener("click", () => setDrawer(drawer, false)));
      drawer.addEventListener("click", (event) => { if (event.target === drawer) setDrawer(drawer, false); });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") $$(".drawer.open").forEach((d) => setDrawer(d, false));
    });
  }

  function setModal(modal, open) {
    modal.hidden = !open;
    document.body.classList.toggle("modal-open", open);
  }

  const linkList = (items) => items.map(([label, href]) => `<li><a href="${href}">${escapeHTML(label)}</a></li>`).join("");
  const NAV_LABELS = { "bracelets-bangles": "Bangles & Bracelets", "necklaces-pendants": "Necklaces", silver: "Silver", more: "Coins & More" };

  function categoryMenu(cat) {
    const groups = [
      ["Shop By Type", cat.types.map((t) => [t, listingURL({ cat: cat.slug, type: t })])],
    ];
    if (!cat.silverOnly && cat.slug !== "more") {
      groups.push(["Metal", D.METALS.map((m) => [m, listingURL({ cat: cat.slug, metal: m })])]);
      groups.push(["Karatage", D.KARATS.map((k) => [`${k}kt`, listingURL({ cat: cat.slug, karat: k })])]);
      groups.push(["Occasion", D.OCCASIONS.map((o) => [o, listingURL({ cat: cat.slug, occasion: o })])]);
      groups.push(["Gender", D.GENDERS.map((g) => [g, listingURL({ cat: cat.slug, gender: g })])]);
    }
    groups.push(["Featured", [
      [`All ${cat.name}`, listingURL({ cat: cat.slug })],
      ...Object.entries(D.TAGS).map(([tag, label]) => [label, listingURL({ cat: cat.slug, tag })]),
    ]]);
    groups.push(["Price", D.PRICE_BANDS.slice(0, 5).map((b) => [b.label, listingURL({ cat: cat.slug, price: b.value })])]);
    return groups;
  }

  function navItems() {
    const main = D.CATEGORIES.filter((c) => c.slug !== "more").map((cat) => ({ label: NAV_LABELS[cat.slug] || cat.name, href: listingURL({ cat: cat.slug }), groups: categoryMenu(cat) }));
    const bridal = {
      label: "Bridal",
      href: listingURL({ collection: "vivaah" }),
      groups: [
        ["Bridal Edit", [["Vivaah Bridal", listingURL({ collection: "vivaah" })], ["Polki Heritage", listingURL({ collection: "polki-heritage" })], ["Kundan Royale", listingURL({ collection: "kundan-royale" })], ["Temple Gold", listingURL({ collection: "temple-gold" })]]],
        ["Bridal Essentials", [["Necklaces", listingURL({ cat: "necklaces-pendants", type: "Necklace" })], ["Mangalsutra", listingURL({ cat: "mangalsutra" })], ["Bangles", listingURL({ cat: "bracelets-bangles", type: "Bangle" })], ["Drop Earrings", listingURL({ cat: "earrings", type: "Drop" })], ["Engagement Rings", listingURL({ cat: "rings", type: "Engagement" })]]],
        ["Consultation", [["Book a Bridal Consultation", whatsappURL(`Hello ${B.name}, I would like to book a bridal consultation.`)], ["Visit Our Showroom", "stores.html"]]],
      ],
    };
    const collections = {
      label: "Collections",
      href: "collections.html",
      groups: [
        ["Collections", D.COLLECTIONS.map((c) => [c.name, listingURL({ collection: c.slug })])],
        ["Explore", [["All Collections", "collections.html"], ["New Arrivals", listingURL({ tag: "new" })], ["Best Sellers", listingURL({ tag: "best" })]]],
      ],
    };
    const gifting = {
      label: "Gifting",
      href: listingURL({ gifting: "all" }),
      groups: [
        ["By Occasion", D.GIFTING.map((g) => [g.name, listingURL({ gifting: g.slug })])],
        ["Featured", [["Most Gifted", listingURL({ tag: "gifted" })], ["New Arrivals", listingURL({ tag: "new" })], ["Best Sellers", listingURL({ tag: "best" })]]],
        ["Budget", D.PRICE_BANDS.slice(0, 4).map((b) => [b.label, listingURL({ gifting: "all", price: b.value })])],
        ["Gift Cards", [["Gift Cards", "info.html?page=gift-cards"]]],
      ],
    };
    const more = findCategory("more");
    const showroom = {
      label: "Showroom",
      href: "stores.html",
      groups: [
        ["Visit", [["Visit Our Showroom", "stores.html"], ["Get Directions", mapURL()], ["Contact Us", "contact.html"]]],
        ["Personal Service", [["Book a Consultation", whatsappURL(`Hello ${B.name}, I would like to book a jewellery consultation.`)], ["Old Gold Exchange", "info.html?page=exchange"], ["Size Guide", "info.html?page=size-guide"]]],
        ["Mahaveer", [["Our Story", "our-story.html"], ["Craftsmanship", "about.html#craft"], ["Gold Rate Today", "gold-rate.html"]]],
      ],
    };
    const story = { label: "Our Story", href: "our-story.html", groups: [] };
    return [...main.slice(0, 6), { label: NAV_LABELS.more, href: listingURL({ cat: "more" }), groups: categoryMenu(more) }, bridal, collections, gifting, showroom, story];
  }

  const logoHTML = (variant = "light") => `
    <a href="index.html" class="logo logo-${variant}" aria-label="${B.name} home">
      <img class="logo-mark" src="images/brand/mark-gold.png" alt="" width="48" height="48">
      <img class="logo-word" src="images/brand/${variant === "light" ? "wordmark-champagne" : "wordmark-gold"}.png" alt="${B.name}" width="160" height="48">
    </a>`;

  function renderHeader() {
    const mount = $("#site-header");
    if (!mount) return;
    const user = store.user();
    const items = navItems();
    const barDismissed = sessionStorage.getItem("site.appbar") === "closed";
    mount.outerHTML = `
      <div class="app-bar announce" ${barDismissed ? "hidden" : ""}>
        <div class="container-wide announce-inner">
          <p class="announce-msg"><span class="announce-spark">${icon("sparkle", 12)}</span> Bridal &amp; jewellery consultations by appointment <a class="announce-link" href="${whatsappURL(`Hello ${B.name}, I would like to book a consultation.`)}" target="_blank" rel="noopener">Book on WhatsApp</a></p>
          <div class="announce-links">
            <a href="stores.html">${icon("pin", 14)} Visit Our Showroom</a>
            <a href="${B.phoneHref}">${icon("phone", 14)} ${escapeHTML(B.phone)}</a>
          </div>
          <button class="app-close" aria-label="Dismiss announcement">${icon("close", 14)}</button>
        </div>
      </div>
      <header class="header">
        <div class="header-top container-wide">
          <div class="header-left">
            <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">${icon("menu", 24)}</button>
            <form class="search" role="search" action="listing.html">
              <button class="search-icon" aria-label="Search">${icon("search", 18)}</button>
              <label class="search-label">
                <span class="search-prefix">Search</span>
                <input type="text" name="q" aria-label="Search jewellery or item number" placeholder=" " autocomplete="off">
                <span class="search-rotator" aria-hidden="true">Bridal Sets</span>
              </label>
              <a class="search-cam" href="search.html" aria-label="Search using an image">${icon("camera", 18)}</a>
              <ul class="search-suggest" hidden></ul>
            </form>
          </div>
          ${logoHTML("dark")}
          <div class="header-actions">
            <a href="search.html" class="icon-btn mobile-search" aria-label="Search">${icon("search", 22)}</a>
            <a href="gold-rate.html" class="gold-rate"><span class="coin-flip"><span class="coin">&#8377;</span><span class="coin coin-back" aria-hidden="true">&#8377;</span></span> Gold Rate</a>
            <a href="stores.html" class="icon-btn hide-sm" aria-label="Visit our showroom">${icon("store", 21)}<span class="ia-label">Showroom</span></a>
            <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">${icon("heart", 21)}<span class="ia-label">Wishlist</span><span class="bag-count wish-count" hidden>0</span></a>
            <a href="cart.html" class="icon-btn bag" aria-label="Bag">${icon("bag", 21)}<span class="ia-label">Bag</span><span class="bag-count" hidden>0</span></a>
            <a href="${user ? "account.html" : "login.html"}" class="icon-btn login" aria-label="${user ? "My account" : "Login"}">${icon("user", 21)}<span class="ia-label">${user ? escapeHTML(user.name.split(" ")[0]) : "Login"}</span></a>
          </div>
        </div>
        <nav class="main-nav" aria-label="Categories">
          <ul class="container-wide">
            ${items.map((item) => `
              <li class="nav-item ${item.label === "Bridal" ? "nav-accent" : ""}">
                <a href="${item.href}">${escapeHTML(item.label)}</a>
                ${item.groups.length ? `<div class="mega">
                  <div class="mega-inner container-wide">
                    ${item.groups.map(([title, links]) => `<div class="mega-col"><h4>${escapeHTML(title)}</h4><ul>${linkList(links)}</ul></div>`).join("")}
                    <a class="mega-feature" href="stores.html">
                      <img src="images/showroom/${item.label === "Bridal" ? "consultant-bridal" : "gold-counter"}.jpg" alt="" loading="lazy">
                      <span><small>Experience it in person</small>Visit Our Showroom</span>
                    </a>
                  </div>
                </div>` : ""}
              </li>`).join("")}
          </ul>
        </nav>
      </header>
      <aside class="drawer mobile-menu" aria-hidden="true">
        <div class="drawer-panel left" role="dialog" aria-label="Menu">
          <div class="drawer-head">${logoHTML("dark")}<button class="icon-btn close-drawer" aria-label="Close">${icon("close", 22)}</button></div>
          <a class="mobile-login" href="${user ? "account.html" : "login.html"}">${icon("user", 20)} ${user ? `Hi, ${escapeHTML(user.name)}` : "Login / Sign Up"}</a>
          <a class="mobile-gold" href="gold-rate.html"><span class="coin">&#8377;</span> Today's Gold Rate</a>
          ${items.filter((item) => item.groups.length).map((item) => `
            <details class="m-group">
              <summary>${escapeHTML(item.label)}</summary>
              ${item.groups.map(([title, links]) => `<p class="m-title">${escapeHTML(title)}</p><ul>${linkList(links)}</ul>`).join("")}
            </details>`).join("")}
          <ul class="m-links">${linkList([["Visit Our Showroom", "stores.html"], ["Our Story", "our-story.html"], ["Offers", "offers.html"], ["Help & FAQs", "info.html?page=faqs"], ["Contact Us", "contact.html"]])}</ul>
          <div class="m-showroom">
            <img src="images/showroom/reception.jpg" alt="Mahaveer Jewellers showroom" loading="lazy">
            <p>Visit us for a personal consultation</p>
            <div class="m-showroom-actions">
              <a class="btn-gold" href="${whatsappURL(`Hello ${B.name}, I would like to book a consultation.`)}" target="_blank" rel="noopener">${icon("whatsapp", 16)} WhatsApp</a>
              <a class="btn-ghost" href="${B.phoneHref}">${icon("phone", 16)} Call</a>
            </div>
          </div>
        </div>
      </aside>`;

    const menu = $(".mobile-menu");
    const toggle = $(".menu-toggle");
    toggle.addEventListener("click", () => {
      setDrawer(menu, true);
      toggle.setAttribute("aria-expanded", "true");
    });

    bindSearch($(".header .search"));

    $(".app-close").addEventListener("click", () => {
      $(".app-bar").hidden = true;
      sessionStorage.setItem("site.appbar", "closed");
    });

    const header = $(".header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function suggestions(term) {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    const cats = D.CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({ label: c.name, href: listingURL({ cat: c.slug }) }));
    const prods = D.products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase() === q).slice(0, 6).map((p) => ({ label: p.name, href: productURL(p.id) }));
    return [...cats, ...prods].slice(0, 8);
  }

  function bindSearch(form) {
    const input = $("input", form);
    const list = $(".search-suggest", form);
    const rotator = $(".search-rotator", form);
    const terms = ["Bridal Sets", "Diamond Earrings", "Mangalsutra", "Gold Bangles", "Solitaire Rings"];
    let index = 0;
    if (rotator) {
      setInterval(() => {
        rotator.classList.add("swap");
        setTimeout(() => {
          index = (index + 1) % terms.length;
          rotator.textContent = terms[index];
          rotator.classList.remove("swap");
        }, 300);
      }, 2500);
    }
    form.addEventListener("submit", (event) => {
      if (!input.value.trim()) {
        event.preventDefault();
        input.focus();
      }
    });
    if (!list) return;
    input.addEventListener("input", () => {
      const items = suggestions(input.value);
      list.innerHTML = items.map((i) => `<li><a href="${i.href}">${escapeHTML(i.label)}</a></li>`).join("");
      list.hidden = items.length === 0;
    });
    input.addEventListener("blur", () => setTimeout(() => { list.hidden = true; }, 150));
  }

  function renderFooter() {
    const mount = $("#site-footer");
    if (!mount) return;
    const col = (title, links, cls = "") => `<div class="footer-col ${cls}"><h3>${title}</h3><ul>${linkList(links)}</ul></div>`;
    const jewellery = [
      ["Rings", listingURL({ cat: "rings" })], ["Necklaces", listingURL({ cat: "necklaces-pendants", type: "Necklace" })],
      ["Earrings", listingURL({ cat: "earrings" })], ["Bracelets", listingURL({ cat: "bracelets-bangles", type: "Bracelet" })],
      ["Bangles", listingURL({ cat: "bracelets-bangles", type: "Bangle" })], ["Mangalsutra", listingURL({ cat: "mangalsutra" })],
      ["Pendants", listingURL({ cat: "necklaces-pendants", type: "Pendant" })], ["Nose Pins", listingURL({ cat: "more", type: "Nose Pin" })],
      ["Coins", listingURL({ cat: "more", type: "Silver Coin" })], ["Diamond", listingURL({ metal: "Diamond" })],
      ["Gold", listingURL({ metal: "Plain Gold" })], ["Silver", listingURL({ cat: "silver" })],
    ];
    const channel = (name, label, href, external) => `<a class="channel" href="${href}" ${external ? 'target="_blank" rel="noopener"' : ""}><span>${icon(name, 18)}</span><small>${label}</small></a>`;
    const popular = [
      ["Gold Earrings", listingURL({ cat: "earrings", metal: "Plain Gold" })], ["Diamond Rings", listingURL({ cat: "rings", metal: "Diamond" })],
      ["Mangalsutra Designs", listingURL({ cat: "mangalsutra" })], ["Gold Bangles", listingURL({ cat: "bracelets-bangles", type: "Bangle" })],
      ["Diamond Necklaces", listingURL({ cat: "necklaces-pendants", metal: "Diamond" })], ["Bridal Jewellery", listingURL({ collection: "vivaah" })],
      ["Everyday Diamonds", listingURL({ collection: "everyday-diamonds" })], ["Silver Coins", listingURL({ cat: "more", type: "Silver Coin" })],
      ["Jewellery Gifts", listingURL({ gifting: "all" })], ["Silver Jewellery", listingURL({ cat: "silver" })],
    ];
    mount.outerHTML = `
      <section class="newsletter" aria-label="Newsletter">
        <div class="container-wide newsletter-inner">
          <div>
            <p class="kicker">The Mahaveer Letter</p>
            <h2>New arrivals, bridal edits and showroom events</h2>
          </div>
          <form class="newsletter-form">
            <input type="email" name="email" required placeholder="Your email address" aria-label="Email address">
            <button class="btn-primary" type="submit">Subscribe</button>
            <p class="small-note muted">Occasional letters only. Unsubscribe at any time.</p>
          </form>
        </div>
      </section>
      <footer class="footer">
        <div class="container-wide footer-main">
          <div class="footer-brand">
            <div class="footer-logo">${logoHTML("light")}</div>
            <p class="footer-tagline">${escapeHTML(B.tagline)}. Crafted with care, chosen in person, trusted for generations.</p>
            <address>
              <a href="${mapURL()}" target="_blank" rel="noopener">${icon("pin", 16)} ${escapeHTML(B.address)}</a>
              <span>${icon("store", 16)} ${escapeHTML(B.hours)}</span>
            </address>
            <div class="channels">
              ${channel("whatsapp", "WhatsApp", whatsappURL(`Hello ${B.name}`), true)}
              ${channel("phone", "Call", B.phoneHref)}
              ${channel("mail", "Email", `mailto:${B.email}`)}
              ${channel("chat", "Enquire", "contact.html")}
            </div>
          </div>
          <div class="footer-grid">
            ${col("Jewellery", jewellery, "two-col")}
            ${col("Collections", [...D.COLLECTIONS.map((c) => [c.name, listingURL({ collection: c.slug })]), ["All Collections", "collections.html"]])}
            ${col("Shop", [["New Arrivals", listingURL({ tag: "new" })], ["Best Sellers", listingURL({ tag: "best" })], ["Most Gifted", listingURL({ tag: "gifted" })], ["Gifting Range", listingURL({ gifting: "all" })], ["Gift Cards", "info.html?page=gift-cards"], ["Offers", "offers.html"], ["Gold Rate Today", "gold-rate.html"]])}
            ${col("Customer Care", [["Our Story", "our-story.html"], ["Visit Our Showroom", "stores.html"], ["Contact Us", "contact.html"], ["Track your Order", "info.html?page=track"], ["Delivery Information", "info.html?page=delivery"], ["Returns", "info.html?page=returns"], ["Lifetime Exchange", "info.html?page=exchange"], ["Jewellery Guide", "info.html?page=size-guide"], ["Help & FAQs", "info.html?page=faqs"]])}
          </div>
        </div>
        <div class="container-wide footer-popular">
          <h3>Popular Searches</h3>
          <p>${popular.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</p>
        </div>
        <div class="container-wide footer-bottom">
          <p class="copyright">&copy; 2026 ${B.name}. All Rights Reserved.</p>
          <ul class="footer-legal">${linkList([["About Us", "about.html"], ["Blog", "info.html?page=blog"], ["Offers T&Cs", "info.html?page=offer-terms"], ["Privacy Policy", "info.html?page=privacy"], ["Cookie Policy", "info.html?page=cookies"], ["Terms & Conditions", "info.html?page=terms"]])}</ul>
          <div class="socials">
            <a href="${B.instagram}" aria-label="Instagram">${icon("instagram", 18)}</a>
            <a href="${B.facebook}" aria-label="Facebook">${icon("facebook", 18)}</a>
            <a href="${whatsappURL(`Hello ${B.name}`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("whatsapp", 18)}</a>
          </div>
        </div>
      </footer>`;
    $(".newsletter-form").addEventListener("submit", (event) => {
      event.preventDefault();
      event.target.reset();
      toast("Thank you for subscribing");
    });
  }

  function renderOverlays() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button class="livechat-tab" aria-label="Open live chat">${icon("chat", 14)} Chat</button>
      <button class="gift-fab" aria-label="Open rewards">${icon("gift", 20)}</button>
      <a class="wa-fab" href="${whatsappURL(`Hello ${B.name}, I have a jewellery enquiry.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp", 24)}<span>Chat with our experts</span></a>
      <div class="livechat-panel" hidden role="dialog" aria-label="Live chat">
        <div class="livechat-head"><b>How may we help?</b><button class="livechat-close" aria-label="Close chat">${icon("close", 16)}</button></div>
        <div class="livechat-body">
          <p class="bubble">Namaste! Welcome to ${B.name}. How can we assist you today?</p>
          <div class="chips">
            <a class="chip" href="${whatsappURL(`Hello ${B.name}, I would like to book a consultation.`)}" target="_blank" rel="noopener">Book a consultation</a>
            <a class="chip" href="stores.html">Visit the showroom</a>
            <a class="chip" href="info.html?page=track">Track my order</a>
            <a class="chip" href="info.html?page=size-guide">Size help</a>
          </div>
        </div>
        <form class="livechat-form"><input placeholder="Type a message" aria-label="Message"><button class="btn-primary">Send</button></form>
      </div>
      <div class="modal reward-modal" hidden role="dialog" aria-label="Reward offer">
        <div class="modal-card reward-card">
          <button class="modal-close" aria-label="Close">${icon("close", 18)}</button>
          <img class="reward-mark" src="images/brand/mark-gold.png" alt="">
          <p class="reward-kicker">A WELCOME FROM MAHAVEER</p>
          <h2>₹500 off your first piece</h2>
          <p>Register to receive your welcome privilege, early access to new collections and showroom invitations.</p>
          <form class="reward-form">
            <label class="pill-input"><span>+91</span><input type="tel" pattern="\\d{10}" placeholder="Mobile Number" required></label>
            <label class="pill-input"><span>${icon("user", 16)}</span><input placeholder="Full Name" required></label>
            <label class="pill-input"><span>${icon("pin", 16)}</span><input inputmode="numeric" pattern="\\d{6}" placeholder="Pincode" required></label>
            <button class="btn-gold block">Unlock My Privilege</button>
          </form>
          <small class="reward-note">*T&amp;C apply. Valid on first online purchase only.</small>
        </div>
      </div>
      <div class="modal signin-modal" hidden role="dialog" aria-label="Sign in">
        <div class="modal-card signin-card">
          <button class="modal-close" aria-label="Close">${icon("close", 18)}</button>
          <div class="signin-art"><img src="images/showroom/reception.jpg" alt="Inside the Mahaveer Jewellers showroom"></div>
          <div class="signin-body">
            <img class="signin-mark" src="images/brand/mark-gold.png" alt="">
            <form class="signin-form">
              <h2>Welcome to Mahaveer</h2>
              <p class="muted">Sign in to save your wishlist, track orders and book showroom appointments.</p>
              <ul class="signin-benefits">
                <li>${icon("sparkle", 10)} Early access to new collections</li>
                <li>${icon("sparkle", 10)} Personalised showroom appointments</li>
              </ul>
              <label>Phone Number<span class="pill-input light"><span>+91</span><input type="tel" pattern="\\d{10}" placeholder="00000 00000" required></span></label>
              <label class="check"><input type="checkbox" checked> Remember Me</label>
              <button class="btn-primary block">Continue</button>
              <p class="muted small">By continuing, I agree to the <a class="link" href="info.html?page=terms">Terms of use</a> and <a class="link" href="info.html?page=privacy">Privacy Notice</a></p>
            </form>
          </div>
        </div>
      </div>
      <div class="modal qv-modal" hidden role="dialog" aria-label="Quick view">
        <div class="modal-card qv-card">
          <button class="modal-close" aria-label="Close">${icon("close", 18)}</button>
          <div class="qv-body"></div>
        </div>
      </div>`;
    document.body.append(...wrap.children);

    const reward = $(".reward-modal");
    const signin = $(".signin-modal");
    const chat = $(".livechat-panel");
    $(".gift-fab").addEventListener("click", () => setModal(reward, true));
    $$(".modal").forEach((modal) => {
      $(".modal-close", modal).addEventListener("click", () => setModal(modal, false));
      modal.addEventListener("click", (event) => { if (event.target === modal) setModal(modal, false); });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") $$(".modal:not([hidden])").forEach((m) => setModal(m, false));
    });
    $(".reward-form").addEventListener("submit", (event) => {
      event.preventDefault();
      setModal(reward, false);
      toast("Privilege unlocked! Use code WELCOME500 at checkout");
    });
    $(".signin-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const phone = $("input[type=tel]", event.target).value.trim();
      store.setUser({ name: "Guest", contact: phone });
      setModal(signin, false);
      location.reload();
    });
    $(".livechat-tab").addEventListener("click", () => { chat.hidden = !chat.hidden; });
    $(".livechat-close").addEventListener("click", () => { chat.hidden = true; });
    $(".livechat-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("input", event.target);
      const text = input.value.trim();
      if (!text) return;
      const body = $(".livechat-body");
      body.insertAdjacentHTML("beforeend", `<p class="bubble me">${escapeHTML(text)}</p><p class="bubble">Thank you! For the quickest reply, please message us on <a class="link" href="${whatsappURL(text)}" target="_blank" rel="noopener">WhatsApp</a>.</p>`);
      body.scrollTop = body.scrollHeight;
      input.value = "";
    });

    if (document.body.classList.contains("home-page") && !store.user() && !sessionStorage.getItem("site.signin-shown")) {
      sessionStorage.setItem("site.signin-shown", "1");
      setTimeout(() => setModal(signin, true), 8000);
    }
  }

  const badgeFor = (p) => {
    if (p.tags.includes("new")) return `<span class="badge">New</span>`;
    if (p.discount) return `<span class="badge badge-offer">${p.discount}% Off</span>`;
    if (p.tags.includes("best")) return `<span class="badge badge-dark">Bestseller</span>`;
    return "";
  };

  function cardHTML(p) {
    const wished = store.isWished(p.id);
    const alt = p.images && p.images.length > 1 ? `<img class="p-alt" src="${imageFor(p, 1)}" alt="" loading="lazy">` : "";
    return `
      <article class="plp-card">
        <div class="plp-media ${mediaClass(p)}">
          <a href="${productURL(p.id)}" class="plp-img ${p.bg}" aria-label="${escapeHTML(p.name)}">
            <img src="${imageFor(p)}" alt="${escapeHTML(p.name)}" loading="lazy">${alt}
          </a>
          <div class="p-badges">${badgeFor(p)}</div>
          <button class="p-wish card-wish" data-id="${p.id}" aria-label="Add to wishlist" aria-pressed="${wished}">${icon(wished ? "heartFilled" : "heart", 18)}</button>
          <button class="p-quick quick-view" data-id="${p.id}">${icon("search", 14)} Quick View</button>
        </div>
        <div class="plp-meta">
          <p class="p-spec">${escapeHTML(specLine(p))}</p>
          <a href="${productURL(p.id)}" class="plp-name">${escapeHTML(p.name)}</a>
          ${p.description ? `<p class="plp-desc">${escapeHTML(p.description)}</p>` : ""}
          <p class="plp-price"><b>${formatINR(p.price)}</b>${p.mrp ? ` <s>${formatINR(p.mrp)}</s>` : ""}</p>
          <p class="stock">${p.stock === 1 ? "Only 1 left" : ""}</p>
          <div class="plp-actions">
            <button class="btn-bag add-to-bag" data-id="${p.id}">${icon("bag", 15)} Add to Bag</button>
            <a class="btn-view" href="${productURL(p.id)}">View</a>
          </div>
        </div>
      </article>`;
  }

  function quickViewHTML(p) {
    const cat = findCategory(p.cat);
    const wished = store.isWished(p.id);
    return `
      <div class="qv-media plp-media ${mediaClass(p)}">
        <div class="plp-img ${p.bg}"><img src="${imageFor(p)}" alt="${escapeHTML(p.name)}"></div>
      </div>
      <div class="qv-info">
        <p class="eyebrow">${escapeHTML(cat.name)} · ${escapeHTML(p.type)}</p>
        <h2>${escapeHTML(p.name)}</h2>
        <p class="p-spec">${escapeHTML(specLine(p))} · ${p.weight} g</p>
        <p class="qv-price">${formatINR(p.price)}${p.mrp ? ` <s>${formatINR(p.mrp)}</s> <em>${p.discount}% Off</em>` : ""}</p>
        <p class="muted small-note">Inclusive of all taxes · Price breakup on the product page</p>
        ${p.description ? `<p class="qv-desc">${escapeHTML(p.description)}</p>` : ""}
        ${cat.sizes ? `<p class="label">Choose Size</p><div class="chips qv-sizes">${cat.sizes.map((s, i) => `<button class="chip ${i === 0 ? "selected" : ""}" data-size="${escapeHTML(s)}">${escapeHTML(s)}</button>`).join("")}</div>` : ""}
        <div class="qv-actions">
          <button class="btn-primary qv-add" data-id="${p.id}">${icon("bag", 16)} Add to Bag</button>
          <button class="round-btn card-wish" data-id="${p.id}" aria-label="Add to wishlist" aria-pressed="${wished}">${icon(wished ? "heartFilled" : "heart", 18)}</button>
        </div>
        <div class="qv-links">
          <a class="btn-ghost" href="${productURL(p.id)}">View Full Details ${icon("arrowRight", 14)}</a>
          <a class="btn-ghost wa" href="${productEnquiry(p)}" target="_blank" rel="noopener">${icon("whatsapp", 16)} WhatsApp Enquiry</a>
        </div>
      </div>`;
  }

  function bindCardEvents() {
    document.addEventListener("click", (event) => {
      const add = event.target.closest(".add-to-bag[data-id]");
      if (add) {
        const p = findProduct(add.dataset.id);
        const cat = findCategory(p.cat);
        store.addToBag(p.id, cat.sizes ? cat.sizes[0] : null);
        return;
      }
      const wish = event.target.closest(".card-wish[data-id]");
      if (wish) {
        const on = store.toggleWish(wish.dataset.id);
        $$(`.card-wish[data-id="${wish.dataset.id}"]`).forEach((btn) => {
          btn.setAttribute("aria-pressed", String(on));
          btn.innerHTML = icon(on ? "heartFilled" : "heart", 18);
        });
        document.dispatchEvent(new CustomEvent("wishlist:change"));
        return;
      }
      const quick = event.target.closest(".quick-view[data-id]");
      if (quick) {
        const modal = $(".qv-modal");
        $(".qv-body", modal).innerHTML = quickViewHTML(findProduct(quick.dataset.id));
        setModal(modal, true);
        return;
      }
      const size = event.target.closest(".qv-sizes .chip");
      if (size) {
        $$(".qv-sizes .chip").forEach((c) => c.classList.toggle("selected", c === size));
        return;
      }
      const qvAdd = event.target.closest(".qv-add");
      if (qvAdd) {
        const selected = $(".qv-sizes .chip.selected");
        store.addToBag(qvAdd.dataset.id, selected ? selected.dataset.size : null);
        setModal($(".qv-modal"), false);
      }
    });
  }

  // Static pages mark brand details with data attributes so contact info lives only in SiteData.BRAND.
  function fillBrand() {
    $$("[data-brand]").forEach((el) => { el.textContent = B[el.dataset.brand] ?? ""; });
    $$("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 26); });
    $$("[data-href]").forEach((el) => {
      const kind = el.dataset.href;
      const hrefs = {
        map: mapURL(),
        phone: B.phoneHref,
        email: `mailto:${B.email}`,
        whatsapp: whatsappURL(el.dataset.message || `Hello ${B.name}`),
      };
      el.href = hrefs[kind] ?? "#";
      if (kind === "map" || kind === "whatsapp") {
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
  }

  function init() {
    renderHeader();
    renderFooter();
    renderOverlays();
    bindDrawers();
    bindCardEvents();
    updateCounts();
    fillBrand();
  }

  return { $, $$, D, B, icon, formatINR, escapeHTML, params, listingURL, productURL, findProduct, findCategory, imageFor, mediaClass, specLine, whatsappURL, mapURL, productEnquiry, store, toast, setDrawer, cardHTML, bindSearch, init, updateCounts };
})();
