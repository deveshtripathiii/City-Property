// ============================================================
// CITY PROPERTY — Property Detail Page JavaScript
// ============================================================

const PHONE = '919711733120';

const defaultProperties = [
  {
    id: 'p1', title: '2 BHK Ready to Move Flat', category: 'sale', type: 'flat',
    price: 4500000, priceDisplay: '₹45 Lakh', location: 'Sector Alpha-1, Greater Noida (GNA)',
    size: '950 sqft', bedrooms: 2, bathrooms: 2,
    description: 'Beautiful 2 BHK flat fully furnished with modular kitchen, wardrobes and 24/7 security. Close to metro and school. The flat features marble flooring, branded fittings and excellent ventilation. Society amenities include gym, swimming pool, power backup and covered parking.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'p2', title: 'Spacious Room for Rent', category: 'rent', type: 'room',
    price: 8000, priceDisplay: '₹8,000/mo', location: 'Sector Beta-2, Greater Noida (GNA)',
    size: '200 sqft', bedrooms: 1, bathrooms: 1,
    description: 'Fully furnished single room with attached bathroom, WiFi included. Ideal for working professionals. Features AC, geyser, wardrobe. Very safe locality, near metro station.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'p3', title: 'Commercial Plot for Sale', category: 'land', type: 'plot',
    price: 12000000, priceDisplay: '₹1.2 Cr', location: 'Sector 22D, Yamuna Expressway (YEA)',
    size: '2400 sqft', bedrooms: 0, bathrooms: 0,
    description: 'Prime commercial plot on main road. Ideal for showroom, office building or residential complex. Clear title with all approvals. Freehold property, registry done. All utilities available at site.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'p4', title: '3 BHK Builder Floor', category: 'sale', type: 'flat',
    price: 7800000, priceDisplay: '₹78 Lakh', location: 'Sector Omega-1, Greater Noida (GNA)',
    size: '1450 sqft', bedrooms: 3, bathrooms: 2,
    description: 'Spacious 3 BHK on 2nd floor with terrace access. Vastu compliant, registry done. Near metro station. Features modular kitchen, false ceiling, wooden flooring in bedrooms.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'p5', title: 'Boys Hostel — AC Rooms', category: 'rent', type: 'hostel',
    price: 5500, priceDisplay: '₹5,500/mo', location: 'Knowledge Park-3, Greater Noida (GNA)',
    size: '150 sqft', bedrooms: 1, bathrooms: 0,
    description: 'Well-maintained boys hostel with AC rooms, mess facility, WiFi, 24-hr security. Walking distance from university. Monthly rent includes electricity and water. No brokerage.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'p6', title: '4-Storey Commercial Building', category: 'sale', type: 'building',
    price: 35000000, priceDisplay: '₹3.5 Cr', location: 'Sector MU, Greater Noida (GNA)',
    size: '5000 sqft', bedrooms: 0, bathrooms: 6,
    description: 'Prime commercial building on main road. Ground floor shop + 3 floors offices. Excellent investment opportunity. Lift installed, parking available. Currently 80% rented with good yield.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    featured: true, status: 'active', createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'p7', title: 'Residential Plot — Corner', category: 'land', type: 'plot',
    price: 3200000, priceDisplay: '₹32 Lakh', location: 'Sector 18, Yamuna Expressway (YEA)',
    size: '100 sqgyd', bedrooms: 0, bathrooms: 0,
    description: 'Corner plot in approved colony. Facing east, all utilities available. Perfect for dream home construction. Quiet residential area, near schools and shopping mall.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'p8', title: '1 BHK Flat for Rent', category: 'rent', type: 'flat',
    price: 12000, priceDisplay: '₹12,000/mo', location: 'Sector Gamma-2, Greater Noida (GNA)',
    size: '550 sqft', bedrooms: 1, bathrooms: 1,
    description: 'Semi-furnished 1 BHK with parking. Ground floor, easy access. Near metro station and market. Balcony with garden view. Rent negotiable for long-term tenants.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'p9', title: 'Girls PG / Hostel', category: 'rent', type: 'hostel',
    price: 7000, priceDisplay: '₹7,000/mo', location: 'Knowledge Park-2, Greater Noida (GNA)',
    size: '120 sqft', bedrooms: 1, bathrooms: 0,
    description: 'Safe and secure girls PG with CCTV, tiffin service, WiFi. Ideal for students and working women. 24-hour security guard. Warden on premises.',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    featured: false, status: 'active', createdAt: Date.now() - 86400000 * 9
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const id = localStorage.getItem('cp_view_property');
  if (!id) { window.location.href = 'index.html'; return; }

  let allProps = [...defaultProperties];
  try {
    const stored = JSON.parse(localStorage.getItem('cp_properties') || '[]');
    allProps = [...defaultProperties, ...stored.filter(p => !defaultProperties.find(d => d.id === p.id))];
  } catch {}

  const prop = allProps.find(p => p.id === id);
  if (!prop) { window.location.href = 'index.html'; return; }

  document.title = prop.title + ' — City Property';
  renderPropDetail(prop, allProps);
});

