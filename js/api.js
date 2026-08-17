/**
 * Hidden_Rack - Frontend REST API Client
 * Connects Frontend UI to Python SQLite Server (http://127.0.0.1:5000)
 */

const API_BASE = "http://127.0.0.1:5000/api";

class APIClient {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn("Backend API request fallback:", err);
      return null;
    }
  }

  // Products API
  static async getProducts() {
    const data = await this.request("/products");
    if (data) {
      window.ProductStore?.saveProducts(data);
      return data;
    }
    return window.ProductStore?.getProducts() || [];
  }

  static async getCategories() {
    const data = await this.request("/categories");
    if (data) {
      window.ProductStore?.saveCategories(data);
      return data;
    }
    return window.ProductStore?.getCategories() || [];
  }

  static async addProduct(productData) {
    const res = await this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData)
    });
    if (res && res.success) {
      await this.getProducts();
    }
  }

  static async updateProduct(id, productData) {
    const res = await this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData)
    });
    if (res && res.success) {
      await this.getProducts();
    }
  }

  static async deleteProduct(id) {
    const res = await this.request(`/products/${id}`, {
      method: "DELETE"
    });
    if (res && res.success) {
      await this.getProducts();
    }
  }

  // Auth API
  static async login(email, password) {
    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    if (res && (res.access_token || res.user)) {
      window.AuthStore?.setCurrentUser(res.user);
      return { success: true, user: res.user, token: res.access_token };
    }
    return res || { success: false, message: "Server connection failed" };
  }

  static async register(userData) {
    const res = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    if (res && res.success) {
      window.AuthStore?.setCurrentUser(res.user);
    }
    return res || { success: false, message: "Registration failed" };
  }

  // Orders API
  static async createOrder(orderData) {
    const res = await this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
    if (res && res.success) {
      return res.order;
    }
    return window.OrderStore?.createOrder(orderData);
  }

  static async getOrders() {
    const data = await this.request("/orders");
    if (data) {
      window.OrderStore?.saveOrders(data);
      return data;
    }
    return window.OrderStore?.getOrders() || [];
  }

  static async updateOrderStatus(orderId, status) {
    const res = await this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    if (res && res.success) {
      await this.getOrders();
    }
  }

  static async getAdminStats() {
    const stats = await this.request("/admin/stats");
    return stats;
  }
}

window.APIClient = APIClient;
