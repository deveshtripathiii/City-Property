// ============================================================
// CITY PROPERTY — Main JavaScript
// ============================================================

const PHONE = '919711733120';
let allProperties = [];
let filteredProperties = [];
let displayedCount = 6;
let activeCategory = 'all';
let activeType = 'all';
let activeSortTab = 'buy';

// ── Default Sample Properties — Greater Noida ──
const defaultProperties = [
  {
    id: 'p1', title: '2 BHK Ready to Move Flat', category: 'sale', type: 'flat',
    price: 4500000, priceDisplay: '₹45 Lakh', location: 'Sector Alpha-1, Greater Noida (GNA)',
    size: '950 sqft', bedrooms: 2, bathrooms: 2,
    description: 'Beautiful 2 BHK flat fully furnished with modular kitchen, wardrobes and 24/7 security. Allotted under Greater Noida Authority (GNA). Registry done.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'p2', title: 'Spacious Room for Rent', category: 'rent', type: 'room',
    price: 8000, priceDisplay: '₹8,000/mo', location: 'Sector Beta-2, Greater Noida (GNA)',
    size: '200 sqft', bedrooms: 1, bathrooms: 1,
    description: 'Fully furnished single room with attached bathroom, WiFi included. Ideal for working professionals near Expo Mart and Knowledge Park.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'p3', title: 'Commercial Plot for Sale', category: 'land', type: 'plot',
    price: 12000000, priceDisplay: '₹1.2 Cr', location: 'Sector 22D, Yamuna Expressway (YEA)',
    size: '2400 sqft', bedrooms: 0, bathrooms: 0,
    description: 'Prime commercial plot in Yamuna Expressway Industrial Development Authority (YEIDA) zone. Ideal for showroom or office. Clear freehold title.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'p4', title: '3 BHK Builder Floor', category: 'sale', type: 'flat',
    price: 7800000, priceDisplay: '₹78 Lakh', location: 'Sector Omega-1, Greater Noida (GNA)',
    size: '1450 sqft', bedrooms: 3, bathrooms: 2,
    description: 'Spacious 3 BHK on 2nd floor with terrace access. Vastu compliant, GNA registry done. Near Pari Chowk metro and shopping mall.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'p5', title: 'Boys Hostel — AC Rooms', category: 'rent', type: 'hostel',
    price: 5500, priceDisplay: '₹5,500/mo', location: 'Knowledge Park-3, Greater Noida (GNA)',
    size: '150 sqft', bedrooms: 1, bathrooms: 0,
    description: 'Boys hostel with AC rooms, mess, WiFi, 24-hr security. Walking distance from Sharda University and GL Bajaj Institute.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'p6', title: '4-Storey Commercial Building', category: 'sale', type: 'building',
    price: 35000000, priceDisplay: '₹3.5 Cr', location: 'Sector MU, Greater Noida (GNA)',
    size: '5000 sqft', bedrooms: 0, bathrooms: 6,
    description: 'Prime commercial building on GNA main road. Ground floor shop + 3 floors offices. Near Surajpur and Expo Mart.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'p7', title: 'Residential Plot — Corner', category: 'land', type: 'plot',
    price: 3200000, priceDisplay: '₹32 Lakh', location: 'Sector 18, Yamuna Expressway (YEA)',
    size: '100 sqgyd', bedrooms: 0, bathrooms: 0,
    description: 'Corner plot in YEIDA approved residential scheme. Near Jewar International Airport — best investment opportunity.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'p8', title: '1 BHK Flat for Rent', category: 'rent', type: 'flat',
    price: 12000, priceDisplay: '₹12,000/mo', location: 'Sector Gamma-2, Greater Noida (GNA)',
    size: '550 sqft', bedrooms: 1, bathrooms: 1,
    description: 'Semi-furnished 1 BHK with parking in GNA society. Near Aqua Line metro station and Hypercity Mall.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'p9', title: 'Girls PG / Hostel', category: 'rent', type: 'hostel',
    price: 7000, priceDisplay: '₹7,000/mo', location: 'Knowledge Park-2, Greater Noida (GNA)',
    size: '120 sqft', bedrooms: 1, bathrooms: 0,
    description: 'Safe and secure girls PG with CCTV, tiffin, WiFi. Ideal for students of Galgotias, Bennett and other Knowledge Park universities.',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 9
  },
];


// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  loadProperties();
  renderProperties();
  updateTypeCounts();
  updateHeroCounts();
  animateStats();
  setupScrollEvents();
});

// ── Load Properties from localStorage or defaults ──
function loadProperties() {
  try {
    const stored = localStorage.getItem('cp_properties');
    if (stored) {
      const parsed = JSON.parse(stored);
      allProperties = [...defaultProperties, ...parsed.filter(p => !defaultProperties.find(d => d.id === p.id))];
    } else {
      allProperties = [...defaultProperties];
    }
  } catch (e) {
    allProperties = [...defaultProperties];
  }
  filteredProperties = [...allProperties];
}