function renderPropDetail(prop, allProps) {
  const catColors = { sale: '#f5a623', rent: '#27ae60', land: '#1a3c6e', construction: '#8b5cf6' };
  const catLabel  = { sale: 'For Sale', rent: 'For Rent', land: 'Land / Plot', construction: 'Construction' };
  const typeIcons = { flat:'🏢', room:'🛏️', hostel:'🏨', building:'🏗️', plot:'🌿', house:'🏠' };

  const imgHtml = prop.image
    ? '<img src="' + prop.image + '" alt="' + prop.title + '" style="width:100%;height:100%;object-fit:cover;" />'
    : '<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--primary),var(--primary-light));display:flex;align-items:center;justify-content:center;font-size:5rem;">' + (typeIcons[prop.type]||'🏠') + '</div>';

  const related = allProps.filter(p => p.id !== prop.id && (p.type === prop.type || p.category === prop.category)).slice(0, 3);

  const amenities = [
    { icon:'fa-car', label:'Parking' }, { icon:'fa-wifi', label:'WiFi Ready' },
    { icon:'fa-bolt', label:'Power Backup' }, { icon:'fa-water', label:'Water Supply' },
    { icon:'fa-shield-alt', label:'Security' }, { icon:'fa-dumbbell', label:'Gym' }
  ];

  const relatedHTML = related.length > 0 ? '<div style="margin-top:32px;"><h3 style="font-size:1.1rem;font-weight:700;color:var(--primary);margin-bottom:20px;">Similar Properties</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">' +
    related.map(function(r) {
      return '<div style="background:var(--white);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);cursor:pointer;transition:transform 0.2s;" onclick="viewProp(\'' + r.id + '\')" onmouseover="this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.transform=\'\'"><div style="height:140px;overflow:hidden;">' +
        (r.image ? '<img src="' + r.image + '" style="width:100%;height:100%;object-fit:cover;"/>' : '<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--primary),var(--primary-light));display:flex;align-items:center;justify-content:center;font-size:2.5rem;">' + (typeIcons[r.type]||'🏠') + '</div>') +
        '</div><div style="padding:14px;"><div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">' + r.title + '</div><div style="font-size:0.8rem;color:var(--text-light);margin-bottom:6px;"><i class="fas fa-map-marker-alt"></i> ' + r.location + '</div><div style="font-size:1rem;font-weight:800;color:var(--primary);">' + r.priceDisplay + '</div></div></div>';
    }).join('') + '</div></div>' : '';

  const featuresHTML =
    (prop.bedrooms > 0 ? '<div class="prop-feature"><div class="pf-icon"><i class="fas fa-bed"></i></div><div class="pf-val">' + prop.bedrooms + '</div><div class="pf-lbl">Bedrooms</div></div>' : '') +
    (prop.bathrooms > 0 ? '<div class="prop-feature"><div class="pf-icon"><i class="fas fa-bath"></i></div><div class="pf-val">' + prop.bathrooms + '</div><div class="pf-lbl">Bathrooms</div></div>' : '') +
    (prop.size ? '<div class="prop-feature"><div class="pf-icon"><i class="fas fa-ruler-combined"></i></div><div class="pf-val">' + prop.size + '</div><div class="pf-lbl">Area</div></div>' : '') +
    '<div class="prop-feature"><div class="pf-icon"><i class="fas fa-calendar-alt"></i></div><div class="pf-val">2024</div><div class="pf-lbl">Listed</div></div>';

  var safeTitle = prop.title.replace(/'/g, "\\'");

  document.getElementById('propDetailContent').innerHTML =
    '<div class="container" style="padding-top:24px;padding-bottom:60px;">' +
    '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><a href="index.html#properties">Properties</a><span class="sep">›</span><span>' + prop.title + '</span></nav>' +
    '<div class="prop-layout">' +
    '<div>' +
    '<div class="prop-gallery">' + imgHtml + '</div>' +
    '<div style="background:var(--white);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow);margin-bottom:24px;">' +
    '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;">' +
    '<span style="background:' + (catColors[prop.category]||'#999') + '22;color:' + (catColors[prop.category]||'#999') + ';padding:5px 14px;border-radius:50px;font-size:0.8rem;font-weight:700;text-transform:uppercase;">' + (catLabel[prop.category]||prop.category) + '</span>' +
    '<span style="background:var(--bg);color:var(--text-light);padding:5px 14px;border-radius:50px;font-size:0.8rem;font-weight:600;">' + (typeIcons[prop.type]||'') + ' ' + prop.type.charAt(0).toUpperCase() + prop.type.slice(1) + '</span>' +
    '</div>' +
    '<h1 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:var(--text);margin-bottom:8px;">' + prop.title + '</h1>' +
    '<div class="prop-location"><i class="fas fa-map-marker-alt" style="color:#ef4444"></i> ' + prop.location + '</div>' +
    '<div class="prop-price">' + prop.priceDisplay + ' <span style="font-size:0.8rem;font-weight:400;color:var(--text-light);">' + (prop.category==='rent'?'per month':'') + '</span></div>' +
    '<div class="prop-features-grid">' + featuresHTML + '</div>' +
    '</div>' +
    '<div class="prop-desc"><h3><i class="fas fa-info-circle" style="color:var(--accent)"></i> About This Property</h3><p>' + (prop.description||'Contact us for more details.') + '</p></div>' +
    '<div style="background:var(--white);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);margin-bottom:24px;"><h3 style="font-size:1rem;font-weight:700;color:var(--primary);margin-bottom:16px;"><i class="fas fa-star" style="color:var(--accent)"></i> Common Amenities</h3><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
    amenities.map(function(a){ return '<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg);border-radius:8px;font-size:0.85rem;font-weight:500;"><i class="fas ' + a.icon + '" style="color:var(--primary);"></i> ' + a.label + '</div>'; }).join('') +
    '</div></div>' + relatedHTML + '</div>' +
    '<div><div class="prop-contact-card">' +
    '<h3><i class="fas fa-headset" style="color:var(--accent)"></i> Contact Us</h3>' +
    '<div style="text-align:center;margin-bottom:20px;padding:16px;background:var(--bg);border-radius:var(--radius-sm);">' +
    '<div style="width:60px;height:60px;background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:1.5rem;color:#fff;"><i class="fas fa-user-tie"></i></div>' +
    '<div style="font-weight:700;font-size:1rem;">City Property</div>' +
    '<div style="font-size:0.8rem;color:var(--text-light);">Verified</div>' +
    '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:6px;font-size:0.9rem;font-weight:600;color:var(--primary);"><i class="fas fa-phone"></i> 97117 33120</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    '<a href="tel:9711733120" class="btn btn-primary" style="justify-content:center;padding:14px;"><i class="fas fa-phone-alt"></i> Call Now</a>' +
    '<button class="btn btn-whatsapp" style="justify-content:center;padding:14px;" onclick="openWAModal(\'' + safeTitle + '\')"><i class="fab fa-whatsapp"></i> WhatsApp Enquiry</button>' +
    '</div>' +
    '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">' +
    '<div style="font-size:0.8rem;font-weight:600;color:var(--text);margin-bottom:10px;">Quick Enquiry</div>' +
    '<div class="form-group"><input type="text" id="qName" placeholder="Your Name" style="padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);width:100%;font-size:0.85rem;font-family:var(--font);" /></div>' +
    '<div class="form-group" style="margin-top:8px;"><input type="tel" id="qPhone" placeholder="Your Phone" maxlength="10" oninput="updateQCID()" style="padding:10px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);width:100%;font-size:0.85rem;font-family:var(--font);" /></div>' +
    '<div id="qCID" style="display:none;background:var(--bg);padding:8px 12px;border-radius:8px;font-size:0.8rem;color:var(--primary);font-weight:700;margin:8px 0;border:1.5px dashed var(--primary);"><i class="fas fa-id-badge"></i> Customer ID: <span id="qCIDVal"></span></div>' +
    '<button class="btn btn-whatsapp" style="width:100%;justify-content:center;margin-top:8px;" onclick="quickEnquiry(\'' + safeTitle + '\')"><i class="fab fa-whatsapp"></i> Send Enquiry</button>' +
    '</div></div></div></div></div>';
}

function viewProp(id) {
  localStorage.setItem('cp_view_property', id);
  location.reload();
}

function updateQCID() {
  var phone = document.getElementById('qPhone').value;
  var digits = phone.replace(/\D/g,'');
  var cidWrap = document.getElementById('qCID');
  var cidVal  = document.getElementById('qCIDVal');
  if (digits.length >= 5) {
    cidVal.textContent = 'CID-' + digits.substring(0,5);
    cidWrap.style.display = 'flex';
  } else {
    cidWrap.style.display = 'none';
  }
}

function quickEnquiry(propTitle) {
  var name  = document.getElementById('qName').value.trim();
  var phone = document.getElementById('qPhone').value.trim();
  if (!phone || phone.replace(/\D/g,'').length < 5) {
    showToast('Please enter your phone number.', 'error'); return;
  }
  var cid = 'CID-' + phone.replace(/\D/g,'').substring(0,5);
  var msg = 'Hi City Property! 👋\n\n*Customer ID:* ' + cid + '\n';
  if (name) msg += '*Name:* ' + name + '\n';
  msg += '*Phone:* ' + phone + '\n*Property:* ' + propTitle + '\n\nPlease provide more details.';
  window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg), '_blank');
}

