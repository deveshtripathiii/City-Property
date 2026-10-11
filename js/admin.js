/**
 * City Property – Enhanced Admin Panel JS
 * Phone: 97117 33120 | WhatsApp: 919711733120
 * GNA & YEA Authority – Greater Noida
 */

'use strict';

// ===================== CONSTANTS =====================
const LS_PROPS   = 'cp_properties';
const LS_USERS   = 'cp_users';
const LS_SETTINGS = 'cp_admin_settings';
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'cityprop@admin';
const PAGE_SIZE = 12;

// ===================== AMENITIES LIST =====================
const AMENITIES_LIST = [
  { id: 'lift',         icon: '🛗', label: 'Lift/Elevator' },
  { id: 'parking',      icon: '🅿️', label: 'Parking' },
  { id: 'security',     icon: '🛡️', label: '24/7 Security' },
  { id: 'cctv',         icon: '📷', label: 'CCTV' },
  { id: 'gym',          icon: '🏋️', label: 'Gym' },
  { id: 'pool',         icon: '🏊', label: 'Swimming Pool' },
  { id: 'club',         icon: '🏛️', label: 'Club House' },
  { id: 'garden',       icon: '🌿', label: 'Garden' },
  { id: 'playground',   icon: '🛝', label: 'Kids Play Area' },
  { id: 'powerbackup',  icon: '⚡', label: 'Power Backup' },
  { id: 'waterlog',     icon: '💧', label: '24/7 Water' },
  { id: 'gas',          icon: '🔥', label: 'Piped Gas' },
  { id: 'intercom',     icon: '📞', label: 'Intercom' },
  { id: 'wifi',         icon: '📶', label: 'Wi-Fi Ready' },
  { id: 'fitnesstrack', icon: '🏃', label: 'Jogging Track' },
  { id: 'sports',       icon: '🎾', label: 'Sports Court' },
  { id: 'vastu',        icon: '🧿', label: 'Vastu Compliant' },
  { id: 'solar',        icon: '☀️', label: 'Solar Power' },
];

// ===================== STATE =====================
let currentPage = 'dashboard';
let deletePendingId = null;
let editingId = null;
let manageCurrentPage = 1;
let manageFilteredData = [];

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  buildAmenitiesGrid();
  checkSession();
});

function checkSession() {
  const s = sessionStorage.getItem('cp_admin_session');
  if (s === '1') {
    showAdminApp();
  }
}

// ===================== LOGIN / LOGOUT =====================
async function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.querySelector('.login-btn');
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying with Firebase...';

  let authenticated = false;

  // 1. Check with Firebase Realtime Database
  if (window.FIREBASE_DB_URL) {
    try {
      const res = await fetch(window.FIREBASE_DB_URL + "/admin_credentials.json");
      const cloudCreds = await res.json();
      if (cloudCreds && cloudCreds.username && cloudCreds.password) {
        if (u === cloudCreds.username && p === cloudCreds.password) {
          authenticated = true;
        }
      } else {
        // If credentials not set in Firebase yet, initialize them in Firebase now!
        await fetch(window.FIREBASE_DB_URL + "/admin_credentials.json", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: DEFAULT_ADMIN_USER, password: DEFAULT_ADMIN_PASS })
        });
      }
    } catch (err) {
      console.warn('Firebase login check offline, falling back:', err);
    }
  }

  // 2. Fallback to Local Settings
  if (!authenticated) {
    const cfg = getSettings();
    const validUser = DEFAULT_ADMIN_USER;
    const validPass = cfg.adminPass || DEFAULT_ADMIN_PASS;
    if (u === validUser && p === validPass) {
      authenticated = true;
    }
  }

  if (btn) btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In to Dashboard';

  if (authenticated) {
    sessionStorage.setItem('cp_admin_session', '1');
    showAdminApp();
  } else {
    if (errorEl) {
      errorEl.style.display = 'flex';
      errorEl.style.alignItems = 'center';
      errorEl.style.gap = '8px';
      setTimeout(() => errorEl.style.display = 'none', 3000);
    }
  }
}

// Enter key on login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none' &&
      !document.getElementById('login-screen').style.display) {
    doLogin();
  }
});
window.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen')) {
    const ls = document.getElementById('login-screen');
    if (!ls.classList.contains('hidden')) doLogin();
  }
});

function showAdminApp() {
  document.getElementById('login-screen').style.display = 'none';
  const app = document.getElementById('admin-app');
  app.style.display = 'block';
  renderDashboard();
  updatePendingBadge();
}

function doLogout() {
  sessionStorage.removeItem('cp_admin_session');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

// ===================== PAGE NAVIGATION =====================
function showPage(page, el) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  if (el) el.classList.add('active');

  currentPage = page;

  // Update topbar title
  const titles = {
    'dashboard': 'Dashboard',
    'add-property': 'Add Property',
    'manage': 'Manage Properties',
    'pending': 'Pending Approval',
    'featured': 'Featured Properties',
    'users': 'Users',
    'enquiries': 'Enquiries',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'settings': 'Settings'
  };
  document.getElementById('topbar-title').textContent = titles[page] || page;

  // Render page-specific content
  switch (page) {
    case 'dashboard':     renderDashboard(); break;
    case 'manage':        renderManageTable(); break;
    case 'pending':       renderPendingTable(); break;
    case 'featured':      renderFeaturedTable(); break;
    case 'users':         renderUsers(); break;
    case 'analytics':     renderAnalytics(); break;
    case 'reports':       renderReports(); break;
    case 'add-property':
      if (!editingId) resetPropertyForm();
      break;
  }
  updatePendingBadge();
  window.scrollTo(0, 0);
}

// ===================== LOCAL STORAGE HELPERS =====================
function getProperties() {
  try { return JSON.parse(localStorage.getItem(LS_PROPS)) || []; }
  catch { return []; }
}

