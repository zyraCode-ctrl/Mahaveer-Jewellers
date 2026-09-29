// Product catalogue. Rows: name|price|mrp|imageCode|imageCount.
// Product photos are loaded from `${imageBase}${imageCode}_${n}.jpg` (n = 1..imageCount).
// Leave imageBase empty to show the built-in jewellery artwork, or point it at your photo folder, e.g. "images/products/".
// INTERNAL DEMO ONLY: the URL below links third-party reference photos. Replace it with "" or your own folder before publishing.
window.CATALOG = {
  imageBase: "https://www.miabytanishq.com/on/demandware.static/-/Sites-Tanishq-product-catalog/default/images/Mia/hi-res/",
  earrings: `Blossoming Radiance Diamond Drop Earrings|138617|0|3026DXA|5
Geometric Aura Diamond Earrings|71141|0|3026SOP|5
Layered Bloom Diamond Earrings|32201|0|3026SOG|5
Striking Fanlight Diamond Stud Earrings|49414|0|3026SQR|5
Blossoming Harmony Diamond Ear Cuff|54579|0|3026XWT|5
Linear Poise Diamond Drop Earrings|34529|0|3026DOI|5
Faceted Balance Diamond Drop Earrings|35620|0|3026DOA|5
Sculpted Fold Diamond Stud Earrings|19475|0|3026SQI|5
Architectural Arc Diamond Drop Earrings|18512|0|3026DQD|6
Flowing Grace Diamond Stud Earrings|25890|0|3026SPQ|5
Flowing Whisper Diamond Stud Earrings|23638|0|3026SOM|5
Geometric Poise Diamond Stud Earrings|10713|0|3026SOE|5
Faceted Balance Diamond Stud Earrings|11705|0|3026SNZ|5
Linked Balance Diamond Stud Earrings|36293|0|3026SQP|5
Linear Shift Diamond Stud Earrings|17041|0|3026SQQ|5
Textured Orbit Diamond Stud Earrings|12653|0|3026SQJ|5
Radiant Rhythm Diamond Stud Earrings|15314|0|3026SPT|5
Playful Petal Diamond Hoop Earrings|29303|0|3026HPU|5
Radiant Balance Diamond Drop Earrings|84257|0|3026DOO|6
Angular Motion Diamond Hoop Earrings|26481|0|3026HNB|5
Twisted Rhythm Diamond Hoop Earrings|41573|0|3026HQA|5
Sculpted Flow Gold Hoop Earrings|25203|0|3026HMS|5
Flowing Dune Gold Drop Earrings|25238|0|3026DLY|5
Playful Linear Diamond Drop Earrings|35438|0|3026DNP|5
Radiant Arc Gold Hoop Earrings|44094|0|3026HLR|5
Radiant Linear Diamond Hoop Earrings|46467|0|3026HOJ|5
Dynamic Linear Diamond Stud Earrings|38719|0|3026SQC|5
Playful Leaf Diamond Ear Cuff|32629|0|3026XQN|5
Fluid Embrace Diamond Hoop Earrings|48063|0|3026HPO|5
Sculpted Lattice Gold Hoop Earrings|31152|0|3026HLQ|5
Sculpted Curve Diamond Hoop Earrings|24750|0|3026HPS|5
Sleek Parallel Diamond Hoop Earrings|41389|0|3026HNT|5
Graceful Drift Diamond Drop Earrings|27791|0|3026DNK|5
Flowing Aura Diamond Drop Earrings|20883|0|3026DPD|5
Twisted Rhythm Gold Stud Earrings|13423|0|3026SMW|5
Infinite Flow Gold Stud Earrings|12050|0|3026SMZ|5
Fluid Layered Diamond Hoop Earrings|29593|0|3026HOV|5
Fluid Bloom Gold Stud Earrings|10994|0|3026SMB|5
Serene Ripple Gold Stud Earrings|14350|0|3026SMY|5
Layered Rhythm Gold Stud Earrings|12695|0|3026SMG|5`,
  rings: `Serene Drift Diamond Ring|66101|0|3026FPG|5
Gentle Rhythm Diamond Ring|27090|0|3026FPH|5
Radiant Balance Diamond Ring|51551|0|3026FOK|5
Fluid Poise Diamond Ring|54907|0|3026FOT|5
Playful Poise Diamond Ring|43466|0|3026FPK|5
Interwoven Balance Diamond Ring|56048|0|3026FPF|5
Rippling Harmony Gold Ring|26846|0|3026FNS|5
Fluid Harmony Diamond Ring|20421|0|3026FPJ|5
Serene Spark Diamond Ring|16506|0|3026FPE|5
Linear Motion Diamond Ring|49473|0|3026FOU|5
Flowing Linear Diamond Ring|44254|0|3026FNE|5
Subtle Offset Diamond Ring|30689|0|3026FPI|5
Balanced Crossover Diamond Ring|23989|0|3026FNQ|5
Sculpted Wave Diamond Ring|32831|0|3026FOZ|5
Radiant Fan Gold Ring|12120|0|3026FLX|5
Gleam Play Diamond Ring|42711|0|2812FPL|4
Twist of Love Diamond Ring|46527|0|3024FSC|3
Gilded Groove Diamond Ring|34587|0|3024FRS|3
Edged Brilliance Diamond Ring|33424|0|3024FRQ|3
Crescent Moon Diamond Ring|43218|0|3024FRW|3
Ethereal Twist Diamond Ring|37709|0|3024FRT|3
Dewdrop Daisy Diamond Ring|37805|0|3025FBC|3
Blue Crown Diamond & Gold Ring|25789|0|3024FPV|3
Heart Shine Diamond & Gold Ring|54968|0|3024FRJ|3
Turquoise Oasis Silver Ring|3099|0|4020FEF|3
Peach Chalcedony Silver Ring|2399|0|4020FEB|3`,
  bracelets: `Serene Orbit Diamond Bracelet|35212|0|3026BQF|5
Geometric Rhythm Diamond Bracelet|47718|0|3026BOW|5
Fluid Flame Diamond Bracelet|65154|0|3026BPZ|5
Delicate Rhythm Gold Bracelet|31527|0|3026BLV|5
Playful Tempo Gold Bracelet|29345|0|3026BMA|5
Flowing Dune Gold Bracelet|23232|0|3026BML|5
Delicate Bloom Diamond Bracelet|47668|0|3026BOX|5
Interwoven Harmony Gold Bracelet|20216|0|3026BLZ|5
Sassy Charmer Diamond Bracelet|41035|0|3024BQM|3
Radiant Bond Diamond Bracelet|37500|0|3823BEP|3
Twinkle Drip Pearl Bracelet|27576|0|3025BHK|4
Radiant Lotus Gold Bracelet|31774|0|3025BJV|4
Serene Radiant Lotus Gold Bracelet|5339|0|3025XDB|5
Rooted Regal Tiger Gold Bracelet|5996|0|3025XDG|5
Everyday Joy Daisy Gold Bracelet|6078|0|3025XDD|5
Sleek Balance Diamond Bangle|64513|0|TM26VQG|5
Looped Harmony Diamond Bangle|175148|0|3026VPY|5
Woven Rhythm Diamond Bangle|136755|0|3026VPV|5
Linear Balance Diamond Bangle|114874|0|3X26VQB|5
Rhythmic Facet Gold Bangle|66469|0|3026VMM|5
Serene Interval Gold Bangle|61612|0|3026VMP|5
Fluid Weave Gold Bangle|87038|0|3026VMN|5
Graceful Leaf Gold Bangle|96459|0|3026VMD|5
Glide Statement Diamond Bangle|110092|0|2811VJY|4
Sleek Radiance Gold Bangle|152893|0|3822VWL|3
Sleek Textured Gold Bangle|64498|0|2822VKL|4
Twisted Radiant Gold Bangle|78918|0|3826VBU|4
Fluid Sculpted Gold Bangle|77452|0|3826VCP|7
Graceful Twisted Gold Bangle|97246|0|3826VCR|7
Elegant Twisted Gold Bangle|103523|0|3826VAT|7
Textured Classic Gold Bangle|114224|0|3826VBT|7
Serpentine Grace Gold Bangle|81746|0|3025VIM|5
Chic Duo Pearl Bangle|60799|0|3025VHX|4
Dazzle Drift Diamond Bangle|68843|0|TM25VMJ|4
Lotus Bloom Diamond Bangle|74264|0|TM25VKZ|4`,
  necklaces: `Fluid Rhythm Diamond Necklace|33742|0|3026NNO|5
Vibrant Blossom Diamond Necklace|293744|0|3026NXB|5
Flourishing Harmony Diamond Necklace|104559|0|3X26NWW|5
Radiant Rhythm Diamond Necklace|221984|0|3026NON|5
Cascading Bloom Diamond Necklace|105462|0|3026NWU|5
Blooming Grace Diamond Necklace|76762|0|3026GOF|5
Blossoming Balance Diamond Necklace|113601|0|3026GWT|5
Flowing Rhythm Diamond Necklace|171086|0|3026NOY|5
Measured Rhythm Diamond Necklace|38883|0|3X26GOH|5
Interwoven Rhythm Diamond Necklace|37042|0|3026GPN|5
Butterfly Garden Diamond Necklace|132825|0|3025NBG|3
Lippan Luxe Gold & Diamond Necklace|159578|0|3024NHJ|3
Disco Beat Gold & Diamond Necklace|291424|0|3X24NNJ|4
Rhythmic River 18 Kt Gold & Diamond Necklace|184734|0|3023NDN|4
Orbit Glow Diamond Necklace|24542|0|M5I2GAJ|5
Halo Drift Diamond Necklace|28033|0|M5I2GAH|5
Golden Line Diamond Necklace|19004|0|M5I2GAA|5
Linear Glow Diamond Necklace|17950|0|M5I2GAU|5
Fluid Grace Diamond Necklace|17162|0|M5I2GAD|5
Blossom Whisper Diamond Necklace|18822|0|M5I2GBF|5
Playful Dimension Diamond Pendant|19294|0|3026PQE|5
Faceted Poise Diamond Pendant|16280|0|3026PNY|5
Radiant Harmony Diamond Pendant|27336|0|3026POQ|5
Fluid Twisted Diamond Pendant|23779|0|3026POL|5
Graceful Infinity Diamond Pendant|16230|0|3026PQK|5
Sculpted Aura Diamond Pendant|27610|0|3026PPA|5
Linear Rhythm Diamond Pendant|29110|0|3026PPB|5
Fluid Bloom Diamond Pendant|18849|0|3026PPC|5
Balanced Pebble Gold Pendant|14338|0|3026PLS|5
Forever Locked Diamond & Gold Pendant|19169|0|3024PRG|3
Graceful Twist Gold & Diamond Pendant|32108|0|3822PHK|3
Draped Elegance 14 Kt Gold & Diamond Pendant|50501|0|3023PCT|3
Honeycomb Radiance Diamond Pendant|12993|0|3026PAL|4
Honeyed Heart Gold Pendant|14631|0|3026PAA|4
Curve Chic Pearl Pendant|11939|0|3025PHU|4
Drip Pop Diamond Pendant|17021|0|3025PNT|4
Arch Elegance Gold Pendant|15652|0|3025PKI|4
Lotus Bud Pearl Pendant|20164|0|3025PJE|4
Glow Paisley Diamond Pendant|17022|0|3025PMH|4
Dawn Hug Gold Pendant|6242|0|IKD5PDK|4
Arcade Elegance Gold Pendant|11135|0|3025PKG|4
Chic Stripe Gold Pendant|7028|0|3025PKF|4
Twilight Shell Gold Pendant|10630|0|3025PNH|4
Happy Butterfly Gold Pendant|5726|0|IKDXPDZ|4`,
  mangalsutra: `Graceful Swirl Gold and Diamond Mangalsutra|153730|0|3824YBH|3
Sparkling Elegance Gold and Diamond Mangalsutra|139929|0|3824YBG|3
Glistening Fringe Gold and Diamond Mangalsutra|134155|0|3824YDW|3
Starry Embrace Gold and Diamond Mangalsutra|101723|0|3824YEB|3
Enchanted Essence Gold and Diamond Mangalsutra|122874|0|3824YDV|3
Brilliance Arc Gold and Diamond Mangalsutra|165727|0|3824YBI|3
Radiant Arc 14 Kt Gold and Diamond Mangalsutra|106279|0|3024YAM|4
Floral Grace 18 Kt Gold and Diamond Vati Mangalsutra|126329|0|3024YAZ|4
Glowing Eternity 14 Kt Gold and Diamond Mangalsutra|108270|0|3024YAQ|4
Enchanted Leaves 14 Kt Gold and Diamond Mangalsutra|165277|0|3024YAG|4
Eternal Sunflower Gold and Diamond Mangalsutra|117165|0|3824YDZ|3
Infinite Love Diamond Mangalsutra|45409|0|2820YMG|5
Floral Cascade Gold and Diamond Mangalsutra|189244|0|3824YBF|3
Floral Luminance Gold and Diamond Mangalsutra|97444|0|3824YEL|3
Elegant Charm Gold and Diamond Mangalsutra|133204|0|3824YBJ|3
Whispering Waves Gold and Diamond Mangalsutra|75124|0|3824YDG|3
Layered Grace Gold and Diamond Mangalsutra|81969|0|3824YEM|3
Glowing Grace 18 Kt Gold and Diamond Vati Mangalsutra|124433|0|3024YAY|4
Lustrous Vows 18 Kt Gold and Diamond Mangalsutra|126151|0|3024YAX|4
Blossom Beauty 18 Kt Gold and Diamond Mangalsutra|154779|0|3024YAN|4
Eternal Shine 18 Kt Gold and Diamond Mangalsutra|150038|0|3024YAR|4
Flight of Elegance 14 Kt Gold and Diamond Mangalsutra|90763|0|3024YAP|4`,
  silver: `Shiny Contoured Silver Bangle|7999|0|4025VBF|4
Dainty Sparkling Silver Bangle|7899|0|4025VBC|4
Polished Sleek Silver Earrings|3799|0|4025HCX|5
Sparkly Sleek Silver Hoop Earrings|3199|0|4020HMV|3
Cheeky Love Silver Charms|1499|0|4025QBT|4
Twisted Bold Silver Earrings and Pendant Set|3499|0|40251EU|6
Twisty Textured Silver Earrings|1999|0|4025HCN|5
Whimsical Flutter Silver Charms|1199|0|4025QBX|4
Chic Bezelled Silver Bangle|7299|0|4025VBQ|4
Modern Sculpted Silver Bangle|7899|0|4025VBJ|4
Festive Cheer Silver Bell Charm|1699|0|4020QCV|3
Regal Rook Silver Chess Charm|1799|0|4020QCT|3
Twisted Shine Silver Earrings|2399|0|4025HCK|5
Chunky Textured Silver Ring|2999|0|4025FEG|4
Drizzle Glint Silver Bangle|7399|0|4025VBM|4
Gleam Duo Silver Bangle|5199|0|4025VBR|4
Vivid Starburst Silver Bangle|8699|0|4025VAY|4
Playful Sculpted Silver Earrings|4399|0|4025HCH|5
Glossy Chic Silver Earrings|3699|0|4025HCY|5
Textured Chic Silver Earrings|2799|0|4025HDA|5
Zesty Zigzag Silver Ring|1799|0|4025FEE|4
Chic Braided Pearl Silver Bangle|7099|0|4025VBK|6
Sleek Contoured Silver Bangle|6499|0|4025VAR|5
Chunky Bold Silver Earrings|4199|0|4025HCQ|5
Zesty Bolt Silver Ring|2699|0|4025FEA|4
Textured Bold Silver Earrings|4799|0|4025HCP|5
Glitter Pop Silver Charms|1499|0|4025QBY|4
Chic Sparkle Silver Ring|1799|0|4025FED|4
Grunge Twist Silver Bangle|5399|0|4025VAT|5
Frost Flare Silver Bangle|8199|0|4025VAX|4
Twist Play Silver Toe Rings|2299|0|4025XFA|4
Minimal Chic Silver Bracelet|2899|0|4025BAI|5
Cute Heart Silver Ring|1899|0|4025FDX|4
Playful Cage Silver Ring|1899|0|4025FDV|6
Swirly Sleek Silver Ring|2999|0|4025FEF|4
Looped Luxe Silver Ring|1899|0|4025FEH|4
Chic Textured Silver Ring|1799|0|4025FDW|4
Malachite Magic Silver Necklace|3999|0|4020GNT|3
Playful Chic Silver Necklace|5299|0|4025NDD|5
Cheeky Chic Silver Bracelet|3999|0|4025BAO|5
Playful Peace Silver Bracelet|1999|0|4025BAH|5
Bold Textured Silver Bracelet|2999|0|4025BAQ|5
Dreamy Chic Silver Bracelet|3699|0|4025BAG|5`,
  more: `50 gm 999 Divine Ganesha Silver Coin|17250|0|2826ZAD|4
50 gm 999 Divine Krishna Silver Coin|17250|0|2826ZAC|4
50 gm 999 Majestic Peacock Silver Coin|17250|0|2826ZAB|4
Playful Lattice Silver Nose Pin|899|0|4025ODR|5
Cute Gleam Silver Nose Pin|899|0|4025ODF|5
Dreamy Bloom Silver Nose Pin|999|0|4025ODQ|5
Edgy Linear Silver Nose Pin|899|0|4025ODJ|5
Playful Heart Silver Nose Pin|999|0|4025ODM|5
Sassy Sleek Silver Nose Pin|899|0|4025ODN|5
Peppy Chic Silver Nose Pin|999|0|4025ODO|5
Whimsical Bloom Silver Nose Pin|899|0|4025ODP|5
Playful Stacked Silver Nose Pin|899|0|4025ODL|5
Dreamy Gleam Silver Nose Pin|999|0|4025ODK|5
Chic Nova Diamond Nose Pin|7206|0|3025OMO|4
Twinkle Bloom Diamond Nose Pin|8031|0|2819OHD|4`,
};
