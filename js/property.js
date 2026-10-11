/* ============================================================
   property.js — City Property Greater Noida
   Handles: property detail rendering, gallery, EMI calculator,
            nearby amenities, WhatsApp modal, similar properties
   ============================================================ */

// ─── DEFAULT PROPERTIES (9 — All Greater Noida) ───────────────────────────
const defaultProperties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment – Sector Omicron 1",
    location: "Sector Omicron 1, Greater Noida – 201308",
    price: "₹85 Lakhs",
    priceRaw: 8500000,
    pricePerSqft: "₹5,667/sq.ft",
    type: "Apartment",
    beds: 3, baths: 2, size: 1500, floor: "5th", age: 2,
    possession: "Ready to Move",
    furnishing: "Semi-Furnished",
    authority: "GNA",
    rera: "UPRERAPRJ123456",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1560185127-6d9b6fa7cef5?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Welcome to this stunning 3BHK luxury apartment in Sector Omicron 1, Greater Noida. GNA-approved with full RERA compliance. Features modular kitchen, premium fittings, vitrified tiles, and a gated township with world-class amenities including gym, swimming pool, 24/7 security, and landscaped gardens. Excellent connectivity to Noida, Delhi, and Yamuna Expressway.",
    tags: ["RERA", "GNA", "Verified", "Featured"]
  },
  {
    id: 2,
    title: "Premium 2BHK Flat – Sector Alpha 2",
    location: "Sector Alpha 2, Greater Noida – 201310",
    price: "₹52 Lakhs",
    priceRaw: 5200000,
    pricePerSqft: "₹4,727/sq.ft",
    type: "Apartment",
    beds: 2, baths: 2, size: 1100, floor: "3rd", age: 3,
    possession: "Ready to Move",
    furnishing: "Unfurnished",
    authority: "GNA",
    rera: "UPRERAPRJ234567",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560185127-6d9b6fa7cef5?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Well-maintained 2BHK apartment in the heart of Sector Alpha 2, Greater Noida. GNA-approved society with lift, parking, power backup, and security. Close to schools, hospitals, and metro connectivity.",
    tags: ["GNA", "Verified"]
  },
  {
    id: 3,
    title: "Spacious 4BHK Villa – Yamuna Expressway",
    location: "Sector 18, Yamuna Expressway – 203207",
    price: "₹1.8 Crore",
    priceRaw: 18000000,
    pricePerSqft: "₹6,000/sq.ft",
    type: "Villa",
    beds: 4, baths: 4, size: 3000, floor: "G+2", age: 1,
    possession: "Ready to Move",
    furnishing: "Fully Furnished",
    authority: "YEA",
    rera: "UPRERAPRJ345678",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Stunning 4BHK independent villa on Yamuna Expressway, approved by Yamuna Expressway Authority (YEA). Minutes from proposed Jewar International Airport. Fully furnished, private garden, modular kitchen, premium bathrooms. Excellent investment opportunity in fastest-growing corridor.",
    tags: ["YEA", "RERA", "Featured", "Hot"]
  },
  {
    id: 4,
    title: "Commercial Shop – Knowledge Park 3",
    location: "Knowledge Park 3, Greater Noida – 201308",
    price: "₹45 Lakhs",
    priceRaw: 4500000,
    pricePerSqft: "₹9,000/sq.ft",
    type: "Commercial",
    beds: 0, baths: 1, size: 500, floor: "Ground", age: 0,
    possession: "Ready to Move",
    furnishing: "Bare Shell",
    authority: "GNA",
    rera: "UPRERAPRJ456789",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Prime commercial shop in Knowledge Park 3, Greater Noida. High footfall area with excellent visibility. GNA-approved building. Suitable for retail, office, or food outlet. Ground floor, ready possession.",
    tags: ["GNA", "Commercial", "Verified"]
  },
  {
    id: 5,
    title: "3BHK Penthouse – Sector Delta 1",
    location: "Sector Delta 1, Greater Noida – 201306",
    price: "₹1.1 Crore",
    priceRaw: 11000000,
    pricePerSqft: "₹7,333/sq.ft",
    type: "Penthouse",
    beds: 3, baths: 3, size: 1500, floor: "Top Floor", age: 4,
    possession: "Ready to Move",
    furnishing: "Fully Furnished",
    authority: "GNA",
    rera: "UPRERAPRJ567890",
    images: [
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80"
    ],
    desc: "Breathtaking penthouse in Sector Delta 1 offering panoramic views of Greater Noida. 3BHK, fully furnished with premium European fittings. Private terrace, exclusive parking, 24/7 concierge service. GNA-approved project with RERA certification.",
    tags: ["GNA", "RERA", "Featured", "Premium"]
  },
  {
    id: 6,
    title: "Plot for Sale – Sector Mu, Greater Noida",
    location: "Sector Mu 2, Greater Noida – 201307",
    price: "₹42 Lakhs",
    priceRaw: 4200000,
    pricePerSqft: "₹3,000/sq.ft",
    type: "Plot",
    beds: 0, baths: 0, size: 1400, floor: "NA", age: 0,
    possession: "Immediate",
    furnishing: "NA",
    authority: "GNA",
    rera: "UPRERAPRJ678901",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Residential plot in GNA-approved Sector Mu 2, Greater Noida. Corner plot with road-facing benefits. Ideal to build your dream home. All utilities connected — water, electricity, sewage. Secure lease deed available.",
    tags: ["GNA", "Plot", "Verified"]
  },
  {
    id: 7,
    title: "2BHK Apartment – Sector 22D Yamuna Expressway",
    location: "Sector 22D, Yamuna Expressway – 203203",
    price: "₹38 Lakhs",
    priceRaw: 3800000,
    pricePerSqft: "₹3,800/sq.ft",
    type: "Apartment",
    beds: 2, baths: 2, size: 1000, floor: "8th", age: 2,
    possession: "Under Construction",
    furnishing: "Unfurnished",
    authority: "YEA",
    rera: "UPRERAPRJ789012",
    images: [
      "https://images.unsplash.com/photo-1560185127-6d9b6fa7cef5?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Budget-friendly 2BHK near Yamuna Expressway. YEA-approved project close to proposed Jewar Airport. Good connectivity to Agra highway. Excellent investment for future returns.",
    tags: ["YEA", "RERA"]
  },
  {
    id: 8,
    title: "3BHK Independent House – Sector Pi 1",
    location: "Sector Pi 1, Greater Noida – 201309",
    price: "₹78 Lakhs",
    priceRaw: 7800000,
    pricePerSqft: "₹5,200/sq.ft",
    type: "Independent House",
    beds: 3, baths: 3, size: 1500, floor: "G+1", age: 8,
    possession: "Ready to Move",
    furnishing: "Semi-Furnished",
    authority: "GNA",
    rera: "UPRERAPRJ890123",
    images: [
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Independent G+1 house in tranquil Sector Pi 1. Large garden, covered parking, and terrace. GNA-approved with clear title. Very well maintained. Excellent school and hospital proximity.",
    tags: ["GNA", "Verified", "House"]
  },
  {
    id: 9,
    title: "Studio Apartment – Sector Gamma 2",
    location: "Sector Gamma 2, Greater Noida – 201308",
    price: "₹22 Lakhs",
    priceRaw: 2200000,
    pricePerSqft: "₹3,667/sq.ft",
    type: "Studio",
    beds: 1, baths: 1, size: 600, floor: "2nd", age: 5,
    possession: "Ready to Move",
    furnishing: "Fully Furnished",
    authority: "GNA",
    rera: "UPRERAPRJ901234",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80",
      "https://images.unsplash.com/photo-1560185127-6d9b6fa7cef5?w=900&q=80",
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=900&q=80"
    ],
    desc: "Compact, fully furnished studio apartment in Sector Gamma 2. Perfect for working professionals. GNA-approved building with lift, security, and WiFi. Walking distance to metro.",
    tags: ["GNA", "Verified", "Studio"]
  }
];

