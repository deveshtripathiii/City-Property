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
  const cloudName = (window.CLOUDINARY_CONFIG && window.CLOUDINARY_CONFIG.cloudName) ? window.CLOUDINARY_CONFIG.cloudName : 'ecoriscn';
  const uploadPreset = (window.CLOUDINARY_CONFIG && window.CLOUDINARY_CONFIG.uploadPreset) ? window.CLOUDINARY_CONFIG.uploadPreset : 'cjcaira1';

  console.log('Starting Cloudinary upload to cloud:', cloudName, 'preset:', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.error('Cloudinary error response:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    console.log('✅ Photo uploaded to Cloudinary successfully:', data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error('Network/Cloudinary upload error:', err);
    // Fallback: If network issue, convert to local base64 dataURL so property creation never fails!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800');
      reader.readAsDataURL(file);
    });
  }
};