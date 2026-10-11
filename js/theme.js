// ============================================================
// CITY PROPERTY — Global Theme & Language Synchronizer
// Handles day/night mode and Hindi/English across all pages
// ============================================================

(function() {
  function applyGlobalTheme() {
    const saved = localStorage.getItem('cp_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const icons = document.querySelectorAll('#themeIcon, .theme-icon');
    icons.forEach(icon => {
      icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  }

  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cp_theme', next);
    const icons = document.querySelectorAll('#themeIcon, .theme-icon');
    icons.forEach(icon => {
      icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  };

  window.toggleDarkMode = window.toggleTheme;

  // Apply immediately before DOM fully loads to prevent flash
  applyGlobalTheme();
  document.addEventListener('DOMContentLoaded', applyGlobalTheme);
})();