// ─── NEARBY AMENITIES DATA ────────────────────────────────────────────────
const nearbyData = {
  schools: [
    { name: "Ryan International School", dist: "0.8 km", rating: "4.5 ⭐", icon: "fa-graduation-cap" },
    { name: "DPS Greater Noida", dist: "1.2 km", rating: "4.7 ⭐", icon: "fa-graduation-cap" },
    { name: "Lotus Valley International", dist: "2.1 km", rating: "4.4 ⭐", icon: "fa-graduation-cap" }
  ],
  hospitals: [
    { name: "Yatharth Hospital", dist: "1.0 km", rating: "4.3 ⭐", icon: "fa-hospital" },
    { name: "Kailash Hospital GN", dist: "2.5 km", rating: "4.6 ⭐", icon: "fa-hospital" },
    { name: "Max Super Speciality", dist: "4.2 km", rating: "4.8 ⭐", icon: "fa-hospital" }
  ],
  metro: [
    { name: "Depot Station (Aqua Line)", dist: "1.1 km", rating: "Aqua Line", icon: "fa-train-subway" },
    { name: "Greater Noida Sector 76", dist: "2.8 km", rating: "Aqua Line", icon: "fa-train-subway" },
    { name: "Knowledge Park II Metro", dist: "3.5 km", rating: "Aqua Line", icon: "fa-train-subway" }
  ],
  malls: [
    { name: "The Grand Venice Mall", dist: "2.0 km", rating: "4.4 ⭐", icon: "fa-store" },
    { name: "Atta Market Greater Noida", dist: "3.1 km", rating: "4.2 ⭐", icon: "fa-store" },
    { name: "Ansal Plaza GN", dist: "4.0 km", rating: "4.1 ⭐", icon: "fa-store" }
  ]
};

