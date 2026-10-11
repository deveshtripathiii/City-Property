/* =========================================================
   City Property – main.js  (Homepage)
   Phone: 9711733120 | WhatsApp: 919711733120
   ========================================================= */

'use strict';

/* ─── LANGUAGE DATA ─── */
const I18N = {
  en: {
    'nav.home': 'Home', 'nav.properties': 'Properties', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.login': 'Login',
    'lang.hi': 'HI', 'lang.en': 'EN',
    'hero.badge': '#1 in Greater Noida',
    'hero.title': 'Find Your Dream Property in Greater Noida',
    'hero.subtitle': 'Explore verified properties in <strong>GNA (Greater Noida Authority)</strong> and <strong>YEA (Yamuna Expressway Authority)</strong> sectors. RERA registered. 100% secure.',
    'hero.cta1': 'Explore Properties', 'hero.cta2': 'Talk to Expert',
    'hero.stat1': 'Listed Properties', 'hero.stat2': 'Happy Clients', 'hero.stat3': 'RERA Verified', 'hero.stat4': 'Customer Rating', 'hero.stat5': 'Authority Approved',
    'search.buy': '🏠 Buy', 'search.rent': '🔑 Rent', 'search.land': '🌍 Land / Plot',
    'search.btn': 'Search Properties', 'search.location_ph': 'Enter sector, locality or project...',
    'trust.rera': 'RERA Registered', 'trust.gna': 'GNA Authority Certified', 'trust.yea': 'YEA Authority Certified',
    'trust.secure': 'Secure & Verified', 'trust.rating': '4.9/5 Rating', 'trust.count': '500+ Properties',
    'cat.title': 'Browse by Category', 'cat.subtitle': 'Find the perfect property type for your needs',
    'cat.all': 'All', 'cat.flat': 'Flats', 'cat.room': 'Rooms', 'cat.hostel': 'Hostel/PG', 'cat.building': 'Buildings', 'cat.plot': 'Plots', 'cat.house': 'Houses',
    'feat.title': 'Featured Properties', 'feat.subtitle': 'Handpicked listings in Greater Noida',
    'feat.viewall': 'View All →', 'feat.loadmore': 'Load More Properties',
    'chip.all': 'All', 'chip.sale': 'For Sale', 'chip.rent': 'For Rent', 'chip.land': 'Land / Plot',
    'sort.default': 'Sort: Default', 'sort.price_low': 'Price: Low to High', 'sort.price_high': 'Price: High to Low', 'sort.newest': 'Newest First',
    'stats.props': 'Properties Listed', 'stats.clients': 'Happy Clients', 'stats.years': 'Years Experience', 'stats.deals': 'Deals Closed',
    'test.title': 'What Our Clients Say', 'test.subtitle': 'Trusted by 1200+ families across Greater Noida',
    'why.title': 'Why Choose City Property?', 'why.subtitle': 'Your trusted real estate partner in Greater Noida',
    'auth.title': 'Serving Both Authority Areas', 'auth.subtitle': 'Expert knowledge of both GNA and YEA governed sectors',
    'contact.title': 'Get In Touch', 'contact.subtitle': "We're here to help you find the perfect property",
    'modal.title': 'Enquire on WhatsApp', 'modal.sub': 'Our team will respond within minutes',
    'modal.send': 'Send Enquiry on WhatsApp', 'modal.cid': 'Enquiry ID:',
    'footer.copy': '© 2025 City Property. All rights reserved. | RERA Registered | GNA & YEA Certified',
  },
  hi: {
    'nav.home': 'होम', 'nav.properties': 'प्रॉपर्टी', 'nav.about': 'हमारे बारे में', 'nav.contact': 'संपर्क', 'nav.login': 'लॉगिन',
    'lang.hi': 'HI', 'lang.en': 'EN',
    'hero.badge': 'ग्रेटर नोएडा में #1',
    'hero.title': 'ग्रेटर नोएडा में अपना सपनों का घर ढूंढें',
    'hero.subtitle': '<strong>GNA (ग्रेटर नोएडा अथॉरिटी)</strong> और <strong>YEA (यमुना एक्सप्रेसवे अथॉरिटी)</strong> में वेरिफाइड प्रॉपर्टी देखें। RERA रजिस्टर्ड। 100% सुरक्षित।',
    'hero.cta1': 'प्रॉपर्टी देखें', 'hero.cta2': 'विशेषज्ञ से बात करें',
    'hero.stat1': 'लिस्टेड प्रॉपर्टी', 'hero.stat2': 'खुश ग्राहक', 'hero.stat3': 'RERA वेरिफाइड', 'hero.stat4': 'ग्राहक रेटिंग', 'hero.stat5': 'अथॉरिटी अप्रूव्ड',
    'search.buy': '🏠 खरीदें', 'search.rent': '🔑 किराया', 'search.land': '🌍 जमीन/प्लॉट',
    'search.btn': 'प्रॉपर्टी खोजें', 'search.location_ph': 'सेक्टर, इलाका या प्रोजेक्ट दर्ज करें...',
    'trust.rera': 'RERA रजिस्टर्ड', 'trust.gna': 'GNA अथॉरिटी प्रमाणित', 'trust.yea': 'YEA अथॉरिटी प्रमाणित',
    'trust.secure': 'सुरक्षित और वेरिफाइड', 'trust.rating': '4.9/5 रेटिंग', 'trust.count': '500+ प्रॉपर्टी',
    'cat.title': 'श्रेणी के अनुसार खोजें', 'cat.subtitle': 'अपनी जरूरत के अनुसार प्रॉपर्टी टाइप चुनें',
    'cat.all': 'सभी', 'cat.flat': 'फ्लैट', 'cat.room': 'कमरे', 'cat.hostel': 'हॉस्टल/PG', 'cat.building': 'बिल्डिंग', 'cat.plot': 'प्लॉट', 'cat.house': 'मकान',
    'feat.title': 'फीचर्ड प्रॉपर्टी', 'feat.subtitle': 'ग्रेटर नोएडा में चुनिंदा लिस्टिंग',
    'feat.viewall': 'सभी देखें →', 'feat.loadmore': 'और प्रॉपर्टी लोड करें',
    'chip.all': 'सभी', 'chip.sale': 'बिक्री के लिए', 'chip.rent': 'किराए के लिए', 'chip.land': 'जमीन/प्लॉट',
    'sort.default': 'क्रम: डिफ़ॉल्ट', 'sort.price_low': 'कीमत: कम से ज्यादा', 'sort.price_high': 'कीमत: ज्यादा से कम', 'sort.newest': 'सबसे नया पहले',
    'stats.props': 'लिस्टेड प्रॉपर्टी', 'stats.clients': 'खुश ग्राहक', 'stats.years': 'साल का अनुभव', 'stats.deals': 'सौदे बंद',
    'test.title': 'हमारे ग्राहक क्या कहते हैं', 'test.subtitle': 'ग्रेटर नोएडा में 1200+ परिवारों का विश्वास',
    'why.title': 'City Property क्यों चुनें?', 'why.subtitle': 'ग्रेटर नोएडा में आपका विश्वसनीय रियल एस्टेट पार्टनर',
    'auth.title': 'दोनों अथॉरिटी क्षेत्रों में सेवा', 'auth.subtitle': 'GNA और YEA दोनों क्षेत्रों का विशेषज्ञ ज्ञान',
    'contact.title': 'संपर्क करें', 'contact.subtitle': 'हम आपकी सही प्रॉपर्टी ढूंढने में मदद करने के लिए यहाँ हैं',
    'modal.title': 'WhatsApp पर पूछताछ करें', 'modal.sub': 'हमारी टीम कुछ ही मिनटों में जवाब देगी',
    'modal.send': 'WhatsApp पर पूछताछ भेजें', 'modal.cid': 'पूछताछ ID:',
    'footer.copy': '© 2025 City Property. सर्वाधिकार सुरक्षित। | RERA रजिस्टर्ड | GNA & YEA प्रमाणित',
  }
};

