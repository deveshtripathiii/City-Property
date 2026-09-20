// ============================================================
// CITY PROPERTY — Admin Panel JavaScript
// ============================================================

const ADMIN_CREDENTIALS = { user: 'admin', pass: 'cityprop@admin' };
let adminProperties = [];
let tableData = [];
let propToDelete = null;
let currentPage = 1;
const PER_PAGE = 10;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const loggedIn = sessionStorage.getItem('cp_admin_logged');
  if (loggedIn === 'true') showAdmin();
  loadAdminProperties();
});

// ── Login ──
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const settings = getSettings();
  const validPass = settings.pass || ADMIN_CREDENTIALS.pass;
  if (user === ADMIN_CREDENTIALS.user && pass === validPass) {
    sessionStorage.setItem('cp_admin_logged', 'true');
    showAdmin();
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginPass').focus();
  }
}

function showAdmin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadAdminProperties();
  renderDashboard();
}

function doLogout() {
  sessionStorage.removeItem('cp_admin_logged');
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').style.display = 'none';
}

function togglePW() {
  const inp = document.getElementById('loginPass');
  const btn = document.getElementById('togglePWBtn');
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    inp.type = 'password';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

// ── Navigate Pages ──
function showPage(page, el) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (el) el.classList.add('active');
  if (page === 'dashboard') renderDashboard();
  if (page === 'list') { tableData = [...adminProperties]; renderTable(); }
  if (page === 'add') {
    clearForm();
    document.getElementById('formTitle').textContent = 'Add New Property';
  }
  if (page === 'settings') loadSettings();
}

// ── Load Properties ──
function loadAdminProperties() {
  try {
    const stored = localStorage.getItem('cp_properties');
    adminProperties = stored ? JSON.parse(stored) : [];
  } catch { adminProperties = []; }
  tableData = [...adminProperties];
}

function saveAdminProperties() {
  localStorage.setItem('cp_properties', JSON.stringify(adminProperties));
}

// ── Dashboard ──
function renderDashboard() {
  loadAdminProperties();
  const all = adminProperties;
  const sale = all.filter(p => p.category === 'sale').length;
  const rent = all.filter(p => p.category === 'rent').length;
  const land = all.filter(p => p.category === 'land').length;
  const active = all.filter(p => p.status === 'active').length;

  document.getElementById('dashStats').innerHTML = `
    <div class="stat-card"><div class="sc-icon sc-icon-1"><i class="fas fa-home"></i></div><div class="sc-info"><div class="num">${all.length}</div><div class="lbl">Total Properties</div></div></div>
    <div class="stat-card"><div class="sc-icon sc-icon-2"><i class="fas fa-tag"></i></div><div class="sc-info"><div class="num">${sale}</div><div class="lbl">For Sale</div></div></div>
    <div class="stat-card"><div class="sc-icon sc-icon-3"><i class="fas fa-key"></i></div><div class="sc-info"><div class="num">${rent}</div><div class="lbl">For Rent</div></div></div>
    <div class="stat-card"><div class="sc-icon sc-icon-4"><i class="fas fa-check-circle"></i></div><div class="sc-info"><div class="num">${active}</div><div class="lbl">Active Listings</div></div></div>
  `;

  const recent = [...all].sort((a,b) => b.createdAt - a.createdAt).slice(0, 5);
  const tbody = document.getElementById('recentTbody');
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-light);">No properties added yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(p => propRow(p)).join('');
}

// ── Table Row ──
function propRow(p) {
  const catColors = { sale:'#f5a623', rent:'#27ae60', land:'#1a3c6e', construction:'#8b5cf6' };
  const catColor = catColors[p.category] || '#999';
  const thumb = p.image
    ? `<img src="${p.image}" class="prop-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="prop-thumb-placeholder" style="display:none"><i class="fas fa-home"></i></div>`
    : `<div class="prop-thumb-placeholder"><i class="fas fa-home"></i></div>`;
  return `
  <tr>
    <td><div style="display:flex;">${thumb}</div></td>
    <td><div style="font-weight:600; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.title}</div><div style="font-size:0.75rem;color:var(--text-light);">${p.type}</div></td>
    <td><span style="padding:3px 10px; border-radius:50px; background:${catColor}22; color:${catColor}; font-size:0.75rem; font-weight:700; text-transform:uppercase;">${p.category}</span></td>
    <td><strong>${p.priceDisplay}</strong></td>
    <td style="font-size:0.85rem; color:var(--text-light);">${p.location}</td>
    <td><span class="status-badge ${p.status === 'active' ? 'status-active' : 'status-pending'}">${p.status}</span></td>
    <td>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-sm btn-outline" title="Edit" onclick="editProperty('${p.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" title="Delete" onclick="confirmDelete('${p.id}')"><i class="fas fa-trash"></i></button>
        <button class="btn btn-sm btn-whatsapp" title="Share on WhatsApp" onclick="shareWA('${p.id}')"><i class="fab fa-whatsapp"></i></button>
      </div>
    </td>
  </tr>`;
}

