(() => {
  const { $, $$, D, icon, params, formatINR, escapeHTML, listingURL, findProduct, findCategory, imageFor, mediaClass, specLine, productEnquiry, store, toast, setDrawer, cardHTML } = Site;
  Site.init();

  $$(".round-nav").forEach((btn) => { btn.innerHTML = icon(/prev/.test(btn.className) ? "arrowLeft" : "arrowRight", 18); });
  $(".share").innerHTML = icon("share", 16);
  $(".show-similar").innerHTML = `${icon("similar", 14)} Show Similar`;
  $(".fs-icon").innerHTML = icon("pin", 16);
  $(".vp-icon").innerHTML = icon("play", 28);

  const product = findProduct(params().get("id") || "") || null;
  const rail = (list) => list.map(cardHTML).join("");

  if (!product) {
    $(".not-found").hidden = false;
    $(".breadcrumb").innerHTML = `<li><a href="index.html">Home</a></li><li aria-current="page">Not found</li>`;
    $(".related-rail").innerHTML = rail(D.products.filter((p) => p.tags.includes("best")).slice(0, 8));
    return;
  }

  const category = findCategory(product.cat);
  document.title = `${product.name} | Mahaveer Jewellers`;
  store.pushRecent(product.id);

  $(".breadcrumb").innerHTML = [
    ["Home", "index.html"],
    [category.name, listingURL({ cat: category.slug })],
    [product.type, listingURL({ cat: category.slug, type: product.type })],
  ].map(([label, href]) => `<li><a href="${href}">${escapeHTML(label)}</a></li>`).join("") +
    `<li aria-current="page">${escapeHTML(product.name)}</li>`;

  $(".pdp").hidden = false;
  $(".sticky-bar").hidden = false;
  $(".eyebrow").textContent = `${product.metal} Jewellery · ${category.name}`;
  $(".product-name").textContent = product.name;
  $(".sku").textContent = `Design code ${product.id}${product.stock === 1 ? " · Only 1 left" : " · In stock"}`;
  $(".show-similar").href = listingURL({ cat: product.cat, type: product.type });
  $(".offer-tag").hidden = !product.discount;
  $(".offer-tag").textContent = product.discount ? `${product.discount}% OFF` : "";
  $$(".wa-enquiry").forEach((a) => { a.href = productEnquiry(product); });

  const netWeight = +(product.weight * (product.diamondCt ? 0.89 : 0.97)).toFixed(3);
  $(".metal").innerHTML = `<b>${escapeHTML(specLine(product))}</b> <small>Net weight ${netWeight} g</small>`;
  const specs = [
    product.diamondCt ? ["DIAMONDS", `Round · ${product.diamondCt} Ct`] : ["STONE", product.metal === "Gemstone" ? "Gemstone" : product.metal === "Pearl" ? "Pearl" : "None"],
    ["OCCASION", product.occasion],
    ["GROSS WEIGHT", `${product.weight}g`],
    ["GENDER", product.gender],
  ];
  $(".spec-grid").innerHTML = specs.map(([label, value]) => `<div><p class="label">${label}</p><p>${escapeHTML(value)}</p></div>`).join("");
  $(".pdp-desc").textContent = product.description;
  $(".pdp-highlights").innerHTML = product.highlights.map((h) => `<li>${escapeHTML(h)}</li>`).join("");

  const gst = product.price * 0.03 / 1.03;
  const beforeTax = product.price - gst;
  const stone = product.diamondCt ? beforeTax * 0.35 : 0;
  const making = beforeTax * 0.14;
  const metalValue = beforeTax - stone - making;
  $(".price").innerHTML = `${formatINR(product.price)}${product.mrp ? ` <s>${formatINR(product.mrp)}</s> <em>${product.discount}% Off</em>` : ""}`;
  $(".breakup").innerHTML = [
    [product.metal === "Silver" ? "Silver" : "Gold", metalValue],
    ...(stone ? [["Diamond", stone]] : []),
    ["Making Charges", making],
    ["GST (3%)", gst],
  ].map(([k, v]) => `<tr><td>${k}</td><td>${formatINR(v)}</td></tr>`).join("") +
    `<tr class="total"><td>Total</td><td>${formatINR(product.price)}</td></tr>`;

  const variant = { size: category.sizes ? category.sizes[0] : null, weight: `${product.weight} g` };
  const renderChips = (group, values) => {
    $(`.chips[data-group="${group}"]`).innerHTML = values.map((v) => `<button class="chip ${v === variant[group] ? "selected" : ""}">${escapeHTML(v)}</button>`).join("");
  };
  $(".size-option").hidden = !category.sizes;
  if (category.sizes) renderChips("size", category.sizes);
  renderChips("weight", [variant.weight]);
  const updateSticky = () => {
    $(".sticky-variant").textContent = [variant.size, variant.weight].filter(Boolean).join(" · ");
  };
  $(".sticky-name").textContent = product.name;
  $(".sticky-price").textContent = formatINR(product.price);
  updateSticky();

  $$(".chips").forEach((group) => {
    group.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      $$(".chip", group).forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      variant[group.dataset.group] = chip.textContent.trim();
      updateSticky();
    });
  });

  const hasPhotos = product.images && product.images.length > 0;
  const photoCount = hasPhotos ? product.images.length : 4;
  const uniqueSlides = Array.from({ length: photoCount }, (_, i) => ({ image: imageFor(product, i), bg: hasPhotos ? "bg-photo" : ["bg-1", "bg-2", "bg-3", "bg-4"][i % 4] }));
  uniqueSlides.splice(1, 0, { video: true, bg: "bg-video" });
  const mainImage = $(".main-image");
  mainImage.classList.add(...mediaClass(product).split(" "));
  const mainImg = $("img", mainImage);
  mainImg.alt = product.name;
  $(".thumbs").innerHTML = uniqueSlides
    .map((s, i) => `<button class="thumb ${s.video ? "video" : s.bg} ${i === 0 ? "active" : ""}" data-index="${i}" style="background-image:${s.video ? "none" : `url(${s.image})`}" aria-label="${s.video ? "Product video" : `Image ${i + 1}`}">${s.video ? icon("play", 14) : ""}</button>`)
    .join("");
  let current = 0;
  const show = (index) => {
    current = (index + uniqueSlides.length) % uniqueSlides.length;
    const slide = uniqueSlides[current];
    mainImage.classList.remove("bg-1", "bg-2", "bg-3", "bg-4", "bg-video", "bg-photo");
    mainImage.classList.add(slide.bg);
    if (!slide.video) mainImg.src = slide.image;
    mainImg.hidden = Boolean(slide.video);
    $(".video-placeholder").hidden = !slide.video;
    $$(".thumb").forEach((t, i) => t.classList.toggle("active", i === current));
  };
  show(0);
  $(".thumbs").addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (thumb) show(Number(thumb.dataset.index));
  });
  $(".gallery-prev").addEventListener("click", () => show(current - 1));
  $(".gallery-next").addEventListener("click", () => show(current + 1));
  let touchX = null;
  mainImage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  mainImage.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  const wish = $(".wish");
  const paintWish = () => {
    const on = store.isWished(product.id);
    wish.setAttribute("aria-pressed", String(on));
    wish.innerHTML = icon(on ? "heartFilled" : "heart", 16);
  };
  paintWish();
  wish.addEventListener("click", () => {
    store.toggleWish(product.id);
    paintWish();
  });

  $(".share").addEventListener("click", async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(location.href).catch(() => {});
    toast("Link copied");
  });

  const breakupToggle = $(".breakup-toggle");
  breakupToggle.addEventListener("click", () => {
    const expanded = breakupToggle.getAttribute("aria-expanded") !== "true";
    breakupToggle.setAttribute("aria-expanded", String(expanded));
    $(".breakup").hidden = !expanded;
  });

  $(".coupon-track").innerHTML = D.OFFERS
    .map((o) => `<div class="coupon"><small>${o.code}</small><b>${escapeHTML(o.title)}</b><a class="link" href="offers.html">View Details</a></div>`)
    .join("");
  const track = $(".coupon-track");
  $(".coupon-carousel .prev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.7, behavior: "smooth" }));
  $(".coupon-carousel .next").addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.7, behavior: "smooth" }));

  const details = [
    ["Product Code", product.id],
    ["Category", category.name],
    ["Type", product.type],
    ["Metal", product.metal],
    ["Karatage", product.metal === "Silver" ? "925 Sterling" : `${product.karat}K`],
    ["Net Weight", `${netWeight} g`],
    ["Gross Weight", `${product.weight} g`],
    ...(product.diamondCt ? [["Diamond Clarity", "SI"], ["Diamond Colour", "GH"], ["Diamond Weight", `${product.diamondCt} Ct`], ["Diamond Setting", product.setting]] : []),
    ["Finish", product.finish],
    ["Hallmark", product.metal === "Silver" ? "925 Sterling" : "BIS Hallmarked with HUID"],
    ["Certification", product.diamondCt ? "Certificate of authenticity included" : "Hallmark certificate"],
    ["Occasion", product.occasion],
    ["Gender", product.gender],
    ...(product.collection ? [["Collection", D.COLLECTIONS.find((c) => c.slug === product.collection).name]] : []),
  ];
  $(".detail-desc").textContent = product.description;
  $(".detail-list").innerHTML = details.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHTML(v)}</dd>`).join("") +
    `<dt>Care</dt><dd>${escapeHTML(product.care)}</dd>`;
  const detailsDrawer = $(".details-drawer");
  $(".open-details").addEventListener("click", () => setDrawer(detailsDrawer, true));

  $$(".add-bag").forEach((btn) => btn.addEventListener("click", () => store.addToBag(product.id, variant.size)));
  $$(".buy-now").forEach((btn) => btn.addEventListener("click", () => {
    store.addToBag(product.id, variant.size);
    location.href = "cart.html";
  }));

  const stickyBar = $(".sticky-bar");
  new IntersectionObserver(([entry]) => {
    stickyBar.classList.toggle("show", !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }).observe($(".buy-actions"));

  $(".reviews").hidden = false;
  const reviewTrack = $(".review-track");
  reviewTrack.innerHTML = D.TESTIMONIALS.map((t) => `
    <figure class="review-card">
      <span class="t-quote">${icon("quote", 20)}</span>
      <div class="stars">${icon("star", 14).repeat(5)}</div>
      <blockquote class="clamp">${escapeHTML(t.text)}</blockquote>
      <button class="link read-more">Read more</button>
      <figcaption><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.city)} · ${escapeHTML(t.date)}</small></figcaption>
    </figure>`).join("");
  reviewTrack.addEventListener("click", (event) => {
    const btn = event.target.closest(".read-more");
    if (!btn) return;
    const quote = btn.previousElementSibling;
    const expanded = quote.classList.toggle("clamp");
    btn.textContent = expanded ? "Read more" : "Read less";
  });
  $(".review-prev").addEventListener("click", () => reviewTrack.scrollBy({ left: -reviewTrack.clientWidth * 0.8, behavior: "smooth" }));
  $(".review-next").addEventListener("click", () => reviewTrack.scrollBy({ left: reviewTrack.clientWidth * 0.8, behavior: "smooth" }));

  $(".find-store").hidden = false;
  $(".find-store-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const q = $("input", event.target).value.trim().toLowerCase();
    const matches = D.STORES.filter((s) => !q || `${s.city} ${s.name} ${s.address}`.toLowerCase().includes(q)).slice(0, 3);
    $(".find-store-results").innerHTML = matches.length
      ? matches.map((s) => `<div class="fs-store"><b>${escapeHTML(s.name)}, ${escapeHTML(s.city)}</b><small>${escapeHTML(s.address)}</small><span class="in-stock">Available in store</span></div>`).join("") + `<a class="link" href="stores.html">View all stores</a>`
      : `<p class="muted">No stores found. <a class="link" href="stores.html">Browse all stores</a></p>`;
  });

  $(".related-rail").innerHTML = rail(D.products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 10));
  const recent = store.recent().filter((id) => id !== product.id).map(findProduct).filter(Boolean);
  $(".recent-section").hidden = recent.length === 0;
  $(".recent-rail").innerHTML = rail(recent);
})();
