// ============================================================
// CITY PROPERTY — FIREBASE & CLOUDINARY CONFIGURATION
// Configured with your exact Cloudinary & Firebase Credentials!
// ============================================================

// 1. YOUR CLOUDINARY CREDENTIALS (FROM YOUR SCREENSHOT)
window.CLOUDINARY_CONFIG = {
  cloudName: 'ecoriscn',
  uploadPreset: 'cjcaira1'
};

// 2. YOUR FIREBASE REALTIME DATABASE CONFIG (FROM YOUR SCREENSHOT)
window.FIREBASE_DB_URL = "https://city-property-5f7c2-default-rtdb.firebaseio.com";

window.FIREBASE_CONFIG = {
  databaseURL: "https://city-property-5f7c2-default-rtdb.firebaseio.com",
  projectId: "city-property-5f7c2"
};

// ============================================================
// REALTIME DATABASE REST API (AUTOMATIC BACKGROUND SYNC)
// ============================================================
window.savePropertyToFirebase = async function(property) {
  try {
    const url = `${window.FIREBASE_DB_URL}/properties/${property.id}.json`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property)
    });
    console.log('✅ Property synced to Firebase Realtime Database!');
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
    console.log('✅ Property deleted from Firebase Realtime Database!');
  } catch (err) {
    console.warn('Firebase RTDB delete error:', err);
  }
};

// ============================================================
// DIRECT CLOUDINARY IMAGE UPLOAD (FREE 25 GB CDN)
// ============================================================
window.uploadToCloudinary = async function(file) {
  const url = `https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', window.CLOUDINARY_CONFIG.uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  console.log('✅ Photo uploaded to Cloudinary CDN:', data.secure_url);
  return data.secure_url;
};