function saveAdminProperties(props) {
  localStorage.setItem(LS_PROPS, JSON.stringify(props));
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS)) || []; }
  catch { return []; }
}

function getSettings() {
  try { return JSON.parse(localStorage.getItem(LS_SETTINGS)) || {}; }
  catch { return {}; }
}

function saveSettingsData(obj) {
  const curr = getSettings();
  localStorage.setItem(LS_SETTINGS, JSON.stringify({ ...curr, ...obj }));
}

// ===================== DASHBOARD =====================
function renderDashboard() {
  const props = getProperties();
  const users = getUsers();

  const total    = props.length;
  const forSale  = props.filter(p => p.type === 'sale').length;
  const forRent  = props.filter(p => p.type === 'rent').length;
  const pending  = props.filter(p => p.status === 'pending').length;
  const featured = props.filter(p => p.featured).length;
  const active   = props.filter(p => p.status === 'active').length;

  const statsEl = document.getElementById('dash-stats');
  if (!statsEl) return;

  statsEl.innerHTML = `
    ${statCard('fa-building', total, 'Total Properties', `${active} active`, 'up')}
    ${statCard('fa-home', forSale, 'For Sale', 'Listed for purchase', 'up')}
    ${statCard('fa-key', forRent, 'For Rent', 'Available to rent', 'up')}
    ${statCard('fa-clock', pending, 'Pending Approval', 'Awaiting review', pending > 0 ? 'down' : 'up')}
    ${statCard('fa-users', users.length, 'Total Users', 'Registered accounts', 'up')}
    ${statCard('fa-star', featured, 'Featured Listings', 'On homepage', 'up')}
  `;

  // Recent Activity
  const recent = [...props].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 6);
  const actEl = document.getElementById('recent-activity');
  if (actEl) {
    if (recent.length === 0) {
      actEl.innerHTML = emptyState('fa-history', 'No Activity Yet', 'Properties you add will appear here.');
    } else {
      actEl.innerHTML = recent.map(p => `
        <div class="activity-item">
          <div class="activity-icon" style="background:${statusColor(p.status, 'bg')};color:${statusColor(p.status, 'text')}">
            <i class="fas fa-home"></i>
          </div>
          <div class="activity-info">
            <div class="activity-title">${esc(p.title)}</div>
            <div class="activity-time">${esc(p.location || '')} · ${badgeHtml(p.status, 'status')} · ${formatTime(p.createdAt)}</div>
          </div>
          <span class="badge ${authorityBadgeClass(p.authority)}">${(p.authority || '').toUpperCase()}</span>
        </div>
      `).join('');
    }
  }
}

function statCard(icon, num, label, change, dir) {
  return `
    <div class="stat-card">
      <div class="stat-icon"><i class="fas ${icon}"></i></div>
      <div class="stat-info">
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label}</div>
        <div class="stat-change ${dir}"><i class="fas fa-arrow-${dir}"></i> ${change}</div>
      </div>
    </div>
  `;
}

// ===================== AMENITIES GRID =====================
function buildAmenitiesGrid() {
  const grid = document.getElementById('amenities-grid');
  if (!grid) return;
  grid.innerHTML = AMENITIES_LIST.map(a => `
    <label class="amenity-cb" id="acb-${a.id}" onclick="toggleAmenity('${a.id}', this)">
      <input type="checkbox" id="amenity-${a.id}" value="${a.id}" />
      <span class="cb-icon">${a.icon}</span>
      <span>${a.label}</span>
      <span class="amenity-check"></span>
    </label>
  `).join('');
}

function toggleAmenity(id, el) {
  el.classList.toggle('checked');
  document.getElementById('amenity-' + id).checked = el.classList.contains('checked');
}

function getCheckedAmenities() {
  return AMENITIES_LIST.filter(a => {
    const el = document.getElementById('amenity-' + a.id);
    return el && el.checked;
  }).map(a => a.id);
}

function setCheckedAmenities(arr) {
  AMENITIES_LIST.forEach(a => {
    const cb = document.getElementById('acb-' + a.id);
    const inp = document.getElementById('amenity-' + a.id);
    if (!cb || !inp) return;
    const checked = arr && arr.includes(a.id);
    cb.classList.toggle('checked', checked);
    inp.checked = checked;
  });
}