// ── Render Table ──
function renderTable(data) {
  const rows = data || tableData;
  document.getElementById('listCount').textContent = `All Properties (${rows.length})`;
  const start = (currentPage - 1) * PER_PAGE;
  const pageRows = rows.slice(start, start + PER_PAGE);
  const tbody = document.getElementById('propTableBody');
  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-light);">No properties found.</td></tr>`;
  } else {
    tbody.innerHTML = pageRows.map(p => propRow(p)).join('');
  }
  renderPagination(rows.length);
}

function renderPagination(total) {
  const totalPages = Math.ceil(total / PER_PAGE);
  const cont = document.getElementById('tablePagination');
  if (totalPages <= 1) { cont.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline'}" onclick="goPage(${i})">${i}</button>`;
  }
  cont.innerHTML = html;
}

function goPage(p) { currentPage = p; renderTable(); }

function searchPropTable() {
  const q = document.getElementById('propSearch').value.toLowerCase();
  const cat = document.getElementById('catFilter').value;
  let data = adminProperties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchCat = cat ? p.category === cat : true;
    return matchSearch && matchCat;
  });
  currentPage = 1;
  renderTable(data);
}

function filterTable() { searchPropTable(); }

// ── Save Property ──
function saveProperty() {
  const title = document.getElementById('fTitle').value.trim();
  const category = document.getElementById('fCategory').value;
  const type = document.getElementById('fType').value;
  const price = parseFloat(document.getElementById('fPrice').value) || 0;
  const priceDisplay = document.getElementById('fPriceDisplay').value.trim();
  const location = document.getElementById('fLocation').value.trim();
  const size = document.getElementById('fSize').value.trim();
  const bedrooms = parseInt(document.getElementById('fBedrooms').value) || 0;
  const bathrooms = parseInt(document.getElementById('fBathrooms').value) || 0;
  const image = document.getElementById('fImage').value.trim();
  const description = document.getElementById('fDescription').value.trim();
  const status = document.getElementById('fStatus').value;
  const editId = document.getElementById('editId').value;

  if (!title || !location || !priceDisplay) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const prop = {
    id: editId || 'p' + Date.now(),
    title, category, type, price, priceDisplay, location,
    size, bedrooms, bathrooms, image, description, status,
    featured: false,
    createdAt: editId ? (adminProperties.find(p=>p.id===editId)?.createdAt || Date.now()) : Date.now()
  };

  if (editId) {
    const idx = adminProperties.findIndex(p => p.id === editId);
    if (idx > -1) adminProperties[idx] = prop;
    showToast('Property updated successfully!', 'success');
  } else {
    adminProperties.unshift(prop);
    showToast('Property added successfully!', 'success');
  }

  saveAdminProperties();
  clearForm();
  renderDashboard();
}

// ── Edit Property ──
function editProperty(id) {
  const p = adminProperties.find(pr => pr.id === id);
  if (!p) return;
  document.getElementById('editId').value = p.id;
  document.getElementById('fTitle').value = p.title;
  document.getElementById('fCategory').value = p.category;
  document.getElementById('fType').value = p.type;
  document.getElementById('fPrice').value = p.price;
  document.getElementById('fPriceDisplay').value = p.priceDisplay;
  document.getElementById('fLocation').value = p.location;
  document.getElementById('fSize').value = p.size || '';
  document.getElementById('fBedrooms').value = p.bedrooms || 0;
  document.getElementById('fBathrooms').value = p.bathrooms || 0;
  document.getElementById('fImage').value = p.image || '';
  document.getElementById('fDescription').value = p.description || '';
  document.getElementById('fStatus').value = p.status || 'active';
  document.getElementById('formTitle').textContent = 'Edit Property';
  previewImage();
  showPage('add', document.querySelector('.sidebar-nav a:nth-child(2)'));
  window.scrollTo(0, 0);
}