// ── Render Properties ──
function renderProperties() {
  const grid = document.getElementById('propertiesGrid');
  const emptyState = document.getElementById('emptyState');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const toShow = filteredProperties.slice(0, displayedCount);

  if (filteredProperties.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    loadMoreWrap.style.display = 'none';
    return;
  }
  emptyState.classList.add('hidden');
  grid.innerHTML = toShow.map(createPropertyCard).join('');
  loadMoreWrap.style.display = filteredProperties.length > displayedCount ? 'block' : 'none';
}

function createPropertyCard(prop) {
  const badgeMap = { sale: 'badge-sale', rent: 'badge-rent', land: 'badge-land', construction: 'badge-land', hostel: 'badge-hostel' };
  const badgeLabelMap = { sale: 'For Sale', rent: 'For Rent', land: 'Land', construction: 'Construction', hostel: 'Hostel' };
  const typeIconMap = { flat:'🏢', room:'🛏️', hostel:'🏨', building:'🏗️', plot:'🌿', house:'🏠' };
  const badgeCls = badgeMap[prop.category] || 'badge-sale';
  const badgeLbl = badgeLabelMap[prop.category] || prop.category;
  const typeIcon = typeIconMap[prop.type] || '🏠';

  const imgHtml = prop.image
    ? `<img src="${prop.image}" alt="${prop.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-img\\'>${typeIcon}</div>'" />`
    : `<div class="placeholder-img">${typeIcon}</div>`;

  const bedsHtml = prop.bedrooms > 0
    ? `<div class="card-feature"><i class="fas fa-bed"></i> ${prop.bedrooms} Bed</div>` : '';
  const bathHtml = prop.bathrooms > 0
    ? `<div class="card-feature"><i class="fas fa-bath"></i> ${prop.bathrooms} Bath</div>` : '';

  return `
  <div class="property-card fade-in" onclick="openProperty('${prop.id}')">
    <div class="card-image">
      ${imgHtml}
      <span class="card-badge ${badgeCls}">${badgeLbl}</span>
      <button class="card-wishlist" onclick="event.stopPropagation(); toggleWishlist(this)" title="Save">
        <i class="far fa-heart"></i>
      </button>
    </div>
    <div class="card-body">
      <div class="card-type">${typeIcon} ${prop.type.charAt(0).toUpperCase() + prop.type.slice(1)}</div>
      <div class="card-title">${prop.title}</div>
      <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</div>
      <div class="card-price">${prop.priceDisplay} <span>${prop.category === 'rent' ? 'per month' : ''}</span></div>
      <div class="card-features">
        ${bedsHtml}${bathHtml}
        ${prop.size ? `<div class="card-feature"><i class="fas fa-ruler-combined"></i> ${prop.size}</div>` : ''}
      </div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="openProperty('${prop.id}')"><i class="fas fa-eye"></i> Details</button>
        <button class="btn btn-whatsapp btn-sm" onclick="openWAModal('${prop.title}')"><i class="fab fa-whatsapp"></i> Enquire</button>
      </div>
    </div>
  </div>`;
}

// ── Open Property Detail ──
function openProperty(id) {
  localStorage.setItem('cp_view_property', id);
  window.location.href = 'property.html';
}

// ── Toggle Wishlist ──
function toggleWishlist(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  icon.className = btn.classList.contains('liked') ? 'fas fa-heart' : 'far fa-heart';
  showToast(btn.classList.contains('liked') ? 'Added to wishlist ❤️' : 'Removed from wishlist', btn.classList.contains('liked') ? 'success' : '');
}

// ── Filter by Category ──
function filterByCategory(cat, el) {
  activeCategory = cat;
  activeType = 'all';
  displayedCount = 6;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  applyFilters();
  document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// ── Filter by Type ──
function filterByType(type, el) {
  activeType = type;
  activeCategory = 'all';
  displayedCount = 6;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    const tc = document.querySelector(`.type-card[data-filter="${type}"]`);
    if (tc) tc.classList.add('active');
  }
  applyFilters();
  document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// ── Apply All Filters ──
function applyFilters() {
  let result = [...allProperties];
  if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
  if (activeType !== 'all') result = result.filter(p => p.type === activeType);
  filteredProperties = result;
  sortProperties(document.getElementById('sortSelect').value, false);
}

// ── Sort Properties ──
function sortProperties(val, doRender = true) {
  const sortFns = {
    'newest': (a,b) => b.createdAt - a.createdAt,
    'price-low': (a,b) => a.price - b.price,
    'price-high': (a,b) => b.price - a.price
  };
  filteredProperties.sort(sortFns[val] || sortFns['newest']);
  if (doRender) renderProperties();
  else renderProperties();
}

// ── Search ──
function doSearch() {
  const loc = document.getElementById('searchLocation').value.toLowerCase();
  const type = document.getElementById('searchType').value;
  const catMap = { buy: 'sale', rent: 'rent', land: 'land' };
  const cat = catMap[activeSortTab] || 'all';

  let result = [...allProperties];
  if (cat !== 'all') result = result.filter(p => p.category === cat);
  if (type) result = result.filter(p => p.type === type);
  if (loc) result = result.filter(p => p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc));

  filteredProperties = result;
  displayedCount = 6;
  renderProperties();
  document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
  if (result.length === 0) showToast('No properties found for your search. Try different filters.', 'error');
  else showToast(`Found ${result.length} propert${result.length === 1 ? 'y' : 'ies'}!`, 'success');
}