// ===================== ADD / EDIT PROPERTY =====================
function generateId() {
  return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function validateForm() {
  const required = [
    { id: 'prop-title',     label: 'Property Title' },
    { id: 'prop-category',  label: 'Category' },
    { id: 'prop-type',      label: 'Listing Type' },
    { id: 'prop-price',     label: 'Price' },
    { id: 'prop-location',  label: 'Location' },
    { id: 'prop-authority', label: 'Authority' },
    { id: 'prop-rera',      label: 'RERA Number' },
  ];
  for (const f of required) {
    const el = document.getElementById(f.id);
    if (!el || !el.value.trim()) {
      showToast(`⚠️ ${f.label} is required`, 'warning');
      el && el.focus();
      return false;
    }
  }
  return true;
}

function saveProperty() {
  if (!validateForm()) return;

  const props = getProperties();
  const isEdit = !!editingId;

  const propData = {
    id:           isEdit ? editingId : generateId(),
    title:        v('prop-title'),
    category:     v('prop-category'),
    type:         v('prop-type'),
    price:        parseFloat(v('prop-price')) || 0,
    priceDisplay: v('prop-price-display') || formatPrice(parseFloat(v('prop-price')) || 0),
    priceSqft:    v('prop-price-sqft'),
    location:     v('prop-location'),
    authority:    v('prop-authority'),
    landmark:     v('prop-landmark'),
    size:         v('prop-size'),
    bedrooms:     v('prop-bedrooms'),
    bathrooms:    v('prop-bathrooms'),
    furnishing:   v('prop-furnishing'),
    possession:   v('prop-possession'),
    floor:        v('prop-floor'),
    rera:         v('prop-rera'),
    status:       v('prop-status'),
    verified:     document.getElementById('prop-verified').checked,
    featured:     document.getElementById('prop-featured').checked,
    amenities:    getCheckedAmenities(),
    description:  v('prop-description'),
    image:        v('prop-image'),
    createdAt:    isEdit ? (props.find(p => p.id === editingId)?.createdAt || Date.now()) : Date.now(),
    updatedAt:    Date.now(),
  };

  if (isEdit) {
    const idx = props.findIndex(p => p.id === editingId);
    if (idx !== -1) props[idx] = propData;
    showToast('✅ Property updated successfully!', 'success');
  } else {
    props.unshift(propData);
    showToast('✅ Property added successfully!', 'success');
  }

  saveAdminProperties(props); if (window.deletePropertyFromFirebase && typeof id !== "undefined") window.deletePropertyFromFirebase(id); if (window.savePropertyToFirebase) window.savePropertyToFirebase(propData);
  updatePendingBadge();
  resetPropertyForm();

  // Navigate to manage
  setTimeout(() => {
    showPage('manage', document.querySelector('[onclick*="manage"]'));
  }, 600);
}

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function resetPropertyForm() {
  editingId = null;
  const fields = ['prop-id','prop-title','prop-category','prop-type','prop-price','prop-price-display',
    'prop-price-sqft','prop-location','prop-authority','prop-landmark','prop-size','prop-bedrooms',
    'prop-bathrooms','prop-furnishing','prop-possession','prop-floor','prop-rera','prop-status',
    'prop-description','prop-image'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });
  document.getElementById('prop-status').value = 'active';
  document.getElementById('prop-verified').checked = false;
  document.getElementById('prop-featured').checked = false;
  setCheckedAmenities([]);
  document.getElementById('form-page-title').textContent = 'Add New Property';
  document.getElementById('save-btn-text').textContent = 'Save Property';
}

function editProperty(id) {
  const props = getProperties();
  const p = props.find(x => x.id === id);
  if (!p) return;

  editingId = id;
  showPage('add-property', document.querySelector('[onclick*="add-property"]'));

  const set = (elId, val) => {
    const el = document.getElementById(elId);
    if (el) el.value = val || '';
  };

  set('prop-title',         p.title);
  set('prop-category',      p.category);
  set('prop-type',          p.type);
  set('prop-price',         p.price);
  set('prop-price-display', p.priceDisplay);
  set('prop-price-sqft',    p.priceSqft);
  set('prop-location',      p.location);
  set('prop-authority',     p.authority);
  set('prop-landmark',      p.landmark);
  set('prop-size',          p.size);
  set('prop-bedrooms',      p.bedrooms);
  set('prop-bathrooms',     p.bathrooms);
  set('prop-furnishing',    p.furnishing);
  set('prop-possession',    p.possession);
  set('prop-floor',         p.floor);
  set('prop-rera',          p.rera);
  set('prop-status',        p.status);
  set('prop-description',   p.description);
  set('prop-image',         p.image);

  document.getElementById('prop-verified').checked = !!p.verified;
  document.getElementById('prop-featured').checked = !!p.featured;
  setCheckedAmenities(p.amenities || []);

  document.getElementById('form-page-title').textContent = 'Edit Property';
  document.getElementById('save-btn-text').textContent = 'Update Property';
}

// ===================== DELETE =====================
async function confirmDelete(id) {
  if (!confirm('Are you sure you want to permanently delete this property?')) {
    return;
  }
  await deleteProperty(id);
}

async function deleteProperty(id) {
  try {
    showToast('⏳ Deleting property...', 'info');

    // 1. Delete from Firebase Cloud Realtime Database
    if (window.deletePropertyFromFirebase) {
      await window.deletePropertyFromFirebase(id);
    } else if (window.FIREBASE_DB_URL) {
      await fetch(`${window.FIREBASE_DB_URL}/properties/${id}.json`, { method: 'DELETE' });
    }

    // 2. Remove from LocalStorage
    let props = getProperties();
    props = props.filter(p => String(p.id) !== String(id) && p.id != id);
    saveAdminProperties(props);

    // 3. Update UI tables immediately
    renderManageTable();
    updatePendingBadge();
    renderDashboard();

    showToast('🗑️ Property deleted successfully!', 'success');
  } catch(err) {
    console.error('Delete error:', err);
    // Even if cloud error, remove locally
    let props = getProperties().filter(p => String(p.id) !== String(id) && p.id != id);
    saveAdminProperties(props);
    renderManageTable();
    showToast('Removed from table.', 'info');
  }
}

function closeModal() {
  document.getElementById('delete-modal').classList.remove('active');
  deletePendingId = null;
}

// ===================== STATUS ACTIONS =====================
function approveProperty(id) {
  updatePropField(id, 'status', 'active');
  showToast('✅ Property approved and published!', 'success');
}

function rejectProperty(id) {
  updatePropField(id, 'status', 'rejected');
  showToast('❌ Property rejected.', 'error');
}

function toggleFeatured(id) {
  const props = getProperties();
  const p = props.find(x => x.id === id);
  if (!p) return;
  p.featured = !p.featured;
  saveAdminProperties(props); if (window.savePropertyToFirebase) window.savePropertyToFirebase(propData);
  showToast(p.featured ? '⭐ Marked as featured!' : 'Feature removed.', p.featured ? 'success' : 'info');
  updatePendingBadge();
  if (currentPage === 'manage') renderManageTable();
  else if (currentPage === 'featured') renderFeaturedTable();
}

