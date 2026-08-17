/**
 * Hidden_Rack - Main UI Interactive Engine
 * Handles Navbar, Drawer, Quick Search, Toast Notifications, Animations
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initQuickSearch();
  initToastContainer();
  initScrollAnimations();
  updateUserNavIcon();
});

// Toast notification handler
window.showToast = function(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Mobile Menu Drawer
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const closeBtn = document.querySelector(".mobile-menu-close");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const drawer = document.querySelector(".mobile-menu-drawer");

  if (!menuBtn || !drawer) return;

  const toggleMenu = (open) => {
    if (open) {
      drawer.classList.add("active");
      overlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      drawer.classList.remove("active");
      overlay?.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  menuBtn.addEventListener("click", () => toggleMenu(true));
  closeBtn?.addEventListener("click", () => toggleMenu(false));
  overlay?.addEventListener("click", () => toggleMenu(false));
}

// Quick Search Modal Overlay
function initQuickSearch() {
  const searchBtns = document.querySelectorAll(".search-trigger");
  if (searchBtns.length === 0) return;

  // Create search modal HTML if not already in page
  if (!document.getElementById("search-modal")) {
    const modalHTML = `
      <div id="search-modal" class="search-modal-overlay">
        <div class="search-modal-card">
          <div class="search-modal-header">
            <h3>SEARCH HIDDEN_RACK</h3>
            <button class="search-modal-close" aria-label="Close Search">&times;</button>
          </div>
          <div class="search-modal-body">
            <div class="search-input-wrapper">
              <input type="text" id="global-search-input" placeholder="Type sneaker name, brand (e.g. Nike, Adidas)..." autofocus />
              <button id="global-search-btn">SEARCH</button>
            </div>
            <div class="search-quick-tags">
              <span>Popular Searches:</span>
              <a href="shop.html?search=Adidas">Adidas Campus</a>
              <a href="shop.html?search=Dunk">Nike Dunk</a>
              <a href="shop.html?search=Jordan">Air Jordan</a>
              <a href="shop.html?search=New Balance">New Balance 550</a>
            </div>
            <div id="search-results-preview" class="search-results-preview"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const searchModal = document.getElementById("search-modal");
  const searchClose = document.querySelector(".search-modal-close");
  const searchInput = document.getElementById("global-search-input");
  const searchResults = document.getElementById("search-results-preview");

  const openSearch = () => {
    searchModal.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput?.focus(), 100);
  };

  const closeSearch = () => {
    searchModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  searchBtns.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    openSearch();
  }));

  searchClose?.addEventListener("click", closeSearch);
  searchModal?.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearch();
  });

  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    const products = window.ProductStore.getProducts();
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).slice(0, 4);

    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="search-no-results">No thrift pairs found for "${query}"</p>`;
    } else {
      searchResults.innerHTML = matches.map(p => `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <img src="${p.images[0]}" alt="${p.name}" />
          <div class="search-result-info">
            <span class="search-result-brand">${p.brand}</span>
            <span class="search-result-title">${p.name}</span>
            <span class="search-result-price">${window.ProductStore.formatPKR(p.price)}</span>
          </div>
          <span class="condition-badge-sm">${p.condition.split('-')[0]}</span>
        </a>
      `).join("");
    }
  });

  document.getElementById("global-search-btn")?.addEventListener("click", () => {
    const q = searchInput?.value.trim();
    if (q) {
      window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    }
  });
}

function initToastContainer() {
  if (!document.getElementById("toast-container")) {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

// Scroll Reveal observer
function initScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// User Navigation Icon state
function updateUserNavIcon() {
  const currentUser = window.AuthStore?.getCurrentUser();
  const profileLinks = document.querySelectorAll(".user-nav-link");
  
  profileLinks.forEach(link => {
    if (currentUser) {
      link.href = currentUser.role === "admin" ? "admin/dashboard.html" : "account.html";
      link.title = `Logged in as ${currentUser.name}`;
    } else {
      link.href = "login.html";
      link.title = "Customer Login / Account";
    }
  });
}
