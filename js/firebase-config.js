// ============================================================
// CITY PROPERTY — FIREBASE & CLOUDINARY CONFIGURATION
// Backend: Firebase Firestore (Free Database) + Cloudinary (Free Image Storage)
// ============================================================

// 1. CLOUDINARY CONFIG (FREE IMAGE STORAGE)
// Default unsigned preset config for City Property
window.CLOUDINARY_CONFIG = {
  cloudName: localStorage.getItem('cp_cloudinary_cloud_name') || 'demo',
  uploadPreset: localStorage.getItem('cp_cloudinary_preset') || 'city_property_unsigned'
};

// 2. FIREBASE CONFIG (FREE FIRESTORE DATABASE)
window.FIREBASE_CONFIG = {
  apiKey: localStorage.getItem('cp_firebase_api_key') || '',
  authDomain: localStorage.getItem('cp_firebase_auth_domain') || '',
  projectId: localStorage.getItem('cp_firebase_project_id') || '',
  storageBucket: localStorage.getItem('cp_firebase_storage_bucket') || '',
  messagingSenderId: localStorage.getItem('cp_firebase_sender_id') || '',
  appId: localStorage.getItem('cp_firebase_app_id') || ''
};

// Check if Firebase is configured
window.isFirebaseConfigured = function() {
  return !!(window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.projectId);
};

// Initialize Firebase SDK if configured
window.db = null;
if (window.isFirebaseConfigured() && typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.FIREBASE_CONFIG);
    }
    window.db = firebase.firestore();
    console.log('✅ Firebase Firestore connected successfully!');
  } catch (err) {
    console.warn('Firebase init warning:', err);
  }
}

// ============================================================
// HELPER: Upload image to Cloudinary (Free 25GB Storage & CDN)
// ============================================================
window.uploadToCloudinary = async function(file, onProgress) {
  const cloudName = window.CLOUDINARY_CONFIG.cloudName;
  const uploadPreset = window.CLOUDINARY_CONFIG.uploadPreset;

  if (!cloudName || cloudName === 'demo') {
    // If user hasn't set their custom cloud name yet, read as Base64 for instant working preview!
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
  return data.secure_url; // Return fast, CDN-cached HTTPS image URL!
};
