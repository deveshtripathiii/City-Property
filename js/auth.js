/**
 * CITY PROPERTY — auth.js
 * Greater Noida Real Estate Platform
 * Complete Login / Signup / OTP / Validation System
 * Phone: 9711733120 | WhatsApp: 919711733120
 *
 * Storage keys:
 *   cp_users  — Array of registered users
 *   cp_user   — Currently logged-in user object
 */

'use strict';

/* ============================================================
   CONSTANTS
   ============================================================ */
const STORAGE_USERS   = 'cp_users';
const STORAGE_USER    = 'cp_user';
const OTP_EXPIRY_MS   = 5 * 60 * 1000; // 5 minutes
const MIN_PASSWORD    = 6;
const PHONE_REGEX     = /^[6-9]\d{9}$/;
const EMAIL_REGEX     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ============================================================
   USER ROLES
   ============================================================ */
const ROLES = {
  BUYER:  'buyer',
  OWNER:  'owner',
  RENTER: 'renter',
  ADMIN:  'admin',
};

/* ============================================================
   LOCAL STORAGE HELPERS
   ============================================================ */
function _getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
  } catch {
    return [];
  }
}

function _saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function _getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER)) || null;
  } catch {
    return null;
  }
}

function _saveCurrentUser(user) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

/* ============================================================
   OTP SYSTEM
   ============================================================ */

/** Generate a random 6-digit OTP */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// In-memory OTP store: { phone → { otp, expiresAt } }
const _otpStore = {};

/**
 * Simulate sending OTP to phone.
 * In production, call an SMS API here.
 */
function sendOTP(phone) {
  const otp = generateOTP();
  _otpStore[phone] = {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  };

  // Dev only: log OTP (remove in production)
  console.info(`[DEV] OTP for ${phone}: ${otp}`);

  return otp;
}

/** Verify OTP entered by user */
function verifyOTP(phone, enteredOTP) {
  const record = _otpStore[phone];
  if (!record) return { valid: false, error: 'OTP not found. Please request a new one.' };
  if (Date.now() > record.expiresAt) {
    delete _otpStore[phone];
    return { valid: false, error: 'OTP has expired. Please request a new one.' };
  }
  if (record.otp !== String(enteredOTP).trim()) {
    return { valid: false, error: 'Invalid OTP. Please try again.' };
  }
  delete _otpStore[phone]; // One-time use
  return { valid: true };
}

/* ============================================================
   VALIDATION HELPERS
   ============================================================ */
function validatePhone(phone) {
  if (!phone || phone.trim() === '') return 'Phone number is required.';
  const clean = phone.replace(/\s|-/g, '');
  if (!PHONE_REGEX.test(clean)) return 'Enter a valid 10-digit Indian mobile number.';
  return null;
}

function validateEmail(email) {
  if (!email || email.trim() === '') return null; // Email optional
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address.';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
  return null;
}

function validateName(name) {
  if (!name || name.trim() === '') return 'Full name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

function validateRole(role) {
  if (!Object.values(ROLES).includes(role)) return 'Please select a valid role.';
  return null;
}

/** Show inline error on a form field */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId) ||
                document.querySelector(`[name="${fieldId}"]`);
  if (!field) return;

  field.classList.add('error');

  let errEl = field.parentElement.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error';
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
  errEl.style.display = 'block';
}

/** Clear inline error on a form field */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId) ||
                document.querySelector(`[name="${fieldId}"]`);
  if (!field) return;
  field.classList.remove('error');
  const errEl = field.parentElement?.querySelector('.form-error');
  if (errEl) errEl.style.display = 'none';
}

/** Clear all errors in a form */
function clearAllErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
}

/* ============================================================
   REGISTRATION
   ============================================================ */