// ─── STATE ────────────────────────────────────────────────────────────────
let currentProp = null;
let allProps = defaultProperties;
let currentGalleryIndex = 0;
let currentGalleryImages = [];
let currentAmenitiesTab = 'schools';
let currentWAPropName = '';

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Load property from localStorage or default to first
  const stored = localStorage.getItem('cp_view_property');
  let propId = stored ? parseInt(stored) : 1;
  let prop = allProps.find(p => p.id === propId) || allProps[0];
  currentProp = prop;

  // Track recently viewed
  trackRecentlyViewed(prop.id);

  renderPropDetail(prop, allProps);
  updateEMI();
  setAmenitiesTab('schools');
});

// ─── RENDER PROPERTY DETAIL ───────────────────────────────────────────────
function renderPropDetail(prop, allPropsArr) {
  // Breadcrumb
  const bc = document.getElementById('bcTitle');
  if (bc) bc.textContent = prop.title;

  // Title & location
  setEl('propTitle', prop.title);
  setEl('propLocation', prop.location);
  setEl('propPrice', prop.price);
  setEl('propPriceSqft', prop.pricePerSqft);

  // Breadcrumb current
  const brc = document.getElementById('bcTitle');
  if (brc) brc.textContent = prop.type + ' — ' + prop.location;

  // Features
  setEl('fBeds', prop.beds === 0 ? 'N/A' : prop.beds);
  setEl('fBaths', prop.baths === 0 ? 'N/A' : prop.baths);
  setEl('fSize', prop.size.toLocaleString());
  setEl('fFloor', prop.floor);
  setEl('fAge', prop.age === 0 ? 'New' : prop.age);

  // Description
  setEl('propDesc', prop.desc);

  // Spec table
  setEl('specType', prop.type);
  setEl('specArea', prop.size.toLocaleString() + ' sq.ft (' + Math.round(prop.size * 0.0929) + ' sq.m)');
  setEl('specFloor', prop.floor);
  setEl('specAge', prop.age === 0 ? 'New Construction' : prop.age + ' Years');
  setEl('specPossession', prop.possession);
  setEl('specFurnishing', prop.furnishing);

  // Badges
  updateBadges(prop);

  // EMI — set principal to 80% of property price
  const principal = Math.round(prop.priceRaw * 0.8);
  const emiInp = document.getElementById('emiPrincipal');
  if (emiInp) { emiInp.value = principal; }
  updateEMI();

  // Gallery
  currentGalleryImages = prop.images && prop.images.length > 0
    ? prop.images
    : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80'];
  currentGalleryIndex = 0;
  renderGallery();

  // Similar properties (exclude current)
  const similar = allPropsArr.filter(p => p.id !== prop.id).slice(0, 4);
  renderSimilar(similar);

  // EMI hint
  const emiHint = document.querySelector('.prop-emi-hint');
  if (emiHint) {
    const approxEMI = Math.round(calcEMI(prop.priceRaw * 0.8, 8.5, 20));
    emiHint.innerHTML = `<i class="fa-solid fa-calculator"></i> EMI from ${formatINR(approxEMI)}/mo`;
  }
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateBadges(prop) {
  const badgesContainer = document.querySelector('.prop-badges');
  if (!badgesContainer) return;
  let html = '';
  if (prop.tags && prop.tags.includes('RERA')) {
    html += `<span class="badge badge-rera"><i class="fa-solid fa-shield-halved"></i> RERA Approved</span>`;
  }
  if (prop.authority === 'GNA') {
    html += `<span class="badge badge-gna"><i class="fa-solid fa-landmark"></i> GNA Verified</span>`;
  } else if (prop.authority === 'YEA') {
    html += `<span class="badge badge-yea"><i class="fa-solid fa-road"></i> YEA Verified</span>`;
  }
  if (prop.tags && prop.tags.includes('Verified')) {
    html += `<span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>`;
  }
  if (prop.furnishing !== 'Unfurnished' && prop.furnishing !== 'NA' && prop.furnishing !== 'Bare Shell') {
    html += `<span class="badge badge-furnished"><i class="fa-solid fa-couch"></i> ${prop.furnishing}</span>`;
  }
  badgesContainer.innerHTML = html;
}

// ─── GALLERY ──────────────────────────────────────────────────────────────
function renderGallery() {
  const mainImg = document.getElementById('galleryMainImg');
  const thumbsEl = document.getElementById('galleryThumbs');
  const galCurrent = document.getElementById('galCurrent');
  const galTotal = document.getElementById('galTotal');

  if (!mainImg || !thumbsEl) return;

  mainImg.src = currentGalleryImages[currentGalleryIndex];
  if (galCurrent) galCurrent.textContent = currentGalleryIndex + 1;
  if (galTotal) galTotal.textContent = currentGalleryImages.length;

  thumbsEl.innerHTML = currentGalleryImages.map((img, i) => `
    <div class="gallery-thumb ${i === currentGalleryIndex ? 'active' : ''}" onclick="setGalleryImage(${i})">
      <img src="${img}" alt="Thumbnail ${i + 1}" loading="lazy" />
    </div>
  `).join('');
}

function nextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
  updateGalleryMain();
}

function prevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  updateGalleryMain();
}

function setGalleryImage(i) {
  currentGalleryIndex = i;
  updateGalleryMain();
}

function updateGalleryMain() {
  const mainImg = document.getElementById('galleryMainImg');
  const galCurrent = document.getElementById('galCurrent');
  if (mainImg) {
    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.98)';
    setTimeout(() => {
      mainImg.src = currentGalleryImages[currentGalleryIndex];
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 200);
  }
  if (galCurrent) galCurrent.textContent = currentGalleryIndex + 1;

  // Update active thumb
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === currentGalleryIndex);
  });

  if (mainImg) {
    mainImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }
}

// ─── EMI CALCULATOR ───────────────────────────────────────────────────────
/**
 * Standard EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * P = principal, r = monthly rate, n = total months
 */
function calcEMI(principal, annualRate, tenureYears) {
  const r = annualRate / 12 / 100; // monthly rate
  const n = tenureYears * 12;       // total months
  if (r === 0) return principal / n;
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return emi;
}

function updateEMI() {
  const principal = parseFloat(document.getElementById('emiPrincipal')?.value) || 0;
  const rate = parseFloat(document.getElementById('emiRate')?.value) || 8.5;
  const tenure = parseInt(document.getElementById('emiTenure')?.value) || 20;

  const monthlyEMI = calcEMI(principal, rate, tenure);
  const totalPayable = monthlyEMI * tenure * 12;
  const totalInterest = totalPayable - principal;

  // Animate update
  animateValue('emiMonthly', formatINR(monthlyEMI));
  animateValue('emiTotalInterest', formatINR(totalInterest));
  animateValue('emiTotalPayable', formatINR(totalPayable));
}

