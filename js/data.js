window.SiteData = (() => {
  // Showroom and contact details used across the site. Replace the placeholder values before publishing.
  const BRAND = {
    name: "Mahaveer Jewellers",
    tagline: "Fine Gold, Diamond & Bridal Jewellery",
    phone: "+91 98255 46207",
    phoneHref: "tel:+919825546207",
    whatsapp: "919825546207",
    email: "mahaveerjewellers508@gmail.com",
    address: "177 - 178 Maruti Dham Row-House, Near Community Hall, Sarthana Jakat Naka, Surat, Gujarat 395006",
    hours: "10:30 AM – 8:30 PM, Monday to Sunday",
    mapURL: "https://maps.app.goo.gl/bT5ye1QQzLwgqFcm7",
    instagram: "https://www.instagram.com/mahaveer__jewellers/",
    // Reel links (e.g. "https://www.instagram.com/reel/XXXXXXXXX/") shown with Instagram's official
    // embed when the server feed (INSTAGRAM_ACCESS_TOKEN in .env) is not connected.
    instagramReels: [],
    facebook: "#",
  };

  const CATEGORIES = [
    { slug: "earrings", name: "Earrings", icon: "earring", types: ["Stud", "Drop", "Hoop", "Ear Cuff"], sizes: null, source: "earrings", typeRules: [[/cuff/i, "Ear Cuff"], [/hoop/i, "Hoop"], [/drop/i, "Drop"], [/./, "Stud"]] },
    { slug: "rings", name: "Rings", icon: "ring", types: ["Cocktail", "Engagement", "Solitaire", "Open", "Couple Bands", "Vanki"], sizes: ["10", "12", "14", "16"], source: "rings" },
    { slug: "bracelets-bangles", name: "Bracelets & Bangles", icon: "bracelet", types: ["Bracelet", "Bangle"], sizes: ["2.4", "2.6", "2.8"], source: "bracelets", typeRules: [[/bangle/i, "Bangle"], [/./, "Bracelet"]] },
    { slug: "necklaces-pendants", name: "Necklaces & Pendants", icon: "necklace", types: ["Necklace", "Pendant"], sizes: ["16 INCHES", "18 INCHES"], source: "necklaces", typeRules: [[/pendant/i, "Pendant"], [/./, "Necklace"]] },
    { slug: "mangalsutra", name: "Mangalsutra", icon: "necklace", types: ["Classic", "Modern", "Floral", "Vati"], sizes: ["16 INCHES", "18 INCHES"], source: "mangalsutra", typeRules: [[/vati/i, "Vati"], [/floral|blossom|sunflower|leaves/i, "Floral"], [/\d+ kt/i, "Modern"], [/./, "Classic"]] },
    { slug: "silver", name: "Silver Jewellery", icon: "earring", types: ["Earrings", "Rings", "Pendants", "Bracelets", "Toe Rings"], sizes: null, silverOnly: true, source: "silver", typeRules: [[/earring/i, "Earrings"], [/toe ring/i, "Toe Rings"], [/ring/i, "Rings"], [/bangle|bracelet/i, "Bracelets"], [/./, "Pendants"]] },
    { slug: "more", name: "More Jewellery", icon: "coin", types: ["Silver Coin", "Nose Pin"], sizes: null, source: "more", typeRules: [[/coin/i, "Silver Coin"], [/./, "Nose Pin"]] },
  ];

  const METALS = ["Diamond", "Plain Gold", "Gemstone", "Pearl", "Rose Gold"];
  const KARATS = ["9", "14", "18", "22"];
  const OCCASIONS = ["Everyday", "Workwear", "Party"];
  const GENDERS = ["Women", "Men", "Kids", "Unisex"];
  const TAGS = { new: "New Arrivals", best: "Best Sellers", gifted: "Most Gifted" };
  const PRICE_BANDS = [
    { value: "0-10000", label: "Under ₹10K" },
    { value: "10000-20000", label: "₹10K - ₹20K" },
    { value: "20000-30000", label: "₹20K - ₹30K" },
    { value: "30000-50000", label: "₹30K - ₹50K" },
    { value: "50000-100000", label: "₹50K - ₹1L" },
    { value: "100000-99999999", label: "Above ₹1L" },
  ];

  const COLLECTIONS = [
    { slug: "vivaah", name: "Vivaah Bridal", blurb: "Heirloom sets for the wedding day", bg: "bg-4", art: "necklace", tone: "maroon" },
    { slug: "polki-heritage", name: "Polki Heritage", blurb: "Uncut diamonds in royal settings", bg: "bg-2", art: "earring", tone: "ivory" },
    { slug: "temple-gold", name: "Temple Gold", blurb: "Sacred motifs in 22kt gold", bg: "bg-2", art: "coin", tone: "black" },
    { slug: "solitaire", name: "Solitaire Edit", blurb: "Brilliant diamonds, timeless cuts", bg: "bg-3", art: "ring", tone: "ivory" },
    { slug: "everyday-diamonds", name: "Everyday Diamonds", blurb: "Light sparkle for daily wear", bg: "bg-1", art: "stud", tone: "champagne" },
    { slug: "kundan-royale", name: "Kundan Royale", blurb: "Jewel-toned craft from royal courts", bg: "bg-4", art: "bangle", tone: "maroon" },
    { slug: "minimal-gold", name: "Minimal Gold", blurb: "Clean lines for work and weekend", bg: "bg-1", art: "pendant", tone: "ivory" },
    { slug: "petite-treasures", name: "Petite Treasures", blurb: "Delicate gifts for every milestone", bg: "bg-3", art: "nosepin", tone: "black" },
  ];

  const ART = {
    Stud: "stud", Drop: "earring", Hoop: "hoop", "Ear Cuff": "earring",
    Cocktail: "ring", Engagement: "ring", Solitaire: "ring", Open: "ring", "Couple Bands": "band", Vanki: "band",
    Bracelet: "bracelet", Bangle: "bangle", Necklace: "necklace", Pendant: "pendant",
    Classic: "mangalsutra", Modern: "mangalsutra", Floral: "mangalsutra", Vati: "mangalsutra",
    Earrings: "stud", Rings: "ring", Pendants: "pendant", Bracelets: "bracelet", "Toe Rings": "band",
    "Silver Coin": "coin", "Nose Pin": "nosepin",
  };

  const GIFTING = [
    { slug: "birthday", name: "Birthday" },
    { slug: "anniversary", name: "Anniversary" },
    { slug: "engagement", name: "Engagement" },
    { slug: "wedding", name: "Wedding" },
    { slug: "festive", name: "Festive" },
  ];

  const BGS = ["bg-1", "bg-2", "bg-3", "bg-4"];

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const pick = (list) => list[Math.floor(rand() * list.length)];

  const products = [];
  const metalFor = (name, cat) => {
    if (cat.silverOnly || /silver/i.test(name)) return "Silver";
    if (/diamond/i.test(name)) return "Diamond";
    if (/pearl/i.test(name)) return "Pearl";
    if (/turquoise|chalcedony|malachite|gemstone/i.test(name)) return "Gemstone";
    return "Plain Gold";
  };
  const karatFor = (name, metal) => {
    if (metal === "Silver") return "925";
    const match = name.match(/\b(9|14|18|22)\s?k[t]?\b/i);
    return match ? match[1] : pick(KARATS);
  };
  const catalog = window.CATALOG || {};
  CATEGORIES.forEach((cat) => {
    const rows = (catalog[cat.source] || "").split("\n").filter(Boolean).map((line) => line.split("|"));
    rows.forEach(([name, priceText, mrpText, code, imageCount], i) => {
      const rule = (cat.typeRules || []).find(([re]) => re.test(name));
      const type = rule ? rule[1] : cat.types[i % cat.types.length];
      const metal = metalFor(name, cat);
      const karat = karatFor(name, metal);
      const price = Number(priceText);
      const mrp = Number(mrpText) > price ? Number(mrpText) : null;
      const discount = mrp ? Math.round((1 - price / mrp) * 100) : 0;
      const images = catalog.imageBase ? Array.from({ length: Number(imageCount) }, (_, k) => `${catalog.imageBase}${code}_${k + 1}.jpg`) : [];
      const id = `${cat.slug.slice(0, 3).toUpperCase()}${String(1000 + products.length)}`;
      products.push({
        id,
        name,
        cat: cat.slug,
        type,
        metal,
        karat,
        images,
        occasion: pick(OCCASIONS),
        gender: cat.slug === "mangalsutra" ? "Women" : pick(GENDERS),
        price,
        mrp,
        discount,
        collection: rand() < 0.6 ? pick(COLLECTIONS).slug : null,
        gifting: rand() < 0.5 ? pick(GIFTING).slug : null,
        tags: Object.keys(TAGS).filter(() => rand() < 0.25),
        stock: rand() < 0.2 ? 1 : 10,
        weight: +(1.5 + rand() * 8).toFixed(3),
        diamondCt: metal === "Diamond" ? +(0.05 + rand() * 0.6).toFixed(2) : null,
        bg: BGS[products.length % BGS.length],
        icon: ART[type] || cat.icon,
        created: products.length,
      });
    });
  });

  const STYLE_LINES = [
    "Clean lines and a lightweight build make {it} easy to wear from morning to evening.",
    "Every edge is hand-finished for a smooth, comfortable feel against the skin.",
    "A balanced silhouette that pairs as easily with ethnic wear as with western outfits.",
    "Designed to catch the light from every angle, with a high-polish finish.",
    "Modern in form yet rooted in Indian craft, {they} {are} made to be worn and remembered.",
  ];
  const OCCASION_LINES = {
    Everyday: "An effortless choice for daily wear.",
    Workwear: "Understated enough for the office, special enough for after.",
    Party: "Made for celebrations, evenings out and festive gatherings.",
    Casual: "A relaxed piece for weekends and easy dressing.",
  };
  const CARE = "Store separately in the pouch provided, keep away from perfume and water, and clean gently with a soft dry cloth.";
  products.forEach((p, i) => {
    const words = p.name.split(" ");
    const design = words.slice(0, 2).join(" ");
    const piece = words.slice(2).join(" ").toLowerCase() || p.type.toLowerCase();
    const plural = /s$/i.test(piece);
    const metalText = p.metal === "Silver" ? "925 sterling silver" : `${p.karat}KT ${p.metal === "Rose Gold" ? "rose" : "yellow"} gold`;
    const stoneText = p.diamondCt ? ` and set with ${p.diamondCt} ct of certified natural diamonds`
      : p.metal === "Gemstone" ? " and accented with natural gemstones"
      : p.metal === "Pearl" ? " and finished with lustrous pearls" : "";
    const occasionLine = OCCASION_LINES[p.occasion] || "A piece for every occasion.";
    p.description = `The ${design} ${piece} ${plural ? "are" : "is"} crafted in ${metalText}${stoneText}. ${STYLE_LINES[i % STYLE_LINES.length]
      .replace("{it}", plural ? "them" : "it")
      .replace("{they}", plural ? "they" : "it")
      .replace("{are}", plural ? "are" : "is")} ${occasionLine}`;
    p.highlights = [
      p.metal === "Silver" ? "925 sterling silver, hallmarked" : `BIS hallmarked ${p.karat}KT gold with HUID`,
      p.diamondCt ? `${p.diamondCt} ct natural diamonds, SI clarity, GH colour` : "High-polish hand finish",
      `Gross weight ${p.weight} g`,
      "Free lifetime exchange at our showroom",
    ];
    p.finish = p.metal === "Silver" ? "Rhodium polish" : "High polish";
    p.setting = p.diamondCt ? pick(["Prong", "Pavé", "Bezel", "Micro-prong"]) : null;
    p.care = CARE;
  });

  const STORES = [
    { city: "Gujarat", name: "Mahaveer Jewellers Flagship Showroom", address: BRAND.address, phone: BRAND.phone, hours: BRAND.hours, image: "images/showroom/exterior.jpg" },
  ];

  const OFFERS = [
    { code: "WELCOME500", title: "Flat ₹500 Off", detail: "On your first order above ₹10,000", type: "flat", value: 500, min: 10000 },
    { code: "MAKING20", title: "20% Off Making", detail: "On making charges of select designs", type: "percent", value: 5, min: 20000 },
    { code: "GIFT1000", title: "Extra ₹1,000 Off", detail: "On gifting orders above ₹40,000", type: "flat", value: 1000, min: 40000 },
  ];

  const GOLD_RATES = [
    { karat: "24 KT", perGram: 7650 },
    { karat: "22 KT", perGram: 7015 },
    { karat: "18 KT", perGram: 5740 },
    { karat: "14 KT", perGram: 4470 },
    { karat: "9 KT", perGram: 2880 },
  ];

  const TESTIMONIALS = [
    { name: "Aditi", city: "Ahmedabad", date: "August 14, 2026", text: "We chose my entire bridal set at the showroom. The team gave us a private seating, explained every piece and never rushed us. Truly a family experience." },
    { name: "Rahul", city: "Surat", date: "July 30, 2026", text: "Found an anniversary pendant online, then saw it in person the same week. The piece was even more beautiful at the counter." },
    { name: "Sneha", city: "Vadodara", date: "July 22, 2026", text: "My diamond studs came with a certificate and a clear price breakup. I wear them every single day and they still shine like new." },
    { name: "Farah", city: "Rajkot", date: "June 18, 2026", text: "The staff helped me find the right ring size and showed options within my budget without any pressure. Lovely showroom." },
    { name: "Meera", city: "Mumbai", date: "June 2, 2026", text: "The designs feel modern but still rooted in tradition. I bought a mangalsutra I can wear with both sarees and office wear." },
    { name: "Kavya", city: "Gandhinagar", date: "May 27, 2026", text: "Enquired on WhatsApp, got photos and a video call from the showroom, then ordered online. Delivery was quick and fully insured." },
    { name: "Ishita", city: "Ahmedabad", date: "May 9, 2026", text: "I exchanged my mother's old gold for a new pair of jhumkas. The weighing and valuation were done in front of us. Completely transparent." },
    { name: "Nikhil", city: "Anand", date: "April 21, 2026", text: "Bought gold coins for Dhanteras. Clear pricing, hallmarked, and the team explained the purity certificate patiently." },
  ];

  const PROMISES = [
    { icon: "shield", label: "BIS Hallmarked Gold", note: "Every gold piece carries a 6-digit HUID you can verify on the BIS Care app", href: "info.html?page=faqs" },
    { icon: "diamond", label: "Certified Natural Diamonds", note: "Independently graded for cut, colour and clarity, with a certificate", href: "info.html?page=faqs" },
    { icon: "exchange", label: "Lifetime Exchange", note: "Upgrade or exchange your jewellery at today's value, for life", href: "info.html?page=exchange" },
    { icon: "return", label: "15-Day Easy Returns", note: "Return unused pieces in original packaging within 15 days of delivery", href: "info.html?page=returns" },
    { icon: "truck", label: "Free Insured Delivery", note: "Tamper-proof packaging, fully insured until it reaches you", href: "info.html?page=delivery" },
    { icon: "tag", label: "Transparent Pricing", note: "Gold rate, weight, making and stone charges shown on every piece", href: "gold-rate.html" },
    { icon: "scale", label: "Weighed Before You", note: "Old gold tested and valued in front of you, with a written receipt", href: "info.html?page=exchange" },
    { icon: "users", label: "Personal Consultation", note: "One-to-one guidance in our showroom or on a video call", href: "stores.html" },
  ];
  const PROMISES_ROW_2 = [];

  const BUDGETS = [
    { value: "0-15000", amount: "₹15,000", size: "sm", bg: "bg-2", icon: "necklace" },
    { value: "0-30000", amount: "₹30,000", size: "md", bg: "bg-1", icon: "ring" },
    { value: "0-60000", amount: "₹60,000", size: "lg", bg: "bg-4", icon: "bracelet" },
  ];

  return { BRAND, CATEGORIES, METALS, KARATS, OCCASIONS, GENDERS, TAGS, PRICE_BANDS, COLLECTIONS, GIFTING, STORES, OFFERS, GOLD_RATES, TESTIMONIALS, PROMISES, PROMISES_ROW_2, BUDGETS, products };
})();