// ── Search Tab ──
function setTab(el, tab) {
  activeSortTab = tab;
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ── Load More ──
function loadMore() {
  displayedCount += 6;
  renderProperties();
}

// ── Update Type Counts ──
function updateTypeCounts() {
  const types = ['flat','room','hostel','building','plot','house'];
  const total = allProperties.length;
  document.getElementById('typeCountAll').textContent = `${total} listings`;
  types.forEach(t => {
    const el = document.getElementById(`typeCount${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (el) el.textContent = `${allProperties.filter(p => p.type === t).length} listings`;
  });
}

// ── Update Hero Counts ──
function updateHeroCounts() {
  document.getElementById('heroSaleCount').textContent = allProperties.filter(p => p.category === 'sale').length + '+';
  document.getElementById('heroRentCount').textContent = allProperties.filter(p => p.category === 'rent').length + '+';
  document.getElementById('heroLandCount').textContent = allProperties.filter(p => p.category === 'land').length + '+';
}

// ── Animate Counter Stats ──
function animateStats() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let count = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count.toLocaleString() + '+';
          if (count >= target) clearInterval(interval);
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ── Scroll Events ──
function setupScrollEvents() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── Navbar Toggle ──
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  hamburger.classList.toggle('open');
  menu.classList.toggle('open');
}

// ── Generate Customer ID ──
function generateCIDFromPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 5) return 'CID-' + digits.substring(0, 5);
  return null;
}

// ── WhatsApp Modal ──
let waPropertyName = '';
function openWAModal(propertyName = '') {
  waPropertyName = propertyName;
  document.getElementById('waOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  if (propertyName) {
    document.getElementById('waPropertyInterest').value = propertyName;
  }
  setTimeout(() => document.getElementById('waPhone').focus(), 300);
}

function closeWAModal(e) {
  if (e && e.target !== document.getElementById('waOverlay')) return;
  document.getElementById('waOverlay').classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('waPhone').value = '';
  document.getElementById('cidResult').classList.add('hidden');
  document.getElementById('cidValue').textContent = '—';
  document.getElementById('waPropertyInterest').value = '';
}

function generateCID() {
  const phone = document.getElementById('waPhone').value;
  const cid = generateCIDFromPhone(phone);
  const cidResult = document.getElementById('cidResult');
  const cidValue = document.getElementById('cidValue');
  if (cid) {
    cidValue.textContent = cid;
    cidResult.classList.remove('hidden');
  } else {
    cidResult.classList.add('hidden');
  }
}

function sendToWhatsApp() {
  const phone = document.getElementById('waPhone').value.trim();
  const interest = document.getElementById('waPropertyInterest').value.trim();
  if (!phone || phone.replace(/\D/g,'').length < 5) {
    showToast('Please enter at least 5 digits of your phone number.', 'error');
    return;
  }
  const cid = generateCIDFromPhone(phone);
  let message = `Hi City Property! 👋\n\nI'm Customer *${cid}*.\n`;
  if (interest) message += `I'm interested in: *${interest}*.\n`;
  message += `\nPlease contact me. My number: ${phone}`;
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeWAModal();
  showToast('Opening WhatsApp...', 'success');
}

// ── Inquiry Form WhatsApp ──
function genCIDFromInquiry() {
  const phone = document.getElementById('inqPhone').value;
  const cid = generateCIDFromPhone(phone);
  const display = document.getElementById('inqCIDDisplay');
  const val = document.getElementById('inqCIDVal');
  if (cid) {
    val.textContent = cid;
    display.classList.remove('hidden');
  } else {
    display.classList.add('hidden');
  }
}

function sendInquiryWhatsApp() {
  const name = document.getElementById('inqName').value.trim();
  const phone = document.getElementById('inqPhone').value.trim();
  const interest = document.getElementById('inqInterest').value;
  const message = document.getElementById('inqMessage').value.trim();

  if (!phone || phone.replace(/\D/g,'').length < 5) {
    showToast('Please enter your phone number.', 'error');
    return;
  }
  const cid = generateCIDFromPhone(phone);
  let msg = `Hi City Property! 👋\n\n`;
  msg += `*Customer ID:* ${cid}\n`;
  if (name) msg += `*Name:* ${name}\n`;
  msg += `*Phone:* ${phone}\n`;
  if (interest && interest !== 'Select property type') msg += `*Interested In:* ${interest}\n`;
  if (message) msg += `*Message:* ${message}\n`;
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast('Opening WhatsApp with your inquiry!', 'success');
}

// ── Toast Notification ──
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconMap = { success: 'fa-check-circle', error: 'fa-exclamation-circle', '': 'fa-info-circle' };
  const colorMap = { success: '#27ae60', error: '#e74c3c', '': '#1a3c6e' };
  toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap['']}" style="color:${colorMap[type] || colorMap['']}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// Close modal on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWAModal(); });