// ── Delete Property ──
function confirmDelete(id) {
  propToDelete = id;
  document.getElementById('deleteOverlay').classList.add('show');
  document.getElementById('confirmDeleteBtn').onclick = () => {
    adminProperties = adminProperties.filter(p => p.id !== id);
    saveAdminProperties();
    closeDeleteModal();
    loadAdminProperties();
    tableData = [...adminProperties];
    renderTable();
    renderDashboard();
    showToast('Property deleted.', 'success');
  };
}

function closeDeleteModal(e) {
  if (e && e.target !== document.getElementById('deleteOverlay')) return;
  document.getElementById('deleteOverlay').classList.remove('show');
  propToDelete = null;
}

// ── Share on WhatsApp ──
function shareWA(id) {
  const p = adminProperties.find(pr => pr.id === id);
  if (!p) return;
  const msg = `🏠 *${p.title}*\n📍 ${p.location}\n💰 ${p.priceDisplay}\n📐 ${p.size || 'N/A'}\n\n${p.description || ''}\n\n📞 Call/WhatsApp: 97117 33120\n🌐 City Property`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── Clear Form ──
function clearForm() {
  document.getElementById('editId').value = '';
  ['fTitle','fPriceDisplay','fLocation','fSize','fImage','fDescription'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fPrice').value = '';
  document.getElementById('fBedrooms').value = '0';
  document.getElementById('fBathrooms').value = '0';
  document.getElementById('fCategory').value = 'sale';
  document.getElementById('fType').value = 'flat';
  document.getElementById('fStatus').value = 'active';
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('formTitle').textContent = 'Add New Property';
}

// ── Image Preview ──
function previewImage() {
  const url = document.getElementById('fImage').value.trim();
  const preview = document.getElementById('imgPreview');
  const img = document.getElementById('previewImg');
  if (url) {
    img.src = url;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

// ── Settings ──
function getSettings() {
  try { return JSON.parse(localStorage.getItem('cp_settings') || '{}'); } catch { return {}; }
}

function loadSettings() {
  const s = getSettings();
  if (s.name) document.getElementById('settingName').value = s.name;
  if (s.phone) document.getElementById('settingPhone').value = s.phone;
  if (s.tagline) document.getElementById('settingTagline').value = s.tagline;
}

function saveSettings() {
  const name = document.getElementById('settingName').value.trim();
  const phone = document.getElementById('settingPhone').value.trim();
  const pass = document.getElementById('settingPass').value;
  const tagline = document.getElementById('settingTagline').value.trim();
  const current = getSettings();
  const settings = { ...current, name, phone, tagline };
  if (pass) settings.pass = pass;
  localStorage.setItem('cp_settings', JSON.stringify(settings));
  showToast('Settings saved!', 'success');
}

// ── Clear All Data ──
function clearAllData() {
  if (confirm('This will delete ALL custom properties. Default sample properties will remain. Are you sure?')) {
    localStorage.removeItem('cp_properties');
    adminProperties = [];
    tableData = [];
    renderDashboard();
    renderTable();
    showToast('All properties cleared.', 'success');
  }
}

// ── Export / Import ──
function exportData() {
  const data = JSON.stringify(adminProperties, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'city-property-data.json';
  a.click();
  showToast('Properties exported!', 'success');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        adminProperties = [...adminProperties, ...data];
        saveAdminProperties();
        showToast(`Imported ${data.length} properties!`, 'success');
        renderDashboard();
      } else {
        showToast('Invalid JSON format.', 'error');
      }
    } catch {
      showToast('Failed to read file.', 'error');
    }
  };
  reader.readAsText(file);
}

// ── Toast ──
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', '': 'fa-info-circle' };
  const colors = { success: '#27ae60', error: '#e74c3c', '': '#1a3c6e' };
  toast.innerHTML = `<i class="fas ${icons[type]||icons['']}" style="color:${colors[type]||colors['']}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(20px)'; setTimeout(()=>toast.remove(),300); }, 3000);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDeleteModal(); });