/**
 * Register a new user.
 * @param {string} name     - Full name
 * @param {string} phone    - 10-digit mobile
 * @param {string} email    - (optional)
 * @param {string} password - min 6 chars
 * @param {string} role     - 'buyer' | 'owner' | 'renter'
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
function register(name, phone, email, password, role = ROLES.BUYER) {
  // --- Validate ---
  const nameErr     = validateName(name);
  const phoneErr    = validatePhone(phone);
  const emailErr    = validateEmail(email);
  const passwordErr = validatePassword(password);
  const roleErr     = validateRole(role);

  const firstError = nameErr || phoneErr || emailErr || passwordErr || roleErr;
  if (firstError) return { success: false, error: firstError };

  const cleanPhone = phone.replace(/\s|-/g, '');

  // --- Check duplicate ---
  const users = _getUsers();
  const exists = users.find(u => u.phone === cleanPhone);
  if (exists) {
    return { success: false, error: 'An account with this phone number already exists. Please login.' };
  }

  // --- Create user ---
  const user = {
    id:        _generateId(),
    name:      name.trim(),
    phone:     cleanPhone,
    email:     email ? email.trim().toLowerCase() : '',
    password:  _hashPassword(password), // simple hash (not crypto-secure for demo)
    role,
    avatar:    '',
    verified:  false,
    createdAt: new Date().toISOString(),
    properties: [],
    wishlist:   [],
  };

  users.push(user);
  _saveUsers(users);

  // Auto-login after register
  const sessionUser = _sanitizeUser(user);
  _saveCurrentUser(sessionUser);
  if (typeof window.showUserInNav === 'function') window.showUserInNav(sessionUser);

  return { success: true, user: sessionUser };
}

/* ============================================================
   LOGIN
   ============================================================ */

/**
 * Login with phone + password.
 * @param {string} phone
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
function login(phone, password) {
  // --- Validate ---
  const phoneErr    = validatePhone(phone);
  const passwordErr = validatePassword(password);
  if (phoneErr)    return { success: false, error: phoneErr };
  if (passwordErr) return { success: false, error: passwordErr };

  const cleanPhone = phone.replace(/\s|-/g, '');
  const users      = _getUsers();
  const user       = users.find(u => u.phone === cleanPhone);

  if (!user) {
    return { success: false, error: 'No account found with this phone number. Please register.' };
  }

  if (user.password !== _hashPassword(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // Save session
  const sessionUser = _sanitizeUser(user);
  _saveCurrentUser(sessionUser);
  if (typeof window.showUserInNav === 'function') window.showUserInNav(sessionUser);

  return { success: true, user: sessionUser };
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  localStorage.removeItem(STORAGE_USER);
  sessionStorage.clear();

  if (typeof window.showToast === 'function') {
    window.showToast('You have been logged out successfully.', 'info', 'Goodbye!');
  }

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

/* ============================================================
   PASSWORD RESET (Simulation)
   ============================================================ */

/**
 * Reset password using OTP.
 * @param {string} phone
 * @param {string} otp
 * @param {string} newPassword
 */
function resetPassword(phone, otp, newPassword) {
  const otpResult = verifyOTP(phone, otp);
  if (!otpResult.valid) return { success: false, error: otpResult.error };

  const passwordErr = validatePassword(newPassword);
  if (passwordErr) return { success: false, error: passwordErr };

  const cleanPhone = phone.replace(/\s|-/g, '');
  const users = _getUsers();
  const idx = users.findIndex(u => u.phone === cleanPhone);
  if (idx === -1) return { success: false, error: 'User not found.' };

  users[idx].password = _hashPassword(newPassword);
  _saveUsers(users);

  return { success: true };
}

/* ============================================================
   UPDATE USER PROFILE
   ============================================================ */
function updateProfile(updates) {
  const current = _getCurrentUser();
  if (!current) return { success: false, error: 'Not logged in.' };

  const users = _getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return { success: false, error: 'User not found.' };

  // Allowed fields to update
  const allowed = ['name', 'email', 'avatar', 'role'];
  allowed.forEach(key => {
    if (updates[key] !== undefined) users[idx][key] = updates[key];
  });

  users[idx].updatedAt = new Date().toISOString();
  _saveUsers(users);

  const sessionUser = _sanitizeUser(users[idx]);
  _saveCurrentUser(sessionUser);
  if (typeof window.showUserInNav === 'function') window.showUserInNav(sessionUser);

  return { success: true, user: sessionUser };
}

/* ============================================================
   OTP UI — Show/Hide OTP Box
   ============================================================ */