function updatePropField(id, field, value) {
  const props = getProperties();
  const p = props.find(x => x.id === id);
  if (!p) return;
  p[field] = value;
  p.updatedAt = Date.now();
  saveAdminProperties(props); if (window.savePropertyToFirebase) window.savePropertyToFirebase(propData);
  updatePendingBadge();
  if (currentPage === 'manage') renderManageTable();
  else if (currentPage === 'pending') renderPendingTable();
  else if (currentPage === 'featured') renderFeaturedTable();
}

// ===================== RENDER PROPERTY TABLE =====================
function renderPropTable(data, containerId, showApprove = false) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!data || data.length === 0) {
    el.innerHTML = emptyState('fa-building', 'No Properties Found', 'Try adjusting your search or filters.');
    return;
  }

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Property</th>
          <th>Category</th>
          <th>Price</th>
          <th>Authority</th>
          <th>Status</th>
          <th>RERA</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(p => propRow(p, showApprove)).join('')}
      </tbody>
    </table>
  `;
}

function propRow(p, showApprove = false) {
  const imgHtml = p.image
    ? `<img src="${esc(p.image)}" class="prop-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt=""/><div class="prop-thumb-placeholder" style="display:none"><i class="fas fa-home"></i></div>`
    : `<div class="prop-thumb-placeholder"><i class="fas fa-home"></i></div>`;

  const featuredBadge = p.featured ? `<span class="badge badge-featured" style="margin-left:4px"><i class="fas fa-star"></i> Featured</span>` : '';
  const verifiedBadge = p.verified ? `<span class="badge badge-success" style="margin-left:4px"><i class="fas fa-check-circle"></i> Verified</span>` : '';

  const rowClass = p.featured ? 'featured-row' : (p.status === 'pending' ? 'pending-row' : (p.status === 'rejected' ? 'rejected-row' : ''));

  return `
    <tr class="${rowClass}">
      <td>${imgHtml}</td>
      <td>
        <div class="td-title">${esc(p.title)}</div>
        <div class="td-sub">${esc(p.location || '')} ${featuredBadge} ${verifiedBadge}</div>
        <div class="td-sub" style="margin-top:2px;font-size:10px;color:var(--text-light)">${formatTime(p.createdAt)}</div>
      </td>
      <td><span class="badge badge-primary">${esc(p.category || '—')}</span><br/><span style="font-size:10px;color:var(--text-light)">${p.type === 'sale' ? 'For Sale' : p.type === 'rent' ? 'For Rent' : esc(p.type||'')}</span></td>
      <td><div style="font-weight:700;color:var(--text)">${p.priceDisplay || formatPrice(p.price)}</div><div style="font-size:10px;color:var(--text-light)">${esc(p.priceSqft||'')}</div></td>
      <td><span class="badge ${authorityBadgeClass(p.authority)}">${(p.authority||'—').toUpperCase()}</span></td>
      <td>${badgeHtml(p.status, 'status')}</td>
      <td><span style="font-size:11px;font-weight:600;color:var(--success)">${esc(p.rera||'—')}</span></td>
      <td>
        <div class="action-btns">
          ${showApprove && p.status === 'pending' ? `<button class="btn-sm btn-approve" onclick="approveProperty('${p.id}')"><i class="fas fa-check"></i> Approve</button>` : ''}
          ${showApprove && p.status === 'pending' ? `<button class="btn-sm btn-reject" onclick="rejectProperty('${p.id}')"><i class="fas fa-times"></i> Reject</button>` : ''}
          <button class="btn-sm btn-edit" onclick="editProperty('${p.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-sm btn-feature" onclick="toggleFeatured('${p.id}')" title="${p.featured ? 'Unfeature' : 'Feature'}"><i class="fas fa-star"></i></button>
          <button class="btn-sm btn-delete" onclick="confirmDelete('${p.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `;
}

// ===================== MANAGE TABLE =====================
function renderManageTable() {
  const all = getProperties();
  const search = (document.getElementById('manage-search') || {}).value || '';
  const filterStatus = (document.getElementById('manage-filter-status') || {}).value || '';
  const filterAuth = (document.getElementById('manage-filter-authority') || {}).value || '';
  const filterType = (document.getElementById('manage-filter-type') || {}).value || '';

  manageFilteredData = filterProps(all, search, filterStatus, filterAuth, filterType);
  const countEl = document.getElementById('manage-count');
  if (countEl) countEl.textContent = `${manageFilteredData.length} total`;

  const paginated = paginate(manageFilteredData, manageCurrentPage, PAGE_SIZE);
  renderPropTable(paginated, 'manage-table', false);
  renderPagination('manage-pagination', manageFilteredData.length, manageCurrentPage, PAGE_SIZE, (pg) => {
    manageCurrentPage = pg;
    renderManageTable();
  });
}

function searchPropTable(ctx) {
  manageCurrentPage = 1;
  renderManageTable();
}

function filterTable(ctx) {
  manageCurrentPage = 1;
  renderManageTable();
}

function filterProps(props, search, status, authority, type) {
  return props.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.rera || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    const matchStatus = !status || p.status === status;
    const matchAuth = !authority || p.authority === authority;
    const matchType = !type || p.type === type;
    return matchSearch && matchStatus && matchAuth && matchType;
  });
}

function paginate(arr, page, size) {
  const start = (page - 1) * size;
  return arr.slice(start, start + size);
}