function animateValue(id, newVal) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transform = 'scale(0.9)';
  el.style.opacity = '0.5';
  el.style.transition = 'all 0.25s ease';
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
  }, 200);
}

/**
 * Format number as Indian currency (Lakhs/Crores)
 */
function formatINR(amount) {
  if (isNaN(amount) || amount <= 0) return '₹0';
  if (amount >= 10000000) {
    return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + ' L';
  } else {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }
}

// ─── NEARBY AMENITIES ─────────────────────────────────────────────────────
function setAmenitiesTab(tab) {
  currentAmenitiesTab = tab;

  // Update tab buttons
  document.querySelectorAll('.nearby-tab').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tab}'`)) {
      btn.classList.add('active');
    }
  });

  // Render list
  const list = document.getElementById('nearbyList');
  if (!list) return;
  const items = nearbyData[tab] || [];
  list.innerHTML = items.map(item => `
    <div class="nearby-item">
      <div class="nearby-name">
        <i class="fa-solid ${item.icon}"></i> ${item.name}
      </div>
      <div class="nearby-meta">
        <span class="nearby-rating">${item.rating}</span>
        <span class="nearby-dist"><i class="fa-solid fa-location-dot"></i> ${item.dist}</span>
      </div>
    </div>
  `).join('');
}

// ─── SIMILAR PROPERTIES ───────────────────────────────────────────────────
function renderSimilar(props) {
  const container = document.getElementById('similarScroll');
  if (!container) return;
  container.innerHTML = props.map(p => `
    <div class="sim-card" onclick="viewProp(${p.id})">
      <div class="sim-card-img">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="sim-card-body">
        <div class="sim-card-title">${p.title}</div>
        <div class="sim-card-price"><a href="tel:9711733120" style="color:var(--primary);font-weight:800;text-decoration:none;"><i class="fas fa-phone-alt"></i> Price on Call</a></div>
        <div class="sim-card-loc"><i class="fa-solid fa-location-dot" style="color:var(--danger)"></i> ${p.location.split(',')[0]}</div>
      </div>
    </div>
  `).join('');
}

// ─── DESCRIPTION TOGGLE ───────────────────────────────────────────────────
function toggleDesc() {
  const desc = document.getElementById('descText');
  const btn = document.getElementById('readMoreBtn');
  if (!desc || !btn) return;
  if (desc.classList.contains('collapsed')) {
    desc.classList.remove('collapsed');
    btn.innerHTML = 'Read Less <i class="fa-solid fa-chevron-up"></i>';
  } else {
    desc.classList.add('collapsed');
    btn.innerHTML = 'Read More <i class="fa-solid fa-chevron-down"></i>';
  }
}

// ─── WHATSAPP MODAL ───────────────────────────────────────────────────────
function openWAModal(propName) {
  currentWAPropName = propName || 'Property Enquiry';
  const modal = document.getElementById('waModal');
  if (modal) modal.classList.add('open');

  // Pre-fill message
  const msgEl = document.getElementById('waMsg');
  if (msgEl) {
    msgEl.value = `Hi, I am interested in: "${currentWAPropName}". Please share more details.`;
  }
  generateCID();
}

function closeWAModal(e) {
  if (e && e.target !== document.getElementById('waModal')) return;
  const modal = document.getElementById('waModal');
  if (modal) modal.classList.remove('open');
}

function generateCID() {
  const phone = document.getElementById('waPhone')?.value || '';
  const cid = generateCustomerID(phone);
  const cidEl = document.getElementById('waCid');
  if (cidEl) cidEl.textContent = cid;
}