/** Show OTP input section */
function showOTPBox(phone, purpose = 'verify') {
  const otpSection = document.getElementById('otpSection') ||
                     document.querySelector('.otp-section');
  if (!otpSection) return;

  otpSection.classList.remove('hidden');
  otpSection.style.display = 'block';

  // Set timer countdown
  const timerEl = document.getElementById('otpTimer');
  if (timerEl) startOTPTimer(timerEl);

  // Simulate sending
  const otp = sendOTP(phone);

  if (typeof window.showToast === 'function') {
    window.showToast(
      `OTP sent to +91 ${phone.slice(-10)}. [DEV: ${otp}]`,
      'success',
      'OTP Sent'
    );
  }

  // Focus first OTP input
  const firstInput = otpSection.querySelector('.otp-input');
  if (firstInput) setTimeout(() => firstInput.focus(), 100);

  // Return OTP for dev testing
  return otp;
}

function hideOTPBox() {
  const otpSection = document.getElementById('otpSection') ||
                     document.querySelector('.otp-section');
  if (otpSection) {
    otpSection.classList.add('hidden');
    otpSection.style.display = 'none';
  }
}

/** OTP 5-minute countdown timer */
function startOTPTimer(timerEl, seconds = 300) {
  if (timerEl._interval) clearInterval(timerEl._interval);
  let remaining = seconds;

  function update() {
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
    if (remaining <= 0) {
      clearInterval(timerEl._interval);
      timerEl.textContent = 'Expired';
      // Show resend button
      const resendBtn = document.getElementById('resendOtpBtn');
      if (resendBtn) resendBtn.style.display = 'inline-flex';
    }
    remaining--;
  }
  update();
  timerEl._interval = setInterval(update, 1000);
}

/** Collect OTP value from multiple .otp-input boxes */
function collectOTPValue() {
  const inputs = document.querySelectorAll('.otp-input');
  return Array.from(inputs).map(i => i.value.trim()).join('');
}

/* ============================================================
   SOCIAL LOGIN (Stub — shows Coming Soon toast)
   ============================================================ */
function loginWithGoogle() {
  if (typeof window.showToast === 'function') {
    window.showToast(
      'Google login coming soon! Use phone/email login for now.',
      'warning',
      'Coming Soon!'
    );
  }
}

function loginWithFacebook() {
  if (typeof window.showToast === 'function') {
    window.showToast(
      'Facebook login coming soon! Use phone/email login for now.',
      'warning',
      'Coming Soon!'
    );
  }
}

/* ============================================================
   PRIVATE HELPERS
   ============================================================ */

/** Remove sensitive fields before storing in session */
function _sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

/** Simple deterministic hash for demo purposes */
function _hashPassword(password) {
  // NOTE: This is NOT cryptographically secure.
  // Replace with bcrypt / argon2 in a real backend.
  let hash = 0;
  const salt = 'cp_salt_2024';
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function _generateId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ============================================================
   FORM HANDLERS — LOGIN FORM
   ============================================================ */
function handleLoginForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const phone    = form.querySelector('[name="phone"]')?.value?.trim() || '';
    const password = form.querySelector('[name="password"]')?.value || '';

    // Validate
    let hasError = false;
    const phoneErr = validatePhone(phone);
    const passErr  = validatePassword(password);

    if (phoneErr) { showFieldError('loginPhone', phoneErr); hasError = true; }
    if (passErr)  { showFieldError('loginPassword', passErr); hasError = true; }
    if (hasError) return;

    // Show loading
    const submitBtn = form.querySelector('[type="submit"]');
    _setButtonLoading(submitBtn, true, 'Logging in…');

    // Simulate async (network delay feel)
    await _delay(600);

    const result = login(phone, password);

    _setButtonLoading(submitBtn, false, 'Login');

    if (result.success) {
      if (typeof window.showToast === 'function') {
        window.showToast(`Welcome back, ${result.user.name}!`, 'success', 'Login Successful');
      }
      setTimeout(() => _redirectAfterAuth(), 1200);
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast(result.error, 'error', 'Login Failed');
      }
      const passInput = form.querySelector('[name="password"]');
      if (passInput) {
        passInput.classList.add('error');
        showFieldError('loginPassword', result.error);
      }
    }
  });
}

/* ============================================================
   FORM HANDLERS — REGISTER FORM
   ============================================================ */
function handleRegisterForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const name     = form.querySelector('[name="name"]')?.value?.trim() || '';
    const phone    = form.querySelector('[name="phone"]')?.value?.trim() || '';
    const email    = form.querySelector('[name="email"]')?.value?.trim() || '';
    const password = form.querySelector('[name="password"]')?.value || '';
    const role     = form.querySelector('[name="role"]')?.value ||
                     form.querySelector('.role-btn.active')?.getAttribute('data-role') ||
                     ROLES.BUYER;

    // Validate each field
    let hasError = false;
    const checks = [
      { err: validateName(name),     id: 'regName' },
      { err: validatePhone(phone),   id: 'regPhone' },
      { err: validateEmail(email),   id: 'regEmail' },
      { err: validatePassword(password), id: 'regPassword' },
    ];
    checks.forEach(({ err, id }) => {
      if (err) { showFieldError(id, err); hasError = true; }
    });
    if (hasError) return;

    // Confirm password
    const confirmPass = form.querySelector('[name="confirmPassword"]')?.value;
    if (confirmPass !== undefined && confirmPass !== password) {
      showFieldError('regConfirmPassword', 'Passwords do not match.');
      return;
    }

    // Terms checkbox
    const termsCheckbox = form.querySelector('[name="terms"]');
    if (termsCheckbox && !termsCheckbox.checked) {
      if (typeof window.showToast === 'function') {
        window.showToast('Please accept the Terms of Service to continue.', 'warning', 'Terms Required');
      }
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    _setButtonLoading(submitBtn, true, 'Creating Account…');

    await _delay(800);

    const result = register(name, phone, email, password, role);

    _setButtonLoading(submitBtn, false, 'Create Account');

    if (result.success) {
      if (typeof window.showToast === 'function') {
        window.showToast(`Account created! Welcome, ${result.user.name}!`, 'success', 'Registration Successful');
      }
      form.reset();
      setTimeout(() => _redirectAfterAuth(), 1400);
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast(result.error, 'error', 'Registration Failed');
      }
    }
  });
}

/* ============================================================
   FORM HANDLERS — FORGOT PASSWORD FORM
   ============================================================ */
function handleForgotPasswordForm(form) {
  let step = 1; // 1: enter phone, 2: enter OTP+new password

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);
    const submitBtn = form.querySelector('[type="submit"]');

    if (step === 1) {
      const phone = form.querySelector('[name="phone"]')?.value?.trim() || '';
      const phoneErr = validatePhone(phone);
      if (phoneErr) { showFieldError('forgotPhone', phoneErr); return; }

      const users = _getUsers();
      if (!users.find(u => u.phone === phone.replace(/\s|-/g, ''))) {
        showFieldError('forgotPhone', 'No account found with this phone number.');
        return;
      }

      _setButtonLoading(submitBtn, true, 'Sending OTP…');
      await _delay(700);
      showOTPBox(phone, 'reset');
      _setButtonLoading(submitBtn, false, 'Verify OTP');
      step = 2;

    } else if (step === 2) {
      const phone   = form.querySelector('[name="phone"]')?.value?.trim() || '';
      const otp     = collectOTPValue() || form.querySelector('[name="otp"]')?.value?.trim() || '';
      const newPass = form.querySelector('[name="newPassword"]')?.value || '';

      if (otp.length < 6) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter the 6-digit OTP.', 'warning', 'OTP Required');
        }
        return;
      }

      const passErr = validatePassword(newPass);
      if (passErr) { showFieldError('newPassword', passErr); return; }

      _setButtonLoading(submitBtn, true, 'Resetting…');
      await _delay(600);

      const result = resetPassword(phone, otp, newPass);
      _setButtonLoading(submitBtn, false, 'Reset Password');

      if (result.success) {
        if (typeof window.showToast === 'function') {
          window.showToast('Password reset successfully! Please login.', 'success', 'Success');
        }
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
      } else {
        if (typeof window.showToast === 'function') {
          window.showToast(result.error, 'error', 'Error');
        }
      }
    }
  });
}

/* ============================================================
   MODAL AUTH FORMS (login/register inside modal)
   ============================================================ */
function initAuthModal() {
  const modal    = document.getElementById('loginModal');
  const overlay  = document.getElementById('loginModalOverlay') || modal?.closest('.modal-overlay');
  if (!overlay) return;

  const loginForm  = overlay.querySelector('#modalLoginForm');
  const regForm    = overlay.querySelector('#modalRegisterForm');
  const authTabs   = overlay.querySelectorAll('.auth-tab');

  if (loginForm)  handleLoginForm(loginForm);
  if (regForm)    handleRegisterForm(regForm);

  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      overlay.querySelectorAll('.auth-form-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });

  // Open modal button(s)
  document.querySelectorAll('[data-action="openLogin"]').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.classList.add('open');
    });
  });
}

