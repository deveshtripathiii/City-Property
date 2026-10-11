/* =========================================================
   City Property – listings.js  (Listings Page)
   Phone: 9711733120 | WhatsApp: 919711733120
   ========================================================= */

'use strict';

/* ─── ALL PROPERTIES (9+ with full fields) ─── */
/* ─── DYNAMIC PROPERTIES (LOADED FROM FIREBASE / ADMIN POSTS) ─── */
let LISTINGS = JSON.parse(localStorage.getItem('cp_properties') || '[]');

function syncListingsFromCloud() {
  if (window.fetchPropertiesFromFirebase) {
    window.fetchPropertiesFromFirebase().then(cloudProps => {
      if (cloudProps && cloudProps.length > 0) {
        LISTINGS = cloudProps;
        localStorage.setItem('cp_properties', JSON.stringify(cloudProps));
        applyAllFilters();
      }
    }).catch(e => console.warn(e));
  }
}
syncListingsFromCloud();

/* ─── STATE ─── */
let currentView = 'grid';
let currentSort = 'newest';
let shownListingsCount = 9;
let currentModalPropL = '';
let activeBhkFilters = [];
let activeFurnishing = '';
let activePossession = '';
let wishlistIdsL = JSON.parse(localStorage.getItem('cp_wishlist') || '[]');
let filteredCache = [...LISTINGS];

/* ─── AMENITY ICON MAP ─── */
const AMENITY_ICONS = {
  parking: { icon: '🚗', label: 'Parking' },
  gym: { icon: '🏋️', label: 'Gym' },
  pool: { icon: '🏊', label: 'Pool' },
  lift: { icon: '🛗', label: 'Lift' },
  'power-backup': { icon: '⚡', label: 'Power Backup' },
  wifi: { icon: '📶', label: 'WiFi' },
  security: { icon: '🔒', label: 'Security' },
};

/* ─── THEME ─── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('cp_theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

function initThemeL() {
  const saved = localStorage.getItem('cp_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── LANG (minimal for this page) ─── */
function setLangPage(lang) {
  localStorage.setItem('cp_lang', lang);
  document.getElementById('langEn')?.classList.toggle('active', lang === 'en');
  document.getElementById('langHi')?.classList.toggle('active', lang === 'hi');
}