function generateCustomerID(phone) {
  const digits = phone.replace(/\D/g, '').slice(-4) || '0000';
  const prefix = 'CP';
  const mid = Math.floor(Date.now() / 1000).toString().slice(-4);
  return `${prefix}${mid}${digits}`;
}

function sendToWhatsApp() {
  const name = document.getElementById('waName')?.value.trim() || 'Visitor';
  const phone = document.getElementById('waPhone')?.value.trim() || '';
  const msg = document.getElementById('waMsg')?.value.trim() || '';
  const cid = document.getElementById('waCid')?.textContent || '';

  if (!name || !phone) {
    showToast('Please enter your name and phone number', 'error');
    return;
  }

  const text = encodeURIComponent(
    `🏠 *City Property Enquiry*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 Name: ${name}\n` +
    `📱 Phone: ${phone}\n` +
    `🏡 Property: ${currentWAPropName}\n` +
    `💬 Message: ${msg}\n` +
    `🆔 Customer ID: ${cid}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📍 Greater Noida | citypropertyGN.com`
  );

  window.open(`https://wa.me/919711733120?text=${text}`, '_blank');
  closeWAModal();
  showToast('Redirecting to WhatsApp...', 'success');
}

// ─── QUICK ENQUIRY ────────────────────────────────────────────────────────
function updateQCID() {
  const phone = document.getElementById('enqPhone')?.value || '';
  if (phone.length >= 5) {
    const cid = generateCustomerID(phone);
    const cidBox = document.getElementById('enqCidBox');
    const cidEl = document.getElementById('enqCid');
    if (cidBox) cidBox.style.display = 'block';
    if (cidEl) cidEl.textContent = cid;
  }
}

function sendQuickEnquiry() {
  const name = document.getElementById('enqName')?.value.trim() || '';
  const phone = document.getElementById('enqPhone')?.value.trim() || '';
  const msg = document.getElementById('enqMsg')?.value.trim() || '';
  const propTitle = document.getElementById('propTitle')?.textContent || 'Property';

  if (!name || !phone) {
    showToast('Please fill your name and phone', 'error');
    return;
  }

  const cid = generateCustomerID(phone);
  const text = encodeURIComponent(
    `🏠 *City Property — Quick Enquiry*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 Name: ${name}\n` +
    `📱 Phone: ${phone}\n` +
    `🏡 Property: ${propTitle}\n` +
    `💬 Message: ${msg || 'Interested in this property'}\n` +
    `🆔 Customer ID: ${cid}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📍 Greater Noida | citypropertyGN.com`
  );

  window.open(`https://wa.me/919711733120?text=${text}`, '_blank');
  showToast('Enquiry sent! Our agent will contact you shortly.', 'success');
}

// ─── TRACK RECENTLY VIEWED ────────────────────────────────────────────────
function trackRecentlyViewed(id) {
  let recent = JSON.parse(localStorage.getItem('cp_recently_viewed') || '[]');
  recent = recent.filter(r => r !== id);
  recent.unshift(id);
  if (recent.length > 10) recent = recent.slice(0, 10);
  localStorage.setItem('cp_recently_viewed', JSON.stringify(recent));
}

// ─── VIEW PROPERTY ────────────────────────────────────────────────────────
function viewProp(id) {
  localStorage.setItem('cp_view_property', id);
  window.location.href = 'property.html';
}

// ─── TOAST ────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : type === 'info' ? 'info' : ''}`;
  const icon = type === 'error' ? 'fa-circle-xmark' : type === 'info' ? 'fa-circle-info' : 'fa-circle-check';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Expose functions globally
window.nextImage = nextImage;
window.prevImage = prevImage;
window.setGalleryImage = setGalleryImage;
window.updateEMI = updateEMI;
window.setAmenitiesTab = setAmenitiesTab;
window.openWAModal = openWAModal;
window.closeWAModal = closeWAModal;
window.generateCID = generateCID;
window.sendToWhatsApp = sendToWhatsApp;
window.updateQCID = updateQCID;
window.sendQuickEnquiry = sendQuickEnquiry;
window.toggleDesc = toggleDesc;
window.viewProp = viewProp;
window.showToast = showToast;
window.defaultProperties = defaultProperties;
