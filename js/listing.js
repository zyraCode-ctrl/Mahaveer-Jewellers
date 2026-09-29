(() => {
  const { $, $$, D, B, icon, params, listingURL, findCategory, cardHTML, setDrawer, escapeHTML, whatsappURL } = Site;
  Site.init();

  const consultTile = `
    <aside class="plp-consult">
      <img src="images/showroom/consultant-welcome.jpg" alt="" loading="lazy">
      <div>
        <p class="kicker">Need help choosing?</p>
        <h3>Book a personal consultation</h3>
        <p>Our consultants will curate designs to your taste, size and budget, in store or on a video call.</p>
        <a class="btn-gold" href="${whatsappURL(`Hello ${B.name}, I would like help choosing jewellery.`)}" target="_blank" rel="noopener">${icon("whatsapp", 16)} WhatsApp Us</a>
        <a class="btn-text-light" href="stores.html">Visit Our Showroom <span aria-hidden="true">&rarr;</span></a>
      </div>
    </aside>`;

  const PAGE_SIZE = 12;
  const FACETS = [
    { key: "type", label: "Product Type" },
    { key: "metal", label: "Metal" },
    { key: "karat", label: "Karatage", format: (v) => `${v}kt` },
    { key: "occasion", label: "Occasion" },
    { key: "gender", label: "Gender" },
    { key: "price", label: "Price" },
  ];

  const p = params();
  const scope = {
    cat: p.get("cat"),
    collection: p.get("collection"),
    gifting: p.get("gifting"),
    tag: p.get("tag"),
    q: (p.get("q") || "").trim(),
  };
  const filters = Object.fromEntries(FACETS.map((f) => [f.key, p.getAll(f.key)]));
  let sort = p.get("sort") || "featured";
  let visible = PAGE_SIZE;

  const category = scope.cat && findCategory(scope.cat);
  const collection = scope.collection && D.COLLECTIONS.find((c) => c.slug === scope.collection);
  const gifting = scope.gifting && (scope.gifting === "all" ? { name: "Gifting" } : D.GIFTING.find((g) => g.slug === scope.gifting));

  const title =
    scope.q ? `Results for "${scope.q}"` :
    category ? category.name :
    collection ? collection.name :
    gifting ? (scope.gifting === "all" ? "Gifting" : `${gifting.name} Gifts`) :
    scope.tag ? D.TAGS[scope.tag] :
    filters.metal.length === 1 ? `${filters.metal[0]} Jewellery` :
    "All Jewellery";
  $(".plp-title").textContent = title;
  document.title = `${title} | Mahaveer Jewellers`;
  $(".plp-sub").textContent =
    collection ? collection.blurb :
    category ? `Explore ${category.name.toLowerCase()} in hallmarked gold, certified diamonds and more.` :
    gifting ? "Thoughtful jewellery for every milestone, gift-wrapped by our showroom." :
    "Fine gold, diamond and bridal jewellery, available online and at our showroom.";

  const crumbs = [["Home", "index.html"]];
  if (collection) crumbs.push(["Collections", "collections.html"]);
  if (gifting && scope.gifting !== "all") crumbs.push(["Gifting", listingURL({ gifting: "all" })]);
  if (category && filters.type.length === 1) crumbs.push([category.name, listingURL({ cat: category.slug })]);
  $(".breadcrumb").innerHTML =
    crumbs.map(([label, href]) => `<li><a href="${href}">${escapeHTML(label)}</a></li>`).join("") +
    `<li aria-current="page">${escapeHTML(category && filters.type.length === 1 ? filters.type[0] : title)}</li>`;

  const inScope = D.products.filter((prod) => {
    if (scope.cat && prod.cat !== scope.cat) return false;
    if (scope.collection && prod.collection !== scope.collection) return false;
    if (scope.gifting && (scope.gifting === "all" ? !prod.gifting : prod.gifting !== scope.gifting)) return false;
    if (scope.tag && !prod.tags.includes(scope.tag)) return false;
    if (scope.q) {
      const hay = `${prod.name} ${prod.id} ${prod.type} ${prod.metal} ${findCategory(prod.cat).name}`.toLowerCase();
      if (!scope.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });

  const inPriceBand = (price, band) => {
    const [min, max] = band.split("-").map(Number);
    return price >= min && price < max;
  };
  const matchesFacet = (prod, key, values) => {
    if (!values.length) return true;
    if (key === "price") return values.some((band) => inPriceBand(prod.price, band));
    return values.includes(prod[key]);
  };
  const matchesAll = (prod, except) => FACETS.every((f) => f.key === except || matchesFacet(prod, f.key, filters[f.key]));

  function sorted(list) {
    switch (sort) {
      case "low": return [...list].sort((a, b) => a.price - b.price);
      case "high": return [...list].sort((a, b) => b.price - a.price);
      case "new": return [...list].sort((a, b) => b.created - a.created);
      case "discount": return [...list].sort((a, b) => b.discount - a.discount);
      case "featured": return list;
      default: return list;
    }
  }

  function facetOptions(key) {
    if (key === "price") return D.PRICE_BANDS.map((b) => ({ value: b.value, label: b.label }));
    const values = [...new Set(inScope.map((prod) => prod[key]))].sort();
    const facet = FACETS.find((f) => f.key === key);
    return values.map((v) => ({ value: v, label: facet.format ? facet.format(v) : v }));
  }

  function renderQuickFilters() {
    const key = category ? "type" : "metal";
    const options = facetOptions(key).filter((o) => inScope.some((prod) => matchesFacet(prod, key, [o.value])));
    $(".quick-filters").innerHTML = options
      .map((o) => `<button class="qf ${filters[key].includes(o.value) ? "active" : ""}" data-key="${key}" data-value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</button>`)
      .join("");
  }

  function renderFilterForm() {
    $(".filter-form").innerHTML = FACETS.map((facet) => {
      const options = facetOptions(facet.key)
        .map((o) => ({ ...o, count: inScope.filter((prod) => matchesAll(prod, facet.key) && matchesFacet(prod, facet.key, [o.value])).length }))
        .filter((o) => o.count > 0 || filters[facet.key].includes(o.value));
      if (options.length < 2 && !filters[facet.key].length) return "";
      return `<fieldset><legend>${facet.label}</legend>${options
        .map((o) => `<label><input type="checkbox" name="${facet.key}" value="${escapeHTML(o.value)}" ${filters[facet.key].includes(o.value) ? "checked" : ""}> ${escapeHTML(o.label)} <small>(${o.count})</small></label>`)
        .join("")}</fieldset>`;
    }).join("");
  }

  function renderActiveFilters() {
    const chips = FACETS.flatMap((facet) => filters[facet.key].map((value) => {
      const label = facet.key === "price" ? D.PRICE_BANDS.find((b) => b.value === value)?.label ?? value : facet.format ? facet.format(value) : value;
      return `<button class="active-chip" data-key="${facet.key}" data-value="${escapeHTML(value)}">${escapeHTML(label)} &times;</button>`;
    }));
    $(".active-filters").innerHTML = chips.join("");
    const total = chips.length;
    $(".filter-count").textContent = total ? `(${total})` : "";
  }

  function syncURL() {
    const next = new URLSearchParams();
    Object.entries(scope).forEach(([k, v]) => { if (v) next.set(k, v); });
    Object.entries(filters).forEach(([k, values]) => values.forEach((v) => next.append(k, v)));
    if (sort !== "featured") next.set("sort", sort);
    history.replaceState(null, "", `listing.html?${next}`);
  }

  function render() {
    const list = sorted(inScope.filter((prod) => matchesAll(prod)));
    $(".count").textContent = `${list.length} ${list.length === 1 ? "Design" : "Designs"}`;
    const cards = list.slice(0, visible).map(cardHTML);
    if (cards.length > 6) cards.splice(6, 0, consultTile);
    $(".plp-grid").innerHTML = cards.join("");
    $(".empty").hidden = list.length > 0;
    $(".load-more-wrap").hidden = visible >= list.length;
    renderQuickFilters();
    renderActiveFilters();
    syncURL();
  }

  const clearAll = () => {
    FACETS.forEach((f) => { filters[f.key] = []; });
    visible = PAGE_SIZE;
    render();
  };

  $(".quick-filters").addEventListener("click", (event) => {
    const btn = event.target.closest(".qf");
    if (!btn) return;
    const { key, value } = btn.dataset;
    filters[key] = filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value];
    visible = PAGE_SIZE;
    render();
  });

  $(".active-filters").addEventListener("click", (event) => {
    const chip = event.target.closest(".active-chip");
    if (!chip) return;
    filters[chip.dataset.key] = filters[chip.dataset.key].filter((v) => v !== chip.dataset.value);
    render();
  });

  $(".load-more").addEventListener("click", () => {
    visible += PAGE_SIZE;
    render();
  });

  const sortDrawer = $(".sort-drawer");
  const filterDrawer = $(".filter-drawer");
  $(`.sort-options input[value="${sort}"]`)?.setAttribute("checked", "");
  $(".open-sort").addEventListener("click", () => setDrawer(sortDrawer, true));
  $(".open-filters").addEventListener("click", () => {
    renderFilterForm();
    setDrawer(filterDrawer, true);
  });
  $(".sort-options").addEventListener("change", (event) => {
    sort = event.target.value;
    render();
    setDrawer(sortDrawer, false);
  });
  $(".apply-filters").addEventListener("click", () => {
    FACETS.forEach((f) => { filters[f.key] = $$(`input[name="${f.key}"]:checked`, $(".filter-form")).map((i) => i.value); });
    visible = PAGE_SIZE;
    render();
    setDrawer(filterDrawer, false);
  });
  $(".clear-filters").addEventListener("click", () => {
    clearAll();
    setDrawer(filterDrawer, false);
  });
  $(".clear-all-inline").addEventListener("click", (event) => {
    event.preventDefault();
    clearAll();
  });

  render();
})();