var waPropertyName = '';
function openWAModal(propertyName) {
  waPropertyName = propertyName || '';
  document.getElementById('waOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(function(){ document.getElementById('waPhone').focus(); }, 300);
}

function closeWAModal(e) {
  if (e && e.target !== document.getElementById('waOverlay')) return;
  document.getElementById('waOverlay').classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('waPhone').value = '';
  document.getElementById('cidResult').classList.add('hidden');
}

function generateCID() {
  var phone  = document.getElementById('waPhone').value;
  var digits = phone.replace(/\D/g,'');
  if (digits.length >= 5) {
    document.getElementById('cidValue').textContent = 'CID-' + digits.substring(0,5);
    document.getElementById('cidResult').classList.remove('hidden');
  } else {
    document.getElementById('cidResult').classList.add('hidden');
  }
}

function sendToWhatsApp() {
  var phone = document.getElementById('waPhone').value.trim();
  if (!phone || phone.replace(/\D/g,'').length < 5) {
    showToast('Please enter at least 5 digits of your phone number.', 'error'); return;
  }
  var cid = 'CID-' + phone.replace(/\D/g,'').substring(0,5);
  var message = 'Hi City Property! 👋\n\nI\'m Customer *' + cid + '*.\n';
  if (waPropertyName) message += 'I\'m interested in: *' + waPropertyName + '*.\n';
  message += '\nPlease contact me. My number: ' + phone;
  window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message), '_blank');
  closeWAModal();
}

function showToast(msg, type) {
  type = type || '';
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<i class="fas fa-info-circle"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(function(){ toast.style.opacity='0'; setTimeout(function(){ toast.remove(); },300); }, 3000);
}

document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeWAModal(); });