/* ─── NAVBAR ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function toggleMenuPage() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

/* ─── RENDER LISTINGS ─── */
function renderListings(properties) {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  if (!properties.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 style="color:var(--text);margin-bottom:8px;">No properties found</h3>
        <p style="color:var(--text-light);margin-bottom:20px;">Try adjusting your filters or search criteria.</p>
        <button onclick="resetFilters()" style="padding:10px 24px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-family:var(--font);">
          Reset Filters
        </button>
      </div>`;
    updateResultCount(0);
    return;
  }
  grid.innerHTML = properties.map(createListingCard).join('');
  updateResultCount(properties.length);
}

function createListingCard(prop) {
  const isWishlisted = wishlistIdsL.includes(prop.id);

  // Badge type
  let badgeClass = 'badge-sale';
  let badgeLabel = 'For Sale';
  if (prop.listingType === 'rent') { badgeClass = 'badge-rent'; badgeLabel = 'For Rent'; }
  else if (prop.type === 'plot') { badgeClass = 'badge-land'; badgeLabel = 'Land / Plot'; }
  else if (prop.type === 'hostel') { badgeClass = 'badge-hostel'; badgeLabel = 'Hostel / PG'; }

  // Features row
  const bedsHtml = prop.beds ? `<div class="card-feat"><i class="fas fa-bed"></i> ${prop.beds} Bed</div>` : '';
  const bathsHtml = prop.baths ? `<div class="card-feat"><i class="fas fa-bath"></i> ${prop.baths} Bath</div>` : '';
  const sizeHtml = `<div class="card-feat"><i class="fas fa-expand-arrows-alt"></i> ${prop.size}</div>`;
  const viewsHtml = `<div class="card-feat"><i class="fas fa-eye"></i> ${prop.views}</div>`;

  // Badges row
  const reraBadge = prop.rera ? `<span class="badge badge-rera"><i class="fas fa-certificate"></i> RERA</span>` : '';
  const authBadge = prop.authority === 'gna'
    ? `<span class="badge badge-gna"><i class="fas fa-landmark"></i> GNA</span>`
    : `<span class="badge badge-yea"><i class="fas fa-road"></i> YEA</span>`;
  const verifiedBadge = prop.verified ? `<span class="badge badge-verified"><i class="fas fa-check-circle"></i> Verified</span>` : '';

  // Furnishing tag
  const furnishTag = prop.furnishing
    ? `<span class="tag ${prop.furnishing}">${{ furnished: 'Furnished', semi: 'Semi-Furnished', unfurnished: 'Unfurnished' }[prop.furnishing]}</span>`
    : '';

  // Possession tag
  const possTag = prop.possession
    ? `<span class="tag ${prop.possession}">${prop.possession === 'ready' ? 'Ready to Move' : 'Under Construction'}</span>`
    : '';

  // Amenities icons (show up to 5)
  const amenHtml = prop.amenities.slice(0, 5).map(a => {
    const info = AMENITY_ICONS[a] || { icon: '✓', label: a };
    return `<div class="amenity-icon" title="${info.label}">${info.icon}</div>`;
  }).join('');
  const extraAmen = prop.amenities.length > 5
    ? `<div class="amenity-icon" title="More">+${prop.amenities.length - 5}</div>`
    : '';

  // New tag
  const newTag = prop.isNew ? `<div class="card-new-tag">NEW</div>` : '';

  return `
<div class="listing-card" data-id="${prop.id}">
  <div class="card-img-wrap">
    ${prop.image ? `<img src="${prop.image}" alt="${prop.title}" class="card-img" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="card-img-placeholder" style="display:none;">${prop.emoji || '🏢'}</div>` : `<div class="card-img-placeholder">${prop.emoji || '🏢'}</div>`}
    <div class="card-top-badges">
      <span class="badge ${badgeClass}">${badgeLabel}</span>
    </div>
    ${newTag}
    <button class="card-wishlist ${isWishlisted ? 'active' : ''}"
      onclick="toggleWishlistL(${prop.id}, this)"
      title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
      <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
    </button>
  </div>
  <div class="card-body">
    <div class="card-type-row">
      <span class="card-type-label">${prop.type.toUpperCase()}</span>
    </div>
    <h3 class="card-title">${prop.title}</h3>
    <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</div>
    <div class="card-price" style="display:flex;align-items:center;gap:8px;">
      <a href="tel:9711733120" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;padding:6px 14px;border-radius:50px;font-size:0.88rem;font-weight:800;text-decoration:none;box-shadow:0 2px 8px rgba(230,81,0,0.25);">
        <i class="fas fa-phone-alt"></i> Price on Call
      </a>
      <span style="font-size:0.75rem;color:var(--text-light);font-weight:600;">(Call 97117 33120)</span>
    </div>
    <div class="card-feats">
      ${bedsHtml}${bathsHtml}${sizeHtml}${viewsHtml}
    </div>
    <div class="card-tags">
      ${furnishTag}${possTag}
    </div>
    <div class="card-tags" style="margin-top:6px;">
      ${reraBadge}${authBadge}${verifiedBadge}
    </div>
    ${amenHtml || extraAmen ? `<div class="card-amenities">${amenHtml}${extraAmen}</div>` : ''}
    <div class="card-actions">
      <a href="property-detail.html?id=${prop.id}" class="btn btn-outline">
        <i class="fas fa-eye"></i> Details
      </a>
      <button class="btn btn-wa" onclick="openWAModalL('${prop.title.replace(/'/g, "\\'")}')">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </button>
    </div>
  </div>
</div>`;
}

/* ─── APPLY ALL FILTERS ─── */
function applyAllFilters() {
  let results = [...LISTINGS];

  // 1. Keyword
  const keyword = (document.getElementById('filterKeyword')?.value || '').toLowerCase().trim();
  if (keyword) {
    results = results.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.location.toLowerCase().includes(keyword) ||
      p.type.toLowerCase().includes(keyword)
    );
  }

  // 2. Category (radio)
  const listingTypeEl = document.querySelector('input[name="listingType"]:checked');
  const listingType = listingTypeEl ? listingTypeEl.value : '';
  if (listingType === 'sale') results = results.filter(p => p.listingType === 'sale' && p.type !== 'plot');
  else if (listingType === 'rent') results = results.filter(p => p.listingType === 'rent');
  else if (listingType === 'land') results = results.filter(p => p.type === 'plot');
  else if (listingType === 'hostel') results = results.filter(p => p.type === 'hostel');

  // 3. Property type checkboxes
  const checkedTypes = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"][id^="type"]:checked')).map(el => el.value);
  if (checkedTypes.length > 0) {
    results = results.filter(p => checkedTypes.includes(p.type));
  }

  // 4. Price range
  const priceMin = parseInt(document.getElementById('priceMin')?.value || '0', 10) || 0;
  const priceMax = parseInt(document.getElementById('priceMax')?.value || '0', 10) || 0;
  if (priceMin > 0) results = results.filter(p => p.price >= priceMin);
  if (priceMax > 0) results = results.filter(p => p.price <= priceMax);

  // 5. BHK
  if (activeBhkFilters.length > 0) {
    results = results.filter(p => {
      return activeBhkFilters.some(bhk => {
        if (bhk === 'studio') return p.type === 'hostel' || (p.beds && p.beds === 1 && p.size.toLowerCase().includes('studio'));
        if (bhk === '4+') return p.beds && p.beds >= 4;
        return p.beds && p.beds === parseInt(bhk, 10);
      });
    });
  }

  // 6. Furnishing
  if (activeFurnishing) results = results.filter(p => p.furnishing === activeFurnishing);

  // 7. Possession
  if (activePossession) results = results.filter(p => p.possession === activePossession);

  // 8. Authority
  const checkedAuths = Array.from(document.querySelectorAll('input[id^="auth"]:checked')).map(el => el.value);
  if (checkedAuths.length > 0) results = results.filter(p => checkedAuths.includes(p.authority));

  // 9. Amenities
  const checkedAmen = Array.from(document.querySelectorAll('input[id^="amen"]:checked')).map(el => el.value);
  if (checkedAmen.length > 0) {
    results = results.filter(p => checkedAmen.every(a => p.amenities.includes(a)));
  }

  // Sort
  if (currentSort === 'price-low') results.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') results.sort((a, b) => b.price - a.price);
  else if (currentSort === 'popular') results.sort((a, b) => b.views - a.views);
  else results.sort((a, b) => a.addedDays - b.addedDays); // newest

  filteredCache = results;

  // Show sliced
  const displayed = results.slice(0, shownListingsCount);
  renderListings(displayed);

  // Load more button
  const loadMoreBtn = document.getElementById('loadMoreListingsBtn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = results.length > shownListingsCount ? 'inline-flex' : 'none';
  }

  // Update active filter count badge
  updateActiveFilterCount();
  // Update type counts in sidebar
  updateSidebarCounts();
  // Update header subtitle
  updateHeaderSubtitle(results.length);
}

/* ─── RESET FILTERS ─── */
function resetFilters() {
  // Reset keyword
  const kw = document.getElementById('filterKeyword');
  if (kw) kw.value = '';
  // Reset radio
  const defRadio = document.querySelector('input[name="listingType"][value=""]');
  if (defRadio) defRadio.checked = true;
  // Reset type checkboxes
  document.querySelectorAll('.checkbox-group input[type="checkbox"][id^="type"]').forEach(el => el.checked = false);
  // Reset price
  const pmin = document.getElementById('priceMin');
  const pmax = document.getElementById('priceMax');
  if (pmin) pmin.value = '';
  if (pmax) pmax.value = '';
  // Reset BHK chips
  activeBhkFilters = [];
  document.querySelectorAll('#bhkChips .filter-chip').forEach(c => c.classList.remove('active'));
  // Reset furnishing
  activeFurnishing = '';
  document.querySelectorAll('#furnishingChips .filter-chip').forEach(c => c.classList.remove('active'));
  // Reset possession
  activePossession = '';
  document.querySelectorAll('#possessionChips .filter-chip').forEach(c => c.classList.remove('active'));
  // Reset authority
  document.querySelectorAll('input[id^="auth"]').forEach(el => el.checked = false);
  // Reset amenities
  document.querySelectorAll('input[id^="amen"]').forEach(el => el.checked = false);
  // Reset sort
  currentSort = 'newest';
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = 'newest';
  // Reset shown count
  shownListingsCount = 9;
  // Re-apply
  applyAllFilters();
  showToastL('Filters reset!', 'info');
}

/* ─── BHK CHIP TOGGLE (multi-select) ─── */
function toggleBhkChip(el, value) {
  const idx = activeBhkFilters.indexOf(value);
  if (idx === -1) {
    activeBhkFilters.push(value);
    el.classList.add('active');
  } else {
    activeBhkFilters.splice(idx, 1);
    el.classList.remove('active');
  }
  applyAllFilters();
}

/* ─── SINGLE SELECT CHIP (furnishing / possession) ─── */
function toggleSingleChip(el, group, value) {
  const siblings = el.parentElement.querySelectorAll('.filter-chip');
  const isAlreadyActive = el.classList.contains('active');
  siblings.forEach(c => c.classList.remove('active'));

  if (isAlreadyActive) {
    // Deselect
    if (group === 'furnishing') activeFurnishing = '';
    else if (group === 'possession') activePossession = '';
  } else {
    el.classList.add('active');
    if (group === 'furnishing') activeFurnishing = value;
    else if (group === 'possession') activePossession = value;
  }
  applyAllFilters();
}

/* ─── SORT ─── */
function handleSortChange(val) {
  currentSort = val;
  shownListingsCount = 9;
  applyAllFilters();
}

/* ─── UPDATE RESULT COUNT ─── */
function updateResultCount(n) {
  const el = document.getElementById('resultsCount');
  if (el) el.innerHTML = `Showing <strong>${n}</strong> propert${n === 1 ? 'y' : 'ies'}`;
}

/* ─── UPDATE HEADER SUBTITLE ─── */
function updateHeaderSubtitle(n) {
  const el = document.getElementById('headerSubtitle');
  if (el) el.textContent = `Showing ${n} available propert${n === 1 ? 'y' : 'ies'} in Greater Noida`;
}

/* ─── UPDATE SIDEBAR TYPE COUNTS ─── */
function updateSidebarCounts() {
  const types = ['flat', 'room', 'hostel', 'building', 'plot', 'house'];
  const idMap = { flat: 'countFlat', room: 'countRoom', hostel: 'countHostel', building: 'countBuilding', plot: 'countPlot', house: 'countHouse' };
  types.forEach(t => {
    const count = LISTINGS.filter(p => p.type === t).length;
    const el = document.getElementById(idMap[t]);
    if (el) el.textContent = count;
  });
}

/* ─── ACTIVE FILTER COUNT ─── */
function updateActiveFilterCount() {
  let count = 0;
  const kw = document.getElementById('filterKeyword')?.value.trim();
  if (kw) count++;
  const listingTypeEl = document.querySelector('input[name="listingType"]:checked');
  if (listingTypeEl && listingTypeEl.value) count++;
  count += document.querySelectorAll('.checkbox-group input[type="checkbox"][id^="type"]:checked').length;
  if (document.getElementById('priceMin')?.value) count++;
  if (document.getElementById('priceMax')?.value) count++;
  count += activeBhkFilters.length;
  if (activeFurnishing) count++;
  if (activePossession) count++;
  count += document.querySelectorAll('input[id^="auth"]:checked').length;
  count += document.querySelectorAll('input[id^="amen"]:checked').length;

  const badges = [document.getElementById('activeFilterCount'), document.getElementById('mobileFilterCount')];
  badges.forEach(badge => {
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

/* ─── LOAD MORE ─── */
function loadMoreListings() {
  shownListingsCount += 3;
  applyAllFilters();
  showToastL('More properties loaded!', 'success');
}

/* ─── VIEW TOGGLE ─── */
function setView(view) {
  currentView = view;
  const grid = document.getElementById('listingsGrid');
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');
  if (!grid) return;
  if (view === 'list') {
    grid.classList.add('list-view');
    listBtn?.classList.add('active');
    gridBtn?.classList.remove('active');
  } else {
    grid.classList.remove('list-view');
    gridBtn?.classList.add('active');
    listBtn?.classList.remove('active');
  }
  localStorage.setItem('cp_view', view);
}

function toggleView() {
  setView(currentView === 'grid' ? 'list' : 'grid');
}

/* ─── FILTER DRAWER (MOBILE) ─── */
function toggleFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterDrawerOverlay');
  drawer?.classList.toggle('open');
  overlay?.classList.toggle('open');
  document.body.style.overflow = drawer?.classList.contains('open') ? 'hidden' : '';
}

function closeFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterDrawerOverlay');
  drawer?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── WISHLIST ─── */
function toggleWishlistL(id, btn) {
  const idx = wishlistIdsL.indexOf(id);
  if (idx === -1) {
    wishlistIdsL.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToastL('Added to wishlist ❤️', 'success');
  } else {
    wishlistIdsL.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToastL('Removed from wishlist', 'info');
  }
  localStorage.setItem('cp_wishlist', JSON.stringify(wishlistIdsL));
}

/* ─── WHATSAPP MODAL ─── */
function openWAModalL(propName) {
  currentModalPropL = propName;
  const overlay = document.getElementById('waModal');
  const propNameEl = document.getElementById('modalPropNameL');
  const cidEl = document.getElementById('modalCIDL');
  if (!overlay) return;
  if (propNameEl) propNameEl.textContent = propName;
  if (cidEl) cidEl.textContent = generateCIDL();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWAModalL(e) {
  if (e && e.target !== document.getElementById('waModal')) return;
  const overlay = document.getElementById('waModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function generateCIDL() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `CP-${ts}-${rand}`;
}

function sendToWhatsAppL() {
  const name = document.getElementById('modalNameL')?.value.trim() || '';
  const phone = document.getElementById('modalPhoneL')?.value.trim() || '';
  const interest = document.getElementById('modalInterestL')?.value || 'Info';
  const cid = document.getElementById('modalCIDL')?.textContent || generateCIDL();

  if (!name) { showToastL('Please enter your name', 'error'); return; }
  if (!phone || phone.length < 10) { showToastL('Please enter a valid phone number', 'error'); return; }

  const msg = encodeURIComponent(
    `🏡 *City Property Enquiry*\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Enquiry ID:* ${cid}\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🔍 *Interest:* ${interest}\n` +
    `🏠 *Property:* ${currentModalPropL}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `Please contact me regarding this property. Thank you!`
  );
  window.open(`https://wa.me/919711733120?text=${msg}`, '_blank');
  closeWAModalL(null);
  showToastL('Opening WhatsApp... 📱', 'success');
}