/* ============================================================
   ROLE SELECTOR BUTTONS
   ============================================================ */
function initRoleSelector() {
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.role-selector');
      if (!group) return;
      group.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update hidden input if present
      const hidden = group.parentElement.querySelector('[name="role"]');
      if (hidden) hidden.value = btn.getAttribute('data-role');
    });
  });
}

/* ============================================================
   OTP INPUT — auto advance between boxes
   ============================================================ */
function initOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-input');
  otpInputs.forEach((input, idx) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });

    input.addEventListener('input', () => {
      // Only allow digits
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      otpInputs.forEach((inp, i) => {
        inp.value = pasted[i] || '';
      });
      const lastFilled = Math.min(pasted.length, otpInputs.length) - 1;
      if (otpInputs[lastFilled]) otpInputs[lastFilled].focus();
    });
  });
}

/* ============================================================
   PASSWORD SHOW/HIDE TOGGLE
   ============================================================ */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
      btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
    });
  });
}

/* ============================================================
   PASSWORD STRENGTH METER
   ============================================================ */
function checkPasswordStrength(password) {
  let score = 0;
  const checks = {
    length:    password.length >= 8,
    upper:     /[A-Z]/.test(password),
    lower:     /[a-z]/.test(password),
    number:    /\d/.test(password),
    special:   /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  score = Object.values(checks).filter(Boolean).length;

  const levels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#e74c3c', '#f59e0b', '#f5a623', '#27ae60', '#16a34a'];

  return {
    score,
    label: levels[score] || 'Very Weak',
    color: colors[score] || colors[1],
    checks,
  };
}

function initPasswordStrength() {
  document.querySelectorAll('[data-password-strength]').forEach(input => {
    const meterId = input.getAttribute('data-password-strength');
    const meter   = document.getElementById(meterId);
    if (!meter) return;

    input.addEventListener('input', () => {
      const { score, label, color } = checkPasswordStrength(input.value);
      const fill = meter.querySelector('.strength-fill');
      const lbl  = meter.querySelector('.strength-label');
      if (fill) {
        fill.style.width = `${(score / 5) * 100}%`;
        fill.style.background = color;
      }
      if (lbl) {
        lbl.textContent = label;
        lbl.style.color = color;
      }
    });
  });
}

/* ============================================================
   REAL-TIME FIELD VALIDATION
   ============================================================ */
function initRealtimeValidation() {
  // Phone
  document.querySelectorAll('[data-validate="phone"]').forEach(input => {
    input.addEventListener('blur', () => {
      const err = validatePhone(input.value);
      if (err) showFieldError(input.id || input.name, err);
      else clearFieldError(input.id || input.name);
    });
    input.addEventListener('input', () => clearFieldError(input.id || input.name));
  });

  // Email
  document.querySelectorAll('[data-validate="email"]').forEach(input => {
    input.addEventListener('blur', () => {
      const err = validateEmail(input.value);
      if (err) showFieldError(input.id || input.name, err);
      else clearFieldError(input.id || input.name);
    });
    input.addEventListener('input', () => clearFieldError(input.id || input.name));
  });

  // Password
  document.querySelectorAll('[data-validate="password"]').forEach(input => {
    input.addEventListener('blur', () => {
      const err = validatePassword(input.value);
      if (err) showFieldError(input.id || input.name, err);
      else clearFieldError(input.id || input.name);
    });
  });
}

/* ============================================================
   REDIRECT AFTER AUTH
   ============================================================ */
function _redirectAfterAuth() {
  const params  = new URLSearchParams(window.location.search);
  const returnTo = params.get('return');

  if (returnTo && returnTo.startsWith('/')) {
    window.location.href = returnTo;
  } else {
    window.location.href = 'index.html';
  }
}

/* ============================================================
   SOCIAL LOGIN BUTTON BINDING
   ============================================================ */
function initSocialLoginButtons() {
  document.querySelectorAll('[data-social-login="google"]').forEach(btn => {
    btn.addEventListener('click', loginWithGoogle);
  });
  document.querySelectorAll('[data-social-login="facebook"]').forEach(btn => {
    btn.addEventListener('click', loginWithFacebook);
  });
}

/* ============================================================
   RESEND OTP
   ============================================================ */
function initResendOTP() {
  document.querySelectorAll('#resendOtpBtn, [data-action="resendOTP"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const phoneInput = document.querySelector('[name="phone"]');
      if (!phoneInput) return;
      const phone = phoneInput.value.trim();
      const phoneErr = validatePhone(phone);
      if (phoneErr) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter your phone number first.', 'warning');
        }
        return;
      }

      btn.style.display = 'none';
      const timerEl = document.getElementById('otpTimer');
      const otp = sendOTP(phone);
      if (timerEl) startOTPTimer(timerEl);

      if (typeof window.showToast === 'function') {
        window.showToast(`New OTP sent! [DEV: ${otp}]`, 'success', 'OTP Resent');
      }
    });
  });
}