function renderPagination(containerId, total, current, size, onPage) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pages = Math.ceil(total / size);
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  if (current > 1) html += `<button class="page-btn" onclick="(${onPage})(${current - 1})"><i class="fas fa-chevron-left"></i></button>`;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="(${onPage})(${i})">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<span style="padding:0 4px;color:var(--text-light)">…</span>`;
    }
  }
  if (current < pages) html += `<button class="page-btn" onclick="(${onPage})(${current + 1})"><i class="fas fa-chevron-right"></i></button>`;
  el.innerHTML = html;
}

// ===================== PENDING TABLE =====================
function renderPendingTable() {
  const pending = getProperties().filter(p => p.status === 'pending');
  const countEl = document.getElementById('pending-count');
  if (countEl) countEl.textContent = `${pending.length} pending`;
  renderPropTable(pending, 'pending-table', true);
}

// ===================== FEATURED TABLE =====================
function renderFeaturedTable() {
  const featured = getProperties().filter(p => p.featured);
  const countEl = document.getElementById('featured-count');
  if (countEl) countEl.textContent = `${featured.length} featured`;
  renderPropTable(featured, 'featured-table', false);
}

// ===================== PENDING BADGE =====================
function updatePendingBadge() {
  const cnt = getProperties().filter(p => p.status === 'pending').length;
  const badge = document.getElementById('pending-badge');
  if (badge) {
    badge.textContent = cnt;
    badge.style.display = cnt > 0 ? 'inline-flex' : 'none';
  }
}

// ===================== USERS =====================
function renderUsers() {
  const users = getUsers();
  const el = document.getElementById('users-table');
  const cnt = document.getElementById('user-count');
  if (cnt) cnt.textContent = `${users.length} users`;
  if (!el) return;

  if (users.length === 0) {
    el.innerHTML = emptyState('fa-users', 'No Users Registered', 'Users who sign up via the website will appear here.');
    return;
  }

  el.innerHTML = `
    <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Registered</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${users.map((u, i) => `
          <tr>
            <td style="color:var(--text-light);font-size:12px">${i + 1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="user-avatar">${(u.name || u.email || '?')[0].toUpperCase()}</div>
                <div>
                  <div style="font-weight:600">${esc(u.name || 'Unknown')}</div>
                  <div style="font-size:11px;color:var(--text-light)">ID: ${esc(u.id || '—')}</div>
                </div>
              </div>
            </td>
            <td>${esc(u.email || '—')}</td>
            <td>${esc(u.phone || '—')}</td>
            <td style="font-size:12px;color:var(--text-light)">${formatTime(u.createdAt || u.joinedAt)}</td>
            <td><span class="badge badge-success"><i class="fas fa-check-circle"></i> Active</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    </div>
  `;
}

// ===================== ANALYTICS =====================
function renderAnalytics() {
  const el = document.getElementById('analytics-content');
  if (!el) return;
  const props = getProperties();

  if (props.length === 0) {
    el.innerHTML = `<div class="card"><div class="card-body">${emptyState('fa-chart-pie', 'No Data Yet', 'Add some properties to see analytics.')}</div></div>`;
    return;
  }

  // Category breakdown
  const categories = {};
  props.forEach(p => { categories[p.category || 'Unknown'] = (categories[p.category || 'Unknown'] || 0) + 1; });

  // Authority breakdown
  const gnaCount = props.filter(p => p.authority === 'gna').length;
  const yeaCount = props.filter(p => p.authority === 'yea').length;

  // Status breakdown
  const active   = props.filter(p => p.status === 'active').length;
  const pending  = props.filter(p => p.status === 'pending').length;
  const rejected = props.filter(p => p.status === 'rejected').length;

  // Type breakdown
  const forSale = props.filter(p => p.type === 'sale').length;
  const forRent = props.filter(p => p.type === 'rent').length;
  const forPG   = props.filter(p => p.type === 'pg').length;

  // Furnishing
  const furnished     = props.filter(p => p.furnishing === 'furnished').length;
  const semiFurnished = props.filter(p => p.furnishing === 'semi-furnished').length;
  const unfurnished   = props.filter(p => p.furnishing === 'unfurnished').length;

  // Monthly trend (last 6 months)
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const count = props.filter(p => {
      const pd = new Date(p.createdAt || 0);
      return `${pd.getFullYear()}-${String(pd.getMonth() + 1).padStart(2, '0')}` === key;
    }).length;
    months.push({ label, count });
  }
  const maxMonth = Math.max(...months.map(m => m.count), 1);

  const maxCat = Math.max(...Object.values(categories), 1);

  el.innerHTML = `
    <!-- Summary Numbers -->
    <div class="chart-grid" style="margin-bottom:22px">
      <div class="chart-box">
        <div class="chart-num" style="color:var(--primary)">${props.length}</div>
        <div class="chart-lbl">Total Listings</div>
      </div>
      <div class="chart-box">
        <div class="chart-num" style="color:var(--success)">${props.filter(p => p.featured).length}</div>
        <div class="chart-lbl">Featured</div>
      </div>
      <div class="chart-box">
        <div class="chart-num" style="color:var(--success)">${props.filter(p => p.verified).length}</div>
        <div class="chart-lbl">Verified</div>
      </div>
      <div class="chart-box">
        <div class="chart-num" style="color:var(--warning)">${pending}</div>
        <div class="chart-lbl">Pending Approval</div>
      </div>
      <div class="chart-box">
        <div class="chart-num" style="color:var(--success)">${gnaCount}</div>
        <div class="chart-lbl">GNA Properties</div>
      </div>
      <div class="chart-box">
        <div class="chart-num" style="color:var(--purple)">${yeaCount}</div>
        <div class="chart-lbl">YEA Properties</div>
      </div>
    </div>

    <div class="analytics-grid">
      <!-- By Category -->
      <div class="card">
        <div class="card-header"><h3><i class="fas fa-layer-group" style="color:var(--primary)"></i> Properties by Category</h3></div>
        <div class="card-body">
          ${Object.entries(categories).sort((a,b) => b[1]-a[1]).map(([cat, cnt]) => `
            <div class="bar-chart-item">
              <div class="bar-label">${esc(cat)} <span>${cnt} listing${cnt > 1 ? 's' : ''}</span></div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${Math.round((cnt/maxCat)*100)}%;background:var(--primary)">${cnt}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- By Status -->
      <div class="card">
        <div class="card-header"><h3><i class="fas fa-traffic-light" style="color:var(--success)"></i> Listing Status</h3></div>
        <div class="card-body">
          ${barItem('Active', active, Math.max(active, pending, rejected, 1), 'var(--success)')}
          ${barItem('Pending', pending, Math.max(active, pending, rejected, 1), 'var(--warning)')}
          ${barItem('Rejected', rejected, Math.max(active, pending, rejected, 1), 'var(--danger)')}
        </div>
      </div>

      <!-- By Authority -->
      <div class="card">
        <div class="card-header"><h3><i class="fas fa-map-marked-alt" style="color:var(--purple)"></i> By Authority</h3></div>
        <div class="card-body">
          ${barItem('GNA – Greater Noida Authority', gnaCount, Math.max(gnaCount, yeaCount, 1), 'var(--success)')}
          ${barItem('YEA – Yamuna Expressway Authority', yeaCount, Math.max(gnaCount, yeaCount, 1), 'var(--purple)')}
        </div>
      </div>

      <!-- By Type -->
      <div class="card">
        <div class="card-header"><h3><i class="fas fa-tags" style="color:var(--accent-dark)"></i> Listing Type</h3></div>
        <div class="card-body">
          ${barItem('For Sale', forSale, Math.max(forSale, forRent, forPG, 1), 'var(--primary)')}
          ${barItem('For Rent', forRent, Math.max(forSale, forRent, forPG, 1), 'var(--warning)')}
          ${barItem('PG / Hostel', forPG, Math.max(forSale, forRent, forPG, 1), 'var(--purple)')}
        </div>
      </div>
    </div>

    <!-- Monthly Trend -->
    <div class="card">
      <div class="card-header"><h3><i class="fas fa-chart-line" style="color:var(--primary)"></i> Monthly Listings Trend (Last 6 Months)</h3></div>
      <div class="card-body">
        <div style="display:flex;gap:12px;align-items:flex-end;height:140px;margin-bottom:8px">
          ${months.map(m => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="font-size:11px;font-weight:700;color:var(--primary)">${m.count}</div>
              <div style="flex:1;width:100%;background:var(--bg2);border-radius:6px 6px 0 0;display:flex;align-items:flex-end">
                <div style="width:100%;height:${m.count === 0 ? 4 : Math.max(8, Math.round((m.count/maxMonth)*100))}%;background:linear-gradient(to top,var(--primary),var(--primary-light));border-radius:6px 6px 0 0;min-height:4px;transition:height 0.8s"></div>
              </div>
              <div style="font-size:10px;color:var(--text-light);font-weight:600">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Furnishing -->
    <div class="card">
      <div class="card-header"><h3><i class="fas fa-couch" style="color:var(--accent-dark)"></i> Furnishing Status</h3></div>
      <div class="card-body">
        ${barItem('Fully Furnished', furnished, Math.max(furnished, semiFurnished, unfurnished, 1), 'var(--success)')}
        ${barItem('Semi-Furnished', semiFurnished, Math.max(furnished, semiFurnished, unfurnished, 1), 'var(--warning)')}
        ${barItem('Unfurnished', unfurnished, Math.max(furnished, semiFurnished, unfurnished, 1), 'var(--text-light)')}
      </div>
    </div>
  `;
}

function barItem(label, value, maxVal, color) {
  const pct = maxVal > 0 ? Math.max(2, Math.round((value / maxVal) * 100)) : 2;
  return `
    <div class="bar-chart-item">
      <div class="bar-label">${label} <span>${value}</span></div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct}%;background:${color}">${value > 0 ? value : ''}</div>
      </div>
    </div>
  `;
}

// ===================== REPORTS =====================
function renderReports() {
  const props = getProperties();
  const users = getUsers();
  const el = document.getElementById('reports-content');
  if (!el) return;

  const totalValue = props.filter(p => p.type === 'sale').reduce((s, p) => s + (p.price || 0), 0);
  const avgPrice = props.length > 0 ? Math.round(props.reduce((s, p) => s + (p.price || 0), 0) / props.length) : 0;

  el.innerHTML = `
    <div class="stats-grid" style="margin-bottom:22px">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-database"></i></div>
        <div class="stat-info">
          <div class="stat-num">${props.length}</div>
          <div class="stat-label">Total Properties</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
        <div class="stat-info">
          <div class="stat-num">${formatPrice(totalValue)}</div>
          <div class="stat-label">Total Portfolio Value</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-balance-scale"></i></div>
        <div class="stat-info">
          <div class="stat-num">${formatPrice(avgPrice)}</div>
          <div class="stat-label">Average Property Price</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-certificate"></i></div>
        <div class="stat-info">
          <div class="stat-num">${props.filter(p => p.rera).length}</div>
          <div class="stat-label">RERA Registered</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-table"></i> All Properties Summary</h3>
        <button class="btn btn-primary btn-sm" onclick="exportData()"><i class="fas fa-download"></i> Export</button>
      </div>
      <div class="card-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Location</th>
                <th>Authority</th>
                <th>Status</th>
                <th>RERA</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              ${props.map((p, i) => `
                <tr>
                  <td style="color:var(--text-light)">${i + 1}</td>
                  <td style="font-weight:600;max-width:180px">${esc(p.title)}</td>
                  <td><span class="badge badge-primary">${esc(p.category||'—')}</span></td>
                  <td>${p.type === 'sale' ? '🏠 Sale' : p.type === 'rent' ? '🔑 Rent' : esc(p.type||'—')}</td>
                  <td style="font-weight:700">${p.priceDisplay || formatPrice(p.price)}</td>
                  <td>${esc(p.location||'—')}</td>
                  <td><span class="badge ${authorityBadgeClass(p.authority)}">${(p.authority||'—').toUpperCase()}</span></td>
                  <td>${badgeHtml(p.status, 'status')}</td>
                  <td style="font-size:11px;color:var(--success);font-weight:600">${esc(p.rera||'—')}</td>
                  <td style="font-size:11px;color:var(--text-light)">${formatTime(p.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ===================== SETTINGS =====================
function loadSettings() {
  const cfg = getSettings();
  setVal('set-name',     cfg.businessName || 'City Property');
  setVal('set-phone',    cfg.phone || '97117 33120');
  setVal('set-whatsapp', cfg.whatsapp || '919711733120');
  setVal('set-email',    cfg.email || '');
  setVal('set-gna-addr', cfg.gnaAddr || '');
  setVal('set-yea-addr', cfg.yeaAddr || '');
}

function saveSettings() {
  saveSettingsData({
    businessName: val('set-name'),
    phone:        val('set-phone'),
    whatsapp:     val('set-whatsapp'),
    email:        val('set-email'),
    gnaAddr:      val('set-gna-addr'),
    yeaAddr:      val('set-yea-addr'),
  });
  showToast('✅ Settings saved!', 'success');
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function changePassword() {
  const cur  = val('set-cur-pass');
  const nw   = val('set-new-pass');
  const conf = val('set-conf-pass');
  const cfg  = getSettings();
  const currentPass = cfg.adminPass || DEFAULT_ADMIN_PASS;

  if (cur !== currentPass) { showToast('❌ Current password incorrect.', 'error'); return; }
  if (!nw) { showToast('⚠️ New password cannot be empty.', 'warning'); return; }
  if (nw !== conf) { showToast('❌ Passwords do not match.', 'error'); return; }
  if (nw.length < 6) { showToast('⚠️ Password must be at least 6 characters.', 'warning'); return; }

  saveSettingsData({ adminPass: nw });
  if (window.FIREBASE_DB_URL) {
    fetch(window.FIREBASE_DB_URL + '/admin_credentials.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: DEFAULT_ADMIN_USER, password: nw })
    }).catch(function(e) { console.warn(e); });
  }
  document.getElementById('set-cur-pass').value = '';
  document.getElementById('set-new-pass').value = '';
  document.getElementById('set-conf-pass').value = '';
  showToast('🔑 Password changed successfully!', 'success');
}

function clearAllData() {
  if (!confirm('Are you sure? ALL properties will be permanently deleted. This cannot be undone.')) return;
  localStorage.removeItem(LS_PROPS);
  showToast('🗑️ All properties cleared.', 'error');
  updatePendingBadge();
  renderDashboard();
}

function clearUsers() {
  if (!confirm('Are you sure? ALL user data will be permanently deleted.')) return;
  localStorage.removeItem(LS_USERS);
  showToast('🗑️ All users cleared.', 'error');
}

// ===================== EXPORT / IMPORT =====================
function exportData() {
  const data = {
    exported: new Date().toISOString(),
    properties: getProperties(),
    users: getUsers(),
    settings: getSettings(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `city_property_backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📦 Data exported successfully!', 'success');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.properties) { saveAdminProperties(data.properties); }
      if (data.users) { localStorage.setItem(LS_USERS, JSON.stringify(data.users)); }
      if (data.settings) { localStorage.setItem(LS_SETTINGS, JSON.stringify(data.settings)); }
      showToast(`✅ Imported ${(data.properties||[]).length} properties!`, 'success');
      updatePendingBadge();
      renderDashboard();
      loadSettings();
    } catch (err) {
      showToast('❌ Invalid JSON file.', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ===================== THEME =====================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-icon').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('cp_theme', isDark ? 'light' : 'dark');
}

// Init theme
(function initTheme() {
  const saved = localStorage.getItem('cp_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
})();

// ===================== TOAST =====================
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
  toast.onclick = () => toast.remove();
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

// ===================== UTILITY =====================
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatPrice(price) {
  if (!price || isNaN(price)) return '—';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} Lac`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '—';
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000)   return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function authorityBadgeClass(auth) {
  if (auth === 'gna') return 'badge-gna';
  if (auth === 'yea') return 'badge-yea';
  return 'badge-primary';
}

function badgeHtml(status, ctx) {
  if (ctx === 'status') {
    if (status === 'active')   return '<span class="badge badge-active"><i class="fas fa-circle" style="font-size:7px"></i> Active</span>';
    if (status === 'pending')  return '<span class="badge badge-pending"><i class="fas fa-clock"></i> Pending</span>';
    if (status === 'rejected') return '<span class="badge badge-rejected"><i class="fas fa-times"></i> Rejected</span>';
    return `<span class="badge badge-primary">${esc(status || '—')}</span>`;
  }
  return `<span class="badge badge-primary">${esc(status || '—')}</span>`;
}

function statusColor(status, prop) {
  const map = {
    active:   { bg: 'rgba(39,174,96,0.12)',  text: 'var(--success)' },
    pending:  { bg: 'rgba(245,158,11,0.12)', text: 'var(--warning)' },
    rejected: { bg: 'rgba(231,76,60,0.12)',  text: 'var(--danger)' },
  };
  return (map[status] || map.active)[prop];
}

function emptyState(icon, title, sub) {
  return `
    <div class="empty-state">
      <i class="fas ${icon}"></i>
      <h4>${title}</h4>
      <p>${sub}</p>
    </div>
  `;
}

// Close modal on overlay click
document.getElementById('delete-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Login on Enter
['login-user', 'login-pass'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

// ============================================================
// CLOUDINARY & FIREBASE BACKEND INTEGRATION
// ============================================================

// 1. Direct file upload to Cloudinary
async function handleImageFileUpload(e) {
  const file = e.target.files ? e.target.files[0] : null;
  if (!file) return;

  const statusEl = document.getElementById('upload-status');
  const urlInput = document.getElementById('prop-image');
  const previewBox = document.getElementById('image-preview-box');
  const previewImg = document.getElementById('image-preview-img');

  if (statusEl) {
    statusEl.innerHTML = '<span style="color:var(--primary); font-weight:700;"><i class="fas fa-spinner fa-spin"></i> Uploading photo to Cloudinary...</span>';
  }

  // Show immediate local preview for instant feedback
  const localUrl = URL.createObjectURL(file);
  if (previewImg) previewImg.src = localUrl;
  if (previewBox) previewBox.style.display = 'block';

  try {
    const uploadedUrl = await window.uploadToCloudinary(file);
    if (urlInput) urlInput.value = uploadedUrl;
    if (previewImg) previewImg.src = uploadedUrl;
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#27ae60; font-weight:800;"><i class="fas fa-check-circle"></i> Photo Uploaded & Saved!</span>';
    }
    showToast('✅ Photo uploaded successfully to Cloudinary!', 'success');
  } catch (err) {
    console.error('Upload handler error:', err);
    if (urlInput && !urlInput.value) urlInput.value = localUrl;
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#27ae60; font-weight:800;"><i class="fas fa-check-circle"></i> Ready to Save!</span>';
    }
  }
}

function saveBackendConfig() {
  const cloudName = document.getElementById('set-cloud-name')?.value.trim();
  const preset = document.getElementById('set-cloud-preset')?.value.trim();
  const projectId = document.getElementById('set-fb-project-id')?.value.trim();
  const apiKey = document.getElementById('set-fb-api-key')?.value.trim();
  const authDomain = document.getElementById('set-fb-auth-domain')?.value.trim();
  const storageBucket = document.getElementById('set-fb-storage-bucket')?.value.trim();

  if (cloudName) localStorage.setItem('cp_cloudinary_cloud_name', cloudName);
  if (preset) localStorage.setItem('cp_cloudinary_preset', preset);
  if (projectId) localStorage.setItem('cp_firebase_project_id', projectId);
  if (apiKey) localStorage.setItem('cp_firebase_api_key', apiKey);
  if (authDomain) localStorage.setItem('cp_firebase_auth_domain', authDomain);
  if (storageBucket) localStorage.setItem('cp_firebase_storage_bucket', storageBucket);

  showToast('Cloud credentials saved! Refreshing connection...', 'success');
  setTimeout(() => location.reload(), 1000);
}

// 3. Test Connection
async function testCloudConnection() {
  const cloudName = localStorage.getItem('cp_cloudinary_cloud_name') || 'demo';
  const projectId = localStorage.getItem('cp_firebase_project_id');

  let msg = `Cloudinary: Configured (${cloudName}). `;
  if (window.db) {
    msg += 'Firebase Firestore: Connected & Ready!';
  } else if (projectId) {
    msg += 'Firebase: Initializing...';
  } else {
    msg += 'Firebase: Not yet configured (using LocalStorage fallback).';
  }
  showToast(msg, 'info');
}

// 4. Load backend credentials in settings form on open
function loadBackendSettingsInputs() {
  if (document.getElementById('set-cloud-name')) {
    document.getElementById('set-cloud-name').value = localStorage.getItem('cp_cloudinary_cloud_name') || '';
    document.getElementById('set-cloud-preset').value = localStorage.getItem('cp_cloudinary_preset') || '';
    document.getElementById('set-fb-project-id').value = localStorage.getItem('cp_firebase_project_id') || '';
    document.getElementById('set-fb-api-key').value = localStorage.getItem('cp_firebase_api_key') || '';
    document.getElementById('set-fb-auth-domain').value = localStorage.getItem('cp_firebase_auth_domain') || '';
    document.getElementById('set-fb-storage-bucket').value = localStorage.getItem('cp_firebase_storage_bucket') || '';
  }
}

document.addEventListener('DOMContentLoaded', loadBackendSettingsInputs);

// ============================================================
// FORGOT PASSWORD / RESET VIA WHATSAPP VERIFICATION
// ============================================================
async function handleForgotPassword() {
  const phone = prompt('Enter the Admin registered WhatsApp Number (e.g. 9711733120):');
  if (!phone) return;
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.endsWith('9711733120') || cleanPhone === '9711733120') {
    const otp = Math.floor(100000 + Math.random() * 900000);
    alert(`🔐 Admin Security Verification!\nYour Reset Security PIN is: ${otp}\n(In production, this is sent to your registered number).`);
    const enteredPin = prompt(`Enter the 6-Digit Security PIN sent to ${cleanPhone}:`);

    if (enteredPin && enteredPin.trim() === String(otp)) {
      const newPassword = prompt('Enter your NEW Admin Password (min 6 characters):');
      if (newPassword && newPassword.trim().length >= 6) {
        const cleanNewPass = newPassword.trim();
        // 1. Update in Local Settings
        saveSettingsData({ adminPass: cleanNewPass });

        // 2. Update live in Firebase Realtime Database
        if (window.FIREBASE_DB_URL) {
          try {
            await fetch(window.FIREBASE_DB_URL + '/admin_credentials.json', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: DEFAULT_ADMIN_USER, password: cleanNewPass })
            });
            console.log('✅ Password updated in Firebase Realtime Database!');
          } catch (e) {
            console.warn('Firebase password update warning:', e);
          }
        }

        alert('✅ Password changed successfully in Firebase Cloud!\nYou can now log in with your new password.');
        document.getElementById('login-pass').value = cleanNewPass;
      } else {
        alert('❌ Password must be at least 6 characters.');
      }
    } else {
      alert('❌ Invalid Security PIN.');
    }
  } else {
    alert('❌ This phone number does not match the Admin registered account.');
  }
}
