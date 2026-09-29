window.InfoPages = {
  faqs: {
    title: "Help & FAQs",
    html: `
      <details open><summary>How do I place an order?</summary><p>Browse a category, open a product, choose your size and tap Add to Bag. Review your bag and proceed to checkout.</p></details>
      <details><summary>Is the jewellery certified?</summary><p>Yes. Every piece carries a hallmark and diamond jewellery comes with a certificate.</p></details>
      <details><summary>How long does delivery take?</summary><p>Most orders are delivered within 5-7 working days. See Delivery Information for details.</p></details>
      <details><summary>Can I exchange my jewellery?</summary><p>You can exchange eligible jewellery at our showroom under our lifetime exchange policy.</p></details>
      <details><summary>How do I find my ring size?</summary><p>Use our <a class="link" href="info.html?page=size-guide">Size Guide</a> or visit our showroom for a free fitting.</p></details>
      <details><summary>Can I book a consultation before visiting?</summary><p>Yes. Message us on WhatsApp or <a class="link" href="contact.html">contact us</a> to book a showroom or video consultation.</p></details>
      <details><summary>How do I track my order?</summary><p>Use <a class="link" href="info.html?page=track">Track your Order</a> with your order number and registered mobile number.</p></details>`,
  },
  delivery: {
    title: "Delivery Information",
    html: `<p>We deliver across India. Orders are packed securely and shipped with insured partners.</p>
      <ul><li>Standard delivery: 5-7 working days</li><li>Metro cities: 3-5 working days</li><li>Delivery is free on all orders</li></ul>
      <p>A signature and valid ID may be required on delivery for high-value orders.</p>`,
  },
  returns: {
    title: "Returns & Cancellation",
    html: `<p>Unused products in original packaging can be returned within 15 days of delivery.</p>
      <ul><li>Personalised and engraved items cannot be returned</li><li>Refunds are processed to the original payment method</li><li>Orders can be cancelled before they are shipped</li></ul>`,
  },
  exchange: {
    title: "Lifetime Exchange Policy",
    html: `<p>Bring your jewellery to our showroom to exchange it for a new design. The exchange value is based on the prevailing metal rate and stone value at the time of exchange, and weighing is done in front of you.</p>
      <p>Carry your invoice and a valid photo ID. See <a class="link" href="stores.html">Visit Our Showroom</a> for address and hours.</p>`,
  },
  track: {
    title: "Track your Order",
    html: `<form class="track-form card">
        <label>Order Number<input required placeholder="e.g. 100012345"></label>
        <label>Mobile Number<input required type="tel" pattern="\\d{10}" placeholder="10-digit number"></label>
        <button class="btn-primary">Track</button>
      </form>
      <p class="track-result card" hidden>Order tracking is not connected in this local version. Status updates would appear here.</p>`,
  },
  "size-guide": {
    title: "Size Guide",
    html: `<h3>Ring Size</h3>
      <table class="rate-table"><thead><tr><th>Size</th><th>Inner Diameter</th></tr></thead>
      <tbody><tr><td>10</td><td>15.9 mm</td></tr><tr><td>12</td><td>16.5 mm</td></tr><tr><td>14</td><td>17.2 mm</td></tr><tr><td>16</td><td>17.8 mm</td></tr></tbody></table>
      <h3>Bangle Size</h3>
      <table class="rate-table"><thead><tr><th>Size</th><th>Inner Diameter</th></tr></thead>
      <tbody><tr><td>2.4</td><td>54 mm</td></tr><tr><td>2.6</td><td>57 mm</td></tr><tr><td>2.8</td><td>60 mm</td></tr></tbody></table>`,
  },
  "gift-cards": {
    title: "Gift Cards",
    html: `<p>Gift cards can be redeemed online and in stores. Choose a value, add a message and send it instantly.</p>
      <div class="budget-grid"><div class="budget-card bg-1"><b>₹2,000</b></div><div class="budget-card bg-2"><b>₹5,000</b></div><div class="budget-card bg-3"><b>₹10,000</b></div><div class="budget-card bg-4"><b>₹25,000</b></div></div>
      <p class="muted">Gift card purchase is not available in this local version.</p>`,
  },
  "offer-terms": {
    title: "Offers T&Cs",
    html: `<ul><li>Offers are valid for a limited period and while stocks last.</li><li>Only one coupon can be applied per order.</li><li>Coupons cannot be exchanged for cash.</li><li>The brand may modify or withdraw offers at any time.</li></ul>
      <p>See current offers on the <a class="link" href="offers.html">Offers</a> page.</p>`,
  },
  blog: {
    title: "Blog",
    html: `<article class="blog-item"><h3>How to style everyday gold</h3><p class="muted">Layering tips for work and weekends.</p><a class="link" href="listing.html?occasion=Everyday">Shop Everyday</a></article>
      <article class="blog-item"><h3>Choosing the right ring size</h3><p class="muted">A quick guide before you order online.</p><a class="link" href="info.html?page=size-guide">Read the Size Guide</a></article>
      <article class="blog-item"><h3>Gifts for every milestone</h3><p class="muted">Ideas for birthdays, anniversaries and weddings.</p><a class="link" href="listing.html?gifting=all">Shop Gifting</a></article>`,
  },
  privacy: {
    title: "Privacy Policy",
    html: `<p>This placeholder describes how customer information would be collected, used and protected. Replace it with your own reviewed policy before publishing.</p>`,
  },
  cookies: {
    title: "Cookie Policy",
    html: `<p>This local version stores your bag, wishlist and login state only in your browser's local storage. No tracking cookies are set.</p>`,
  },
  terms: {
    title: "Terms & Conditions",
    html: `<p>This placeholder outlines the terms of using the website and purchasing products. Replace it with your own reviewed terms before publishing.</p>`,
  },
};
