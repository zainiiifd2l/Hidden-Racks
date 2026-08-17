/**
 * Hidden_Rack - Admin Panel Interactive Management Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check Admin Guard for admin html pages except admin/login.html
  if (window.location.pathname.includes("/admin/") && !window.location.pathname.includes("login.html")) {
    window.AuthStore.requireAdmin();
    initAdminHeader();
  }
});

function initAdminHeader() {
  const adminUser = window.AuthStore.getCurrentUser();
  const nameEl = document.getElementById("admin-user-name");
  if (nameEl && adminUser) {
    nameEl.textContent = adminUser.name;
  }

  document.getElementById("admin-logout-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.AuthStore.logout();
    window.location.href = "login.html";
  });
}

// Global Admin Action Utilities
window.AdminManager = {
  // Dashboard Overview Loader
  loadDashboardStats() {
    const products = window.ProductStore.getProducts();
    const categories = window.ProductStore.getCategories();
    const orders = window.OrderStore.getOrders();
    const users = window.AuthStore.getUsers();

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

    const elProducts = document.getElementById("stat-total-products");
    const elCategories = document.getElementById("stat-total-categories");
    const elOrders = document.getElementById("stat-total-orders");
    const elCustomers = document.getElementById("stat-total-customers");
    const elSales = document.getElementById("stat-total-sales");

    if (elProducts) elProducts.textContent = products.length;
    if (elCategories) elCategories.textContent = categories.length;
    if (elOrders) elOrders.textContent = orders.length;
    if (elCustomers) elCustomers.textContent = users.length;
    if (elSales) elSales.textContent = window.ProductStore.formatPKR(totalSales);

    // Render dynamic weekly sales chart
    const chartContainer = document.getElementById("dashboard-weekly-chart-container");
    if (chartContainer) {
      const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      const daySales = [8500, 11500, 14500, 6800, 18500, 12800, 9800]; // Base historical sales

      // Add actual order totals from OrderStore
      orders.forEach(o => {
        if (o.orderDate) {
          const d = new Date(o.orderDate);
          const dayIdx = (d.getDay() + 6) % 7; // Mon=0, Sun=6
          daySales[dayIdx] += o.total;
        }
      });

      const maxVal = Math.max(...daySales, 20000);

      chartContainer.innerHTML = days.map((day, idx) => {
        const val = daySales[idx];
        const heightPx = Math.round((val / maxVal) * 140) + 20;
        const color = idx % 2 === 1 ? "var(--accent-tan)" : "var(--text-main)";
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
            <span style="font-size:11px; font-weight:700;">${val.toLocaleString()}</span>
            <div style="width:100%; height:${heightPx}px; background-color:${color}; transition:height 0.3s ease;"></div>
            <span style="font-size:11px; color:var(--text-muted);">${day}</span>
          </div>
        `;
      }).join("");
    }

    // Load recent orders table
    const recentOrdersTable = document.getElementById("dashboard-recent-orders-body");
    if (recentOrdersTable) {
      const recent = orders.slice(0, 5);
      recentOrdersTable.innerHTML = recent.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customerName}</td>
          <td>${o.items.map(i => i.name).join(", ")}</td>
          <td><strong>${window.ProductStore.formatPKR(o.total)}</strong></td>
          <td>${o.orderDate}</td>
          <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
          <td><button onclick="AdminManager.viewOrderDetails('${o.id}')" class="btn-sm-outline">View Details</button></td>
        </tr>
      `).join("");
    }
  },

  adminProductsPage: 1,
  adminOrdersPage: 1,

  // Products Table Loader
  loadProductsTable(page = 1) {
    this.adminProductsPage = page;
    const tableBody = document.getElementById("admin-products-table-body");
    if (!tableBody) return;

    const products = window.ProductStore.getProducts();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    tableBody.innerHTML = paginatedProducts.map(p => `
      <tr>
        <td>
          <img src="${p.images[0]}" alt="${p.name}" class="table-product-thumb" />
        </td>
        <td>
          <strong>${p.name}</strong>
          <br><small class="text-muted">SKU: ${p.sku}</small>
        </td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td><strong>${window.ProductStore.formatPKR(p.price)}</strong></td>
        <td>${p.stockQty > 0 ? `<span class="stock-tag in-stock">${p.stockQty} in stock</span>` : `<span class="stock-tag out-of-stock">Out of stock</span>`}</td>
        <td><span class="condition-badge-sm">${p.condition.split('-')[0]}</span></td>
        <td>
          ${p.featured ? `<span class="badge-tag">Featured</span>` : ''}
          ${p.newArrival ? `<span class="badge-tag">New</span>` : ''}
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button onclick="AdminManager.openEditProductModal('${p.id}')" class="btn-sm-outline" style="padding:4px 8px; font-size:11px;" title="Edit Product">Edit</button>
            <button onclick="AdminManager.deleteProduct('${p.id}')" class="btn-table-danger" style="padding:4px 8px; font-size:11px;" title="Delete Product">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");

    const paginationBox = document.getElementById("admin-products-pagination");
    if (paginationBox && totalPages > 1) {
      paginationBox.innerHTML = `
        <button onclick="AdminManager.loadProductsTable(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="btn-sm-outline">&larr; Prev</button>
        <span style="font-size:12px; font-weight:700;">Page ${currentPage} of ${totalPages}</span>
        <button onclick="AdminManager.loadProductsTable(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="btn-sm-outline">Next &rarr;</button>
      `;
    }
  },

  openEditProductModal(id) {
    const product = window.ProductStore.getProductById(id);
    if (!product) return;

    const modal = document.getElementById("edit-product-modal");
    if (!modal) return;

    document.getElementById("edit-p-id").value = product.id;
    document.getElementById("edit-p-name").value = product.name;
    document.getElementById("edit-p-brand").value = product.brand;
    document.getElementById("edit-p-category").value = product.category;
    document.getElementById("edit-p-price").value = product.price;
    document.getElementById("edit-p-original-price").value = product.originalPrice || "";
    document.getElementById("edit-p-stock").value = product.stockQty;
    document.getElementById("edit-p-condition").value = product.condition;
    document.getElementById("edit-p-rating").value = product.conditionRating || 9.0;
    document.getElementById("edit-p-sizes").value = (product.sizes || []).join(", ");
    document.getElementById("edit-p-description").value = product.description || "";
    document.getElementById("edit-p-image").value = (product.images || [])[0] || "";
    document.getElementById("edit-p-featured").checked = !!product.featured;
    document.getElementById("edit-p-new-arrival").checked = !!product.newArrival;

    modal.classList.add("active");
  },

  handleSaveProductEdit(e) {
    e.preventDefault();
    const id = document.getElementById("edit-p-id").value;
    const sizesArr = document.getElementById("edit-p-sizes").value.split(",").map(s => s.trim()).filter(Boolean);
    const imageVal = document.getElementById("edit-p-image").value.trim();

    const updatedData = {
      name: document.getElementById("edit-p-name").value.trim(),
      brand: document.getElementById("edit-p-brand").value.trim(),
      category: document.getElementById("edit-p-category").value,
      price: parseInt(document.getElementById("edit-p-price").value) || 0,
      originalPrice: parseInt(document.getElementById("edit-p-original-price").value) || null,
      stockQty: parseInt(document.getElementById("edit-p-stock").value) || 0,
      condition: document.getElementById("edit-p-condition").value,
      conditionRating: parseFloat(document.getElementById("edit-p-rating").value) || 9.0,
      sizes: sizesArr.length > 0 ? sizesArr : ["EU 42"],
      description: document.getElementById("edit-p-description").value.trim(),
      images: imageVal ? [imageVal] : ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80"],
      featured: document.getElementById("edit-p-featured").checked,
      newArrival: document.getElementById("edit-p-new-arrival").checked
    };

    window.ProductStore.updateProduct(id, updatedData);
    window.showToast("Product details updated successfully!", "success");
    document.getElementById("edit-product-modal").classList.remove("active");
    this.loadProductsTable();
  },

  deleteProduct(id) {
    if (confirm("Are you sure you want to delete this thrift product listing?")) {
      window.ProductStore.deleteProduct(id);
      window.showToast("Product deleted successfully", "info");
      this.loadProductsTable();
    }
  },

  // Orders Table Loader
  loadOrdersTable(page = 1) {
    this.adminOrdersPage = page;
    const tableBody = document.getElementById("admin-orders-table-body");
    if (!tableBody) return;

    const orders = window.OrderStore.getOrders();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    tableBody.innerHTML = paginatedOrders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <strong>${o.customerName}</strong>
          <br><small>${o.customerPhone}</small>
        </td>
        <td>
          <ul class="order-items-mini-list">
            ${o.items.map(i => `<li>${i.quantity}x ${i.name} (${i.selectedSize})</li>`).join("")}
          </ul>
        </td>
        <td><strong>${window.ProductStore.formatPKR(o.total)}</strong></td>
        <td>${o.paymentMethod}<br><small>(${o.paymentStatus})</small></td>
        <td>
          <select class="admin-order-status-select" onchange="AdminManager.updateOrderStatus('${o.id}', this.value)">
            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${o.orderDate}</td>
        <td>
          <button onclick="AdminManager.viewOrderDetails('${o.id}')" class="btn-sm-outline" style="padding:4px 8px; font-size:11px;">View</button>
        </td>
      </tr>
    `).join("");

    const paginationBox = document.getElementById("admin-orders-pagination");
    if (paginationBox && totalPages > 1) {
      paginationBox.innerHTML = `
        <button onclick="AdminManager.loadOrdersTable(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="btn-sm-outline">&larr; Prev</button>
        <span style="font-size:12px; font-weight:700;">Page ${currentPage} of ${totalPages}</span>
        <button onclick="AdminManager.loadOrdersTable(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="btn-sm-outline">Next &rarr;</button>
      `;
    }
  },

  viewOrderDetails(orderId) {
    const orders = window.OrderStore.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById("order-detail-modal");
    if (!modal) {
      alert(`Order ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.shippingAddress}\nTotal: PKR ${order.total}\nStatus: ${order.status}`);
      return;
    }

    document.getElementById("modal-order-id").textContent = order.id;
    document.getElementById("modal-order-date").textContent = order.orderDate;
    document.getElementById("modal-customer-name").textContent = order.customerName;
    document.getElementById("modal-customer-email").textContent = order.customerEmail || "N/A";
    document.getElementById("modal-customer-phone").textContent = order.customerPhone;
    document.getElementById("modal-shipping-address").textContent = order.shippingAddress;
    document.getElementById("modal-payment-method").textContent = order.paymentMethod;
    document.getElementById("modal-order-status").textContent = order.status;
    document.getElementById("modal-order-total").textContent = window.ProductStore.formatPKR(order.total);

    const itemsContainer = document.getElementById("modal-order-items-list");
    if (itemsContainer) {
      itemsContainer.innerHTML = order.items.map(i => `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px; border-bottom:1px solid var(--border-light); padding-bottom:8px;">
          <img src="${i.image}" alt="${i.name}" style="width:45px; height:45px; object-fit:cover; border:1px solid var(--border-light);" />
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px;">${i.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">Size: ${i.selectedSize} | Qty: ${i.quantity}</div>
          </div>
          <div style="font-weight:700; font-size:13px;">${window.ProductStore.formatPKR(i.price * i.quantity)}</div>
        </div>
      `).join("");
    }

    const timelineContainer = document.getElementById("modal-order-timeline");
    if (timelineContainer && order.timeline) {
      timelineContainer.innerHTML = order.timeline.map(t => `
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
          <span><strong>${t.status}:</strong> ${t.date}</span>
        </div>
      `).join("");
    }

    modal.classList.add("active");
  },

  updateOrderStatus(orderId, newStatus) {
    window.OrderStore.updateOrderStatus(orderId, newStatus);
    window.showToast(`Order ${orderId} status updated to ${newStatus}`, "success");
  },

  // Categories Loader
  loadCategoriesGrid() {
    const grid = document.getElementById("admin-categories-grid");
    if (!grid) return;

    const categories = window.ProductStore.getCategories();
    grid.innerHTML = categories.map(c => `
      <div class="admin-cat-card">
        <img src="${c.image}" alt="${c.name}" />
        <div class="admin-cat-info">
          <h4>${c.name}</h4>
          <p>${c.count || 0} Listed Items</p>
        </div>
      </div>
    `).join("");
  },

  // Inventory Table Loader
  loadInventoryTable() {
    const tableBody = document.getElementById("admin-inventory-table-body");
    if (!tableBody) return;

    const products = window.ProductStore.getProducts();
    tableBody.innerHTML = products.map(p => {
      const isLow = p.stockQty <= 2;
      return `
        <tr class="${isLow ? 'row-low-stock' : ''}">
          <td><strong>${p.name}</strong></td>
          <td><code>${p.sku}</code></td>
          <td>${p.sizes.join(", ")}</td>
          <td><strong>${p.stockQty}</strong></td>
          <td>
            ${p.stockQty === 0 ? '<span class="status-pill status-cancelled">OUT OF STOCK</span>' : isLow ? '<span class="status-pill status-pending">LOW STOCK WARNING</span>' : '<span class="status-pill status-delivered">OK</span>'}
          </td>
        </tr>
      `;
    }).join("");
  }
};
