(() => {
  const { $, $$, D, params, formatINR, escapeHTML, listingURL, productURL, findProduct, findCategory, imageFor, mediaClass, mapURL, store, toast, cardHTML, bindSearch } = Site;
  Site.init();

  const page = document.body.dataset.page;

  const pages = {
    collections() {
      $(".collection-grid").innerHTML = D.COLLECTIONS.map((c) => {
        const count = D.products.filter((p) => p.collection === c.slug).length;
        return `
          <a class="collection-card tone-${c.tone}" href="${listingURL({ collection: c.slug })}">
            <span class="cc-art"><img src="assets/${c.art}.svg" alt="" loading="lazy"></span>
            <span class="cc-copy"><b>${escapeHTML(c.name)}</b><small>${escapeHTML(c.blurb)}</small><em>${count} designs &rarr;</em></span>
          </a>`;
      }).join("");
    },

    search() {
      const form = $(".search-page-form");
      bindSearch(form);
      $("input", form).focus();
      const trending = ["Diamond Earrings", "Mangalsutra", "Gold Chain", "Couple Bands", "Stud", "Bangle"];
      $(".trending").innerHTML = trending.map((t) => `<a class="qf" href="${listingURL({ q: t })}">${escapeHTML(t)}</a>`).join("");
      $(".search-cats").innerHTML = D.CATEGORIES.map((c) => {
        const p = D.products.find((x) => x.cat === c.slug && x.images && x.images.length) || D.products.find((x) => x.cat === c.slug);
        return `<a class="cat-tile" href="${listingURL({ cat: c.slug })}"><span class="cat-photo plp-media ${p ? mediaClass(p) : "is-art"}"><img src="${p ? imageFor(p) : `assets/${c.icon}.svg`}" alt=""></span><b>${escapeHTML(c.name)}</b></a>`;
      }).join("");
      const recent = store.recent().map(findProduct).filter(Boolean);
      $(".recent-block").hidden = recent.length === 0;
      $(".recent-rail").innerHTML = recent.map(cardHTML).join("");
    },

    wishlist() {
      const render = () => {
        const items = store.wish().map(findProduct).filter(Boolean);
        $(".count").textContent = `${items.length} ${items.length === 1 ? "Item" : "Items"}`;
        $(".plp-grid").innerHTML = items.map(cardHTML).join("");
        $(".empty-state").hidden = items.length > 0;
      };
      render();
      document.addEventListener("wishlist:change", render);
    },

    cart() {
      let applied = null;
      const render = () => {
        const bag = store.bag();
        const lines = bag.map((line) => ({ ...line, product: findProduct(line.id) })).filter((l) => l.product);
        $(".empty-state").hidden = lines.length > 0;
        $(".cart-layout").hidden = lines.length === 0;
        const itemCount = lines.reduce((s, l) => s + l.qty, 0);
        $(".count").textContent = `${itemCount} ${itemCount === 1 ? "Item" : "Items"}`;
        $(".cart-items").innerHTML = lines.map((l, index) => `
          <article class="cart-line card" data-index="${index}">
            <a class="cart-thumb ${l.product.bg} ${mediaClass(l.product)}" href="${productURL(l.product.id)}"><img src="${imageFor(l.product)}" alt=""></a>
            <div class="cart-info">
              <a href="${productURL(l.product.id)}" class="cart-name">${escapeHTML(l.product.name)}</a>
              <p class="muted">${escapeHTML(l.product.id)}${l.size ? ` · Size ${escapeHTML(l.size)}` : ""} · ${l.product.weight} g</p>
              <p class="cart-price">${formatINR(l.product.price * l.qty)}</p>
              <div class="cart-controls">
                <div class="qty"><button class="qty-dec" aria-label="Decrease quantity">&minus;</button><span>${l.qty}</span><button class="qty-inc" aria-label="Increase quantity">+</button></div>
                <button class="link move-wish">Move to Wishlist</button>
                <button class="link remove-line">Remove</button>
              </div>
            </div>
          </article>`).join("");
        const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
        const offer = applied && subtotal >= applied.min ? applied : null;
        if (applied && !offer) {
          toast(`Minimum order ${formatINR(applied.min)} for ${applied.code}`);
          applied = null;
        }
        const discount = offer ? (offer.type === "flat" ? offer.value : subtotal * offer.value / 100) : 0;
        $(".summary").innerHTML = `
          <div><span>Subtotal</span><span>${formatINR(subtotal)}</span></div>
          <div><span>Coupon Discount</span><span>${discount ? `- ${formatINR(discount)}` : formatINR(0)}</span></div>
          <div><span>Delivery</span><span>Free</span></div>
          <div class="total"><span>Total</span><span>${formatINR(subtotal - discount)}</span></div>`;
        $(".applied-coupon").textContent = offer ? `${offer.code} applied` : "";
      };
      render();

      $(".cart-items").addEventListener("click", (event) => {
        const line = event.target.closest(".cart-line");
        if (!line) return;
        const bag = store.bag();
        const index = Number(line.dataset.index);
        if (event.target.closest(".qty-inc")) bag[index].qty += 1;
        else if (event.target.closest(".qty-dec")) bag[index].qty = Math.max(1, bag[index].qty - 1);
        else if (event.target.closest(".remove-line")) bag.splice(index, 1);
        else if (event.target.closest(".move-wish")) {
          if (!store.isWished(bag[index].id)) store.toggleWish(bag[index].id);
          bag.splice(index, 1);
        } else return;
        store.setBag(bag);
        render();
      });

      $(".coupon-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const code = $(".coupon-form input").value.trim().toUpperCase();
        applied = D.OFFERS.find((o) => o.code === code) || null;
        if (!applied) toast("Invalid coupon code");
        render();
      });
      $(".coupon-list").innerHTML = D.OFFERS.map((o) => `<button class="chip coupon-chip" data-code="${o.code}">${o.code}</button>`).join("");
      $(".coupon-list").addEventListener("click", (event) => {
        const chip = event.target.closest(".coupon-chip");
        if (!chip) return;
        $(".coupon-form input").value = chip.dataset.code;
        $(".coupon-form").requestSubmit();
      });
      $(".checkout").addEventListener("click", () => toast("Checkout is not available in this local version"));
    },

    login() {
      if (store.user()) {
        location.replace("account.html");
        return;
      }
      const stepOne = $(".login-step-1");
      const stepTwo = $(".login-step-2");
      let contact = "";
      $$(".login-tabs .tab").forEach((tab) => tab.addEventListener("click", () => {
        $$(".login-tabs .tab").forEach((t) => t.classList.toggle("active", t === tab));
        const email = tab.dataset.mode === "email";
        const input = $(".contact-input");
        input.type = email ? "email" : "tel";
        input.placeholder = email ? "Enter email address" : "Enter 10-digit mobile number";
        input.value = "";
      }));
      stepOne.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = $(".contact-input");
        const value = input.value.trim();
        const valid = input.type === "email" ? /\S+@\S+\.\S+/.test(value) : /^\d{10}$/.test(value);
        if (!valid) {
          toast(input.type === "email" ? "Enter a valid email" : "Enter a valid 10-digit number");
          return;
        }
        contact = value;
        $(".otp-target").textContent = value;
        stepOne.hidden = true;
        stepTwo.hidden = false;
        $(".otp-input").focus();
      });
      stepTwo.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!/^\d{6}$/.test($(".otp-input").value.trim())) {
          toast("Enter the 6-digit OTP (any digits work locally)");
          return;
        }
        store.setUser({ name: $(".name-input").value.trim() || "Guest", contact });
        location.href = "account.html";
      });
      $(".change-contact").addEventListener("click", () => {
        stepTwo.hidden = true;
        stepOne.hidden = false;
      });
    },

    account() {
      const user = store.user();
      if (!user) {
        location.replace("login.html");
        return;
      }
      $(".account-name").textContent = user.name;
      $(".account-contact").textContent = user.contact;
      $(".stat-bag").textContent = store.bag().reduce((s, l) => s + l.qty, 0);
      $(".stat-wish").textContent = store.wish().length;
      $(".logout").addEventListener("click", () => {
        localStorage.removeItem("site.user");
        location.href = "index.html";
      });
    },

    stores() {
      const cities = [...new Set(D.STORES.map((s) => s.city))];
      $(".city-select").innerHTML = `<option value="">All Cities</option>${cities.map((c) => `<option>${c}</option>`).join("")}`;
      $(".store-filters").hidden = D.STORES.length < 2;
      const render = () => {
        const city = $(".city-select").value;
        const q = $(".store-search").value.trim().toLowerCase();
        const list = D.STORES.filter((s) => (!city || s.city === city) && (!q || `${s.city} ${s.name} ${s.address}`.toLowerCase().includes(q)));
        $(".store-count").textContent = D.STORES.length < 2 ? "" : `${list.length} showrooms found`;
        $(".store-list").innerHTML = list.map((s) => `
          <article class="store-card">
            ${s.image ? `<img src="${s.image}" alt="${escapeHTML(s.name)}" loading="lazy">` : ""}
            <div class="store-card-body">
              <p class="kicker">${escapeHTML(s.city)}</p>
              <h3>${escapeHTML(s.name)}</h3>
              <p>${escapeHTML(s.address)}</p>
              <p class="muted">${escapeHTML(s.phone)} · ${escapeHTML(s.hours)}</p>
              <a class="link-arrow" href="${s.address === D.BRAND.address ? mapURL() : `https://www.google.com/maps/search/${encodeURIComponent(s.address)}`}" target="_blank" rel="noopener">Get Directions</a>
            </div>
          </article>`).join("") || `<p class="muted">No showrooms match your search.</p>`;
      };
      render();
      $(".city-select").addEventListener("change", render);
      $(".store-search").addEventListener("input", render);
    },

    offers() {
      $(".offer-grid").innerHTML = D.OFFERS.map((o) => `
        <article class="coupon offer-card">
          <small>USE CODE</small><b>${escapeHTML(o.title)}</b>
          <p>${escapeHTML(o.detail)}. Minimum order ${formatINR(o.min)}.</p>
          <button class="btn-light copy-code" data-code="${o.code}">${o.code} &#10697;</button>
        </article>`).join("");
      $(".offer-grid").addEventListener("click", async (event) => {
        const btn = event.target.closest(".copy-code");
        if (!btn) return;
        await navigator.clipboard?.writeText(btn.dataset.code).catch(() => {});
        toast(`Copied ${btn.dataset.code}`);
      });
      $(".offer-rail").innerHTML = D.products.filter((p) => p.discount).slice(0, 12).map(cardHTML).join("");
    },

    "gold-rate"() {
      $(".rate-table tbody").innerHTML = D.GOLD_RATES.map((r) => `<tr><td>${r.karat}</td><td>${formatINR(r.perGram)}</td><td>${formatINR(r.perGram * 10)}</td></tr>`).join("");
      $(".rate-date").textContent = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    },

    contact() {
      $(".contact-form").addEventListener("submit", (event) => {
        event.preventDefault();
        event.target.reset();
        toast("Thanks! We'll get back to you soon.");
      });
    },

    info() {
      const key = params().get("page") || "faqs";
      const content = window.InfoPages[key] || window.InfoPages.faqs;
      document.title = `${content.title} | Mahaveer Jewellers`;
      $(".info-title").textContent = content.title;
      $(".breadcrumb [aria-current]").textContent = content.title;
      $(".info-body").innerHTML = content.html;
      $$(".info-nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `info.html?page=${key}`));
      $(".track-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        $(".track-result").hidden = false;
      });
    },
  };

  pages[page]?.();
})();