/* ─── DYNAMIC PROPERTIES (LOADED FROM FIREBASE / ADMIN POSTS) ─── */
let ALL_PROPERTIES = [];

function loadLiveProperties() {
  // 1. Load from local cache
  const local = JSON.parse(localStorage.getItem('cp_properties') || '[]');
  ALL_PROPERTIES = local;

  // 2. Sync from Firebase Cloud Realtime Database
  if (window.fetchPropertiesFromFirebase) {
    window.fetchPropertiesFromFirebase().then(cloudProps => {
      if (cloudProps && cloudProps.length > 0) {
        ALL_PROPERTIES = cloudProps;
        localStorage.setItem('cp_properties', JSON.stringify(cloudProps));
        updateTypeCounts();
        applyFilters();
      }
    }).catch(err => console.warn('Cloud sync:', err));
  }
}
loadLiveProperties();

/* ─── STATE ─── */
let currentLang = 'en';
let activeCategory = 'all';
let activeType = 'all';
let activeSearchTab = 'buy';
let currentSort = 'default';
let shownCount = 6;
let wishlistIds = JSON.parse(localStorage.getItem('cp_wishlist') || '[]');
let currentModalProp = '';

/* ─── LANGUAGE TOGGLE ─── */
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('cp_lang', lang);
  const dict = I18N[lang];
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });
  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });
  // Toggle active button
  document.getElementById('langEn').classList.toggle('active', lang === 'en');
  document.getElementById('langHi').classList.toggle('active', lang === 'hi');
  // Re-render with current state
  applyFilters();
}

