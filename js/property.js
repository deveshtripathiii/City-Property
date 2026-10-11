/* ============================================================
   property.js — City Property Greater Noida
   Handles: property detail rendering, gallery, EMI calculator,
            nearby amenities, WhatsApp modal, similar properties
   ============================================================ */

// ─── DEFAULT PROPERTIES (9 — All Greater Noida) ───────────────────────────
/* ─── DYNAMIC PROPERTIES (FIREBASE & ADMIN DATA ONLY) ─── */
let defaultProperties = JSON.parse(localStorage.getItem('cp_properties') || '[]');

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