/* ============================================================
   UTILITY
   ============================================================ */
function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function _setButtonLoading(btn, loading, text) {
  if (!btn) return;
  if (loading) {
    btn._originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="spinner spinner-sm"></span> ${text}`;
    btn.disabled = true;
  } else {
    btn.innerHTML = btn._originalContent || text;
    btn.disabled = false;
  }
}

/* ============================================================
   ADMIN SEED (dev only — creates test accounts)
   ============================================================ */
function _seedTestAccounts() {
  const users = _getUsers();
  if (users.length > 0) return; // Already seeded

  const testAccounts = [
    { name: 'Admin User',   phone: '9000000001', email: 'admin@cityproperty.in',   password: 'Admin@123', role: 'admin' },
    { name: 'Test Buyer',   phone: '9000000002', email: 'buyer@cityproperty.in',   password: 'Test@123',  role: 'buyer' },
    { name: 'Test Owner',   phone: '9000000003', email: 'owner@cityproperty.in',   password: 'Test@123',  role: 'owner' },
    { name: 'Test Renter',  phone: '9000000004', email: 'renter@cityproperty.in',  password: 'Test@123',  role: 'renter' },
  ];

  testAccounts.forEach(acc => {
    register(acc.name, acc.phone, acc.email, acc.password, acc.role);
    // Remove auto-login effect from seeding
    localStorage.removeItem(STORAGE_USER);
  });

  console.info('[DEV] Test accounts seeded. See auth.js _seedTestAccounts() for credentials.');
}

/* ============================================================
   INIT — DOM Ready
   ============================================================ */
function initAuth() {
  // Seed test accounts in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    _seedTestAccounts();
  }

  // Initialize all auth forms on the page
  const loginForm  = document.getElementById('loginForm');
  const regForm    = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotPasswordForm');

  if (loginForm)  handleLoginForm(loginForm);
  if (regForm)    handleRegisterForm(regForm);
  if (forgotForm) handleForgotPasswordForm(forgotForm);

  // Auth modal
  initAuthModal();

  // UI enhancements
  initRoleSelector();
  initOTPInputs();
  initPasswordToggles();
  initPasswordStrength();
  initRealtimeValidation();
  initSocialLoginButtons();
  initResendOTP();

  // Logout buttons
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // "Post Property" buttons — require auth
  document.querySelectorAll('[data-action="postProperty"]').forEach(btn => {
    btn.addEventListener('click', () => requireAuth());
  });
}

// Run when DOM ready (but theme.js also DOMContentLoads — no conflict)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

/* ============================================================
   EXPORT TO WINDOW
   ============================================================ */
Object.assign(window, {
  // Core auth
  register,
  login,
  logout,
  resetPassword,
  updateProfile,

  // OTP
  generateOTP,
  sendOTP,
  verifyOTP,
  showOTPBox,
  hideOTPBox,
  collectOTPValue,
  startOTPTimer,

  // Social
  loginWithGoogle,
  loginWithFacebook,

  // Validation
  validatePhone,
  validateEmail,
  validatePassword,
  validateName,
  showFieldError,
  clearFieldError,
  clearAllErrors,

  // Helpers
  getCurrentUser: _getCurrentUser,
  checkPasswordStrength,

  // Roles
  ROLES,

  // Form handlers (for inline/external use)
  handleLoginForm,
  handleRegisterForm,
  handleForgotPasswordForm,
});