/* ─── THEME ─── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('cp_theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  }
}

function initTheme() {
  const saved = localStorage.getItem('cp_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── NAVBAR SCROLL ─── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── HAMBURGER MENU ─── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

/* ─── SEARCH TAB ─── */
function setTab(el, tab) {
  activeSearchTab = tab;
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  // Update placeholder based on tab
  const locInput = document.getElementById('searchLocation');
  if (locInput) {
    const ph = {
      buy: 'Enter sector or locality to buy...',
      rent: 'Enter sector or locality to rent...',
      land: 'Enter area or expressway sector...'
    };
    locInput.placeholder = ph[tab] || locInput.placeholder;
  }
}

/* ─── SEARCH ─── */
function doSearch() {
  const location = (document.getElementById('searchLocation')?.value || '').toLowerCase().trim();
  const type = document.getElementById('searchType')?.value || '';
  const budgetRaw = document.getElementById('searchBudget')?.value || '';
  const bhk = document.getElementById('searchBHK')?.value || '';

  let results = [...ALL_PROPERTIES];

  // Filter by listing tab
  if (activeSearchTab === 'buy') results = results.filter(p => p.listingType === 'sale');
  else if (activeSearchTab === 'rent') results = results.filter(p => p.listingType === 'rent');
  else if (activeSearchTab === 'land') results = results.filter(p => p.type === 'plot');

  // Location keyword
  if (location) {
    results = results.filter(p =>
      p.location.toLowerCase().includes(location) ||
      p.title.toLowerCase().includes(location)
    );
  }
  // Type
  if (type) results = results.filter(p => p.type === type);
  // Budget
  if (budgetRaw && budgetRaw !== '20000000+') {
    const [min, max] = budgetRaw.split('-').map(Number);
    results = results.filter(p => p.price >= min && p.price <= max);
  } else if (budgetRaw === '20000000+') {
    results = results.filter(p => p.price >= 20000000);
  }
  // BHK
  if (bhk === 'studio') {
    results = results.filter(p => p.type === 'hostel' || (p.beds && p.beds === 1));
  } else if (bhk === '4') {
    results = results.filter(p => p.beds && p.beds >= 4);
  } else if (bhk) {
    results = results.filter(p => p.beds && p.beds === parseInt(bhk));
  }

  // Render results
  activeCategory = 'all';
  activeType = 'all';
  shownCount = results.length || 6;
  renderProperties(results.slice(0, 9));
  // Scroll to properties
  document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Found ${results.length} propert${results.length === 1 ? 'y' : 'ies'} matching your search`, 'info');
}

/* ─── LOAD / RENDER PROPERTIES ─── */
function loadProperties() {
  updateTypeCounts();
  applyFilters();
}

function applyFilters() {
  let filtered = [...ALL_PROPERTIES];
  if (activeCategory !== 'all') filtered = filtered.filter(p => p.type === activeCategory);
  if (activeType !== 'all') {
    if (activeType === 'land') filtered = filtered.filter(p => p.type === 'plot');
    else filtered = filtered.filter(p => p.listingType === activeType);
  }
  // Sort
  if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === 'newest') filtered.sort((a, b) => a.addedDays - b.addedDays);

  const displayed = filtered.slice(0, shownCount);
  renderProperties(displayed);

  const countEl = document.getElementById('propCount');
  if (countEl) countEl.textContent = `Showing ${displayed.length} of ${filtered.length} properties`;

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = filtered.length > shownCount ? 'inline-flex' : 'none';
}

function renderProperties(props) {
  const grid = document.getElementById('propsGrid');
  if (!grid) return;
  if (props.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:50px 20px; background:var(--card-bg); border-radius:16px; border:2px dashed var(--border);">
        <div style="font-size:3rem; margin-bottom:12px;">🏡</div>
        <h3 style="color:var(--text); margin-bottom:8px; font-size:1.25rem;">Looking to Buy or Sell Property in Greater Noida?</h3>
        <p style="color:var(--text-light); max-width:540px; margin:0 auto 20px; font-size:0.9rem; line-height:1.5;">
          Direct verified buyers & sellers network. Hamari team se seedha connect karein aur apni requirement batayein!
        </p>
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <a href="#sell" class="btn btn-primary" style="text-decoration:none;">
            <i class="fas fa-bullhorn"></i> Sell Property (Hum Buyers Denge)
          </a>
          <a href="https://wa.me/919711733120?text=Hello%20City%20Property,%20mujhe%20property%20kharidni%20hai" target="_blank" class="btn btn-whatsapp" style="text-decoration:none;">
            <i class="fab fa-whatsapp"></i> Buy Property (Contact Team)
          </a>
        </div>
      </div>`;
    return;
  }
  grid.innerHTML = props.map(createPropertyCard).join('');
}