/* ─── TOAST ─── */
function showToastL(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ─── HANDLE URL PARAMS (pre-filter from other pages) ─── */
function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const auth = params.get('authority');
  const lt = params.get('listingType');

  if (type) {
    const el = document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (el) { el.checked = true; }
  }
  if (auth) {
    const el = document.getElementById(`auth${auth.toUpperCase()}`);
    if (el) { el.checked = true; }
  }
  if (lt) {
    const el = document.querySelector(`input[name="listingType"][value="${lt}"]`);
    if (el) { el.checked = true; }
  }
  if (type || auth || lt) applyAllFilters();
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  initThemeL();
  // Lang
  const savedLang = localStorage.getItem('cp_lang') || 'en';
  document.getElementById('langEn')?.classList.toggle('active', savedLang === 'en');
  document.getElementById('langHi')?.classList.toggle('active', savedLang === 'hi');
  // Navbar scroll
  initNavbar();
  // Restore view preference
  const savedView = localStorage.getItem('cp_view') || 'grid';
  setView(savedView);
  // Initial render
  updateSidebarCounts();
  handleURLParams();
  applyAllFilters();
  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu && menu.classList.contains('open') && hamburger &&
        !menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
  // Set up live search listener (keyword)
  const keywordInput = document.getElementById('filterKeyword');
  if (keywordInput) {
    let debounceTimer;
    keywordInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyAllFilters, 300);
    });
  }
  // Check auth if available
  if (typeof checkAuthState === 'function') checkAuthState();
});
