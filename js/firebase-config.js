// ============================================================
// CITY PROPERTY — FIREBASE & CLOUDINARY CONFIGURATION
// Configured for Realtime Database + Cloudinary Image Storage
// ============================================================

// 1. YOUR FIREBASE REALTIME DATABASE URL (From your screenshot)
window.FIREBASE_DB_URL = "https://city-property-5f7c2-default-rtdb.firebaseio.com";

// 2. FIREBASE APP CONFIG
window.FIREBASE_CONFIG = {
  apiKey: localStorage.getItem('cp_firebase_api_key') || '',
  authDomain: "city-property-5f7c2.firebaseapp.com",
  databaseURL: "https://city-property-5f7c2-default-rtdb.firebaseio.com",
  projectId: "city-property-5f7c2",
  storageBucket: "city-property-5f7c2.appspot.com",
  messagingSenderId: localStorage.getItem('cp_firebase_sender_id') || '',
  appId: localStorage.getItem('cp_firebase_app_id') || ''
};

// 3. CLOUDINARY CONFIG (FREE IMAGE STORAGE)
window.CLOUDINARY_CONFIG = {
  cloudName: localStorage.getItem('cp_cloudinary_cloud_name') || 'demo',
  uploadPreset: localStorage.getItem('cp_cloudinary_preset') || 'city_property_unsigned'
};

// Helper: Realtime Database REST API functions (Works directly with zero SDK setup needed!)
window.savePropertyToFirebase = async function(property) {
  try {
    const url = `${window.FIREBASE_DB_URL}/properties/${property.id}.json`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property)
    });
    return await res.json();
  } catch (err) {
    console.warn('Firebase RTDB save error:', err);
  }
};

window.fetchPropertiesFromFirebase = async function() {
  try {
    const url = `${window.FIREBASE_DB_URL}/properties.json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return [];
    return Object.values(data);
  } catch (err) {
    console.warn('Firebase RTDB fetch error:', err);
    return [];
  }
};

window.deletePropertyFromFirebase = async function(propId) {
  try {
    const url = `${window.FIREBASE_DB_URL}/properties/${propId}.json`;
    await fetch(url, { method: 'DELETE' });
  } catch (err) {
    console.warn('Firebase RTDB delete error:', err);
  }
};

// ============================================================
// HELPER: Upload image to Cloudinary (Free 25GB Storage & CDN)
// ============================================================
window.uploadToCloudinary = async function(file, onProgress) {
  const cloudName = window.CLOUDINARY_CONFIG.cloudName;
  const uploadPreset = window.CLOUDINARY_CONFIG.uploadPreset;

  if (!cloudName || cloudName === 'demo') {
    // If custom cloud name not set yet, convert to Base64 for instant working preview!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};