function createPropertyCard(prop) {
  const isWishlisted = wishlistIds.includes(prop.id);
  const bedsInfo = prop.beds ? `<div class="prop-feat"><i class="fas fa-bed"></i> ${prop.beds} Bed</div>` : '';
  const bathInfo = prop.baths ? `<div class="prop-feat"><i class="fas fa-bath"></i> ${prop.baths} Bath</div>` : '';
  const sizeInfo = `<div class="prop-feat"><i class="fas fa-expand-arrows-alt"></i> ${prop.size}</div>`;

  const reraBadge = prop.rera
    ? `<span class="badge badge-rera"><i class="fas fa-certificate"></i> RERA</span>`
    : '';
  const authorityBadge = prop.authority === 'gna'
    ? `<span class="badge badge-gna"><i class="fas fa-landmark"></i> GNA</span>`
    : `<span class="badge badge-yea"><i class="fas fa-road"></i> YEA</span>`;

  const newBadge = prop.isNew
    ? `<span style="position:absolute;top:12px;right:50px;background:var(--accent);color:#fff;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:12px;">NEW</span>`
    : '';

  const badgeClass = {
    sale: 'badge-sale', rent: 'badge-rent', land: 'badge-land', hostel: 'badge-hostel'
  }[prop.badge] || 'badge-sale';

  const badgeLabel = {
    sale: 'For Sale', rent: 'For Rent', land: 'Land / Plot', hostel: 'Hostel / PG'
  }[prop.badge] || prop.badge;

  return `
<div class="prop-card" data-id="${prop.id}">
  <div class="prop-img-wrap">
    <div class="prop-img-placeholder">${prop.emoji}</div>
    <div class="prop-badges">
      <span class="badge ${badgeClass}">${badgeLabel}</span>
    </div>
    ${newBadge}
    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}"
      onclick="toggleWishlist(${prop.id}, this)"
      title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
      <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
    </button>
  </div>
  <div class="prop-body">
    <div class="prop-type">${prop.type.toUpperCase()} · ${prop.authority.toUpperCase()}</div>
    <h3 class="prop-title">${prop.title}</h3>
    <div class="prop-location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</div>
    <div class="prop-price" style="display:flex;align-items:center;gap:8px;">
      <a href="tel:9711733120" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;padding:6px 14px;border-radius:50px;font-size:0.88rem;font-weight:800;text-decoration:none;box-shadow:0 2px 8px rgba(230,81,0,0.25);">
        <i class="fas fa-phone-alt"></i> Price on Call
      </a>
      <span style="font-size:0.75rem;color:var(--text-light);font-weight:600;">(Call 97117 33120)</span>
    </div>
    <div class="prop-features">
      ${bedsInfo}${bathInfo}${sizeInfo}
    </div>
    <div class="prop-badges-row">
      ${reraBadge}${authorityBadge}
      ${prop.verified ? '<span class="badge" style="background:#e8f5e9;color:var(--success);"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
    </div>
    <div class="prop-actions">
      <a href="property-detail.html?id=${prop.id}" class="btn btn-outline">
        <i class="fas fa-eye"></i> Details
      </a>
      <button class="btn btn-wa" onclick="openWAModal('${escHtml(prop.title)}')">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </button>
    </div>
  </div>
</div>`;
}

function escHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ─── FILTER BY CATEGORY ─── */
function filterByCategory(cat, el) {
  activeCategory = cat;
  shownCount = 6;
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  applyFilters();
}

/* ─── FILTER BY TYPE (chips) ─── */
function filterByType(type, el) {
  activeType = type;
  shownCount = 6;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  applyFilters();
}

/* ─── SORT ─── */
function sortProperties(val) {
  currentSort = val;
  applyFilters();
}

/* ─── LOAD MORE ─── */
function loadMore() {
  shownCount += 3;
  applyFilters();
  showToast('More properties loaded!', 'success');
}

/* ─── UPDATE TYPE COUNTS ─── */
function updateTypeCounts() {
  const types = ['flat', 'room', 'hostel', 'building', 'plot', 'house'];
  const idMap = {
    flat: 'catCountFlat', room: 'catCountRoom', hostel: 'catCountHostel',
    building: 'catCountBuilding', plot: 'catCountPlot', house: 'catCountHouse'
  };
  types.forEach(t => {
    const count = ALL_PROPERTIES.filter(p => p.type === t).length;
    const el = document.getElementById(idMap[t]);
    if (el) el.textContent = `${count} listing${count !== 1 ? 's' : ''}`;
  });
  const allEl = document.getElementById('catCountAll');
  if (allEl) allEl.textContent = `${ALL_PROPERTIES.length} listings`;
}

function updateHeroCounts() {
  const el = document.getElementById('heroProps');
  if (el) el.textContent = `${ALL_PROPERTIES.length * 10}+`;
}

/* ─── STATS COUNTER ANIMATION ─── */
function animateStats() {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + '+';
          if (current >= target) clearInterval(timer);
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

/* ─── WISHLIST ─── */
function toggleWishlist(id, btn) {
  const idx = wishlistIds.indexOf(id);
  if (idx === -1) {
    wishlistIds.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('Added to wishlist ❤️', 'success');
  } else {
    wishlistIds.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('Removed from wishlist', 'info');
  }
  localStorage.setItem('cp_wishlist', JSON.stringify(wishlistIds));
}

/* ─── WHATSAPP MODAL ─── */
function openWAModal(propName) {
  currentModalProp = propName;
  const overlay = document.getElementById('waModal');
  const propNameEl = document.getElementById('modalPropName');
  const cidEl = document.getElementById('modalCID');
  if (!overlay) return;
  if (propNameEl) propNameEl.textContent = propName;
  if (cidEl) cidEl.textContent = generateCID();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWAModal(e) {
  if (e && e.target !== document.getElementById('waModal')) return;
  const overlay = document.getElementById('waModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function generateCID() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `CP-${ts}-${rand}`;
}

function sendToWhatsApp() {
  const name = document.getElementById('modalName')?.value.trim() || '';
  const phone = document.getElementById('modalPhone')?.value.trim() || '';
  const interest = document.getElementById('modalInterest')?.value || 'Info';
  const cid = document.getElementById('modalCID')?.textContent || generateCID();

  if (!name) { showToast('Please enter your name', 'error'); return; }
  if (!phone || phone.length < 10) { showToast('Please enter a valid phone number', 'error'); return; }

  const msg = encodeURIComponent(
    `🏡 *City Property Enquiry*\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Enquiry ID:* ${cid}\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🔍 *Interest:* ${interest}\n` +
    `🏠 *Property:* ${currentModalProp}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `Please contact me regarding this property. Thank you!`
  );
  window.open(`https://wa.me/919711733120?text=${msg}`, '_blank');
  closeWAModal(null);
  showToast('Opening WhatsApp... 📱', 'success');
}

/* ─── INQUIRY FORM (CONTACT SECTION) ─── */
function genCIDFromInquiry() {
  const ts = Date.now().toString(36).toUpperCase();
  return `CPQ-${ts}`;
}

function sendInquiryWhatsApp() {
  const name = document.getElementById('inqName')?.value.trim() || '';
  const phone = document.getElementById('inqPhone')?.value.trim() || '';
  const interest = document.getElementById('inqInterest')?.value || '';
  const budget = document.getElementById('inqBudget')?.value || 'Not specified';
  const msg_text = document.getElementById('inqMsg')?.value.trim() || '';
  const cid = genCIDFromInquiry();

  if (!name) { showToast('Please enter your name', 'error'); return; }
  if (!phone || phone.length < 10) { showToast('Please enter a valid mobile number', 'error'); return; }

  const text = encodeURIComponent(
    `🏡 *City Property Inquiry*\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Inquiry ID:* ${cid}\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🔍 *Interested In:* ${interest}\n` +
    `💰 *Budget:* ${budget}\n` +
    `📝 *Message:* ${msg_text || 'No message'}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `Please assist with my property inquiry. Thank you!`
  );
  window.open(`https://wa.me/919711733120?text=${text}`, '_blank');
  showToast('Opening WhatsApp! We\'ll respond soon 📱', 'success');
}

/* ─── TOAST ─── */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.prop-card, .why-card, .testimonial-card, .cat-card, .authority-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Init theme
  initTheme();
  // Init language
  const savedLang = localStorage.getItem('cp_lang') || 'en';
  if (savedLang !== 'en') setLang(savedLang);
  // Load properties
  loadProperties();
  updateHeroCounts();
  // Navbar scroll
  initNavbarScroll();
  // Stats counter animation
  animateStats();
  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu && menu.classList.contains('open') &&
        !menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  // Scroll animations
  setTimeout(initScrollAnimations, 300);
  // Check auth if available
  if (typeof checkAuthState === 'function') checkAuthState();
});



// ============================================================
// SELLER CONNECT TO WHATSAPP FUNCTION (BROKER MODEL)
// ============================================================
function updateSellerCID() {
  const phoneInput = document.getElementById('sellerPhone');
  if (!phoneInput) return;
  const phone = phoneInput.value.replace(/\D/g, '');
  const box = document.getElementById('sellerCIDBox');
  const val = document.getElementById('sellerCIDVal');
  if (phone.length >= 5) {
    const cid = 'CID-' + phone.substring(0, 5);
    if (val) val.textContent = cid;
    if (box) box.style.display = 'block';
  } else {
    if (box) box.style.display = 'none';
  }
}

function selectQuickSize(sqm) {
  const input = document.getElementById('sellerSizeSqMtr');
  if (input) input.value = sqm;
}

function connectSellerWhatsApp() {
  const nameEl = document.getElementById('sellerName');
  const phoneEl = document.getElementById('sellerPhone');
  const propTypeEl = document.getElementById('sellerPropType');
  const priceEl = document.getElementById('sellerPrice');
  const locationEl = document.getElementById('sellerLocation');
  const sizeInput = document.getElementById('sellerSizeSqMtr');
  const sizeUnit = document.getElementById('sellerSizeUnit');

  const name = nameEl ? nameEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.replace(/\D/g, '') : '';
  const propType = propTypeEl ? propTypeEl.value : 'Plot / Land';
  const price = priceEl ? priceEl.value.trim() : '';
  const location = locationEl ? locationEl.value.trim() : '';
  const sizeVal = sizeInput ? sizeInput.value.trim() : '';
  const unitVal = sizeUnit ? sizeUnit.value : 'Sq. Mtr';

  if (phone.length < 5) {
    alert('Please enter at least 5 digits of your phone number.');
    return;
  }

  const cid = 'CID-' + phone.substring(0, 5);
  let msg = '🏠 *SELLER INQUIRY — PROPERTY SELL KARWANI HAI*\n';
  msg += '━━━━━━━━━━━━━━━━━━\n';
  msg += '🆔 *Customer ID:* ' + cid + '\n';
  if (name) msg += '👤 *Owner Name:* ' + name + '\n';
  msg += '📱 *Mobile Number:* ' + phone + '\n';
  msg += '🏷️ *Property Type:* ' + propType + '\n';
  if (sizeVal) msg += '📐 *Size / Area:* ' + sizeVal + ' ' + unitVal + ' (Square Meter)\n';
  if (price) msg += '💰 *Expected Price:* ' + price + '\n';
  if (location) msg += '📍 *Sector / Location:* ' + location + '\n';
  msg += '━━━━━━━━━━━━━━━━━━\n';
  msg += '🤝 *Role:* Hum broker ke roop mein aapke liye genuine buyers provide karwayenge taaki aapki property best rate par SELL ho sake!\n';
  msg += '⏰ *Date:* ' + new Date().toLocaleDateString('en-IN');

  const url = 'https://wa.me/919711733120?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}
