/**
 * Hidden_Rack - Authentication & Session Engine
 * Manages Customer Auth, Admin Auth, and Orders Store
 */

// Simple hash utility for local credential comparison (not cryptographic security — use backend API for production auth)
async function _hrHash(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const DEFAULT_ADMIN = {
  id: "admin-01",
  email: "admin@hiddenrack.pk",
  _pwHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // hashed
  name: "Hidden_Rack Admin",
  role: "admin"
};

const DEFAULT_USERS = [
  {
    id: "usr-01",
    name: "Zain Malik",
    email: "zain@example.com",
    phone: "0300-1234567",
    _pwHash: "96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e", // hashed
    role: "customer",
    address: {
      street: "House 45, Street 12, F-8/3",
      city: "Islamabad",
      province: "Islamabad Capital Territory",
      postalCode: "44000"
    }
  },
  {
    id: "usr-02",
    name: "Hamza Khan",
    email: "hamza@example.com",
    phone: "0321-9876543",
    _pwHash: "96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e", // hashed
    role: "customer",
    address: {
      street: "Flat B-4, Gulberg III",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000"
    }
  }
];

const DEFAULT_ORDERS = [
  {
    id: "HR-ORD-9021",
    customerId: "usr-01",
    customerName: "Zain Malik",
    customerEmail: "zain@example.com",
    customerPhone: "0300-1234567",
    shippingAddress: "House 45, Street 12, F-8/3, Islamabad, ICT",
    items: [
      {
        id: "hr-001",
        name: "Adidas Campus 00s 'Core Black'",
        brand: "Adidas",
        price: 8500,
        selectedSize: "EU 42",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80"
      }
    ],
    subtotal: 8500,
    deliveryFee: 250,
    total: 8750,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "Delivered",
    orderDate: "2026-08-01",
    timeline: [
      { status: "Pending", date: "2026-08-01 10:00 AM" },
      { status: "Confirmed", date: "2026-08-01 11:30 AM" },
      { status: "Shipped", date: "2026-08-02 09:15 AM" },
      { status: "Delivered", date: "2026-08-04 02:45 PM" }
    ]
  },
  {
    id: "HR-ORD-9022",
    customerId: "usr-02",
    customerName: "Hamza Khan",
    customerEmail: "hamza@example.com",
    customerPhone: "0321-9876543",
    shippingAddress: "Flat B-4, Gulberg III, Lahore, Punjab",
    items: [
      {
        id: "hr-002",
        name: "Nike Dunk Low Retro 'Panda'",
        brand: "Nike",
        price: 11500,
        selectedSize: "EU 42.5",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80"
      }
    ],
    subtotal: 11500,
    deliveryFee: 250,
    total: 11750,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    status: "Shipped",
    orderDate: "2026-08-05",
    timeline: [
      { status: "Pending", date: "2026-08-05 04:20 PM" },
      { status: "Confirmed", date: "2026-08-05 05:00 PM" },
      { status: "Shipped", date: "2026-08-06 10:00 AM" }
    ]
  }
];

class AuthStore {
  static getUsers() {
    const data = localStorage.getItem("hr_users");
    if (!data) {
      localStorage.setItem("hr_users", JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  }

  static getCurrentUser() {
    const data = localStorage.getItem("hr_session");
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user) {
    if (user) {
      localStorage.setItem("hr_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("hr_session");
    }
  }

  static async loginCustomer(email, password) {
    const users = this.getUsers();
    const inputHash = await _hrHash(password);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u._pwHash === inputHash);
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: "Invalid email address or password." };
  }

  static async registerCustomer(userData) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }

    const pwHash = await _hrHash(userData.password);
    const newUser = {
      id: "usr-" + Date.now().toString(36),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      _pwHash: pwHash,
      role: "customer",
      address: {
        street: userData.street || "",
        city: userData.city || "",
        province: userData.province || "",
        postalCode: userData.postalCode || ""
      }
    };

    users.push(newUser);
    localStorage.setItem("hr_users", JSON.stringify(users));
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  static async loginAdmin(email, password) {
    const inputHash = await _hrHash(password);
    if (email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() && inputHash === DEFAULT_ADMIN._pwHash) {
      this.setCurrentUser(DEFAULT_ADMIN);
      return { success: true, user: DEFAULT_ADMIN };
    }
    return { success: false, message: "Invalid Admin Credentials." };
  }

  static logout() {
    this.setCurrentUser(null);
  }

  static requireAdmin() {
    const current = this.getCurrentUser();
    if (!current || current.role !== "admin") {
      const isInsideAdminDir = window.location.pathname.includes("/admin/");
      window.location.href = isInsideAdminDir ? "login.html" : "admin/login.html";
    }
  }
}

class OrderStore {
  static getOrders() {
    const data = localStorage.getItem("hr_orders");
    if (!data) {
      localStorage.setItem("hr_orders", JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(data);
  }

  static saveOrders(orders) {
    localStorage.setItem("hr_orders", JSON.stringify(orders));
  }

  static createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: "HR-ORD-" + Math.floor(1000 + Math.random() * 9000),
      orderDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      paymentStatus: orderData.paymentMethod === "Bank Transfer" ? "Awaiting Verification" : "Pending",
      timeline: [
        { status: "Pending", date: new Date().toLocaleString() }
      ],
      ...orderData
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  static updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.timeline.push({
        status: newStatus,
        date: new Date().toLocaleString()
      });
      this.saveOrders(orders);
      return order;
    }
    return null;
  }
}

window.AuthStore = AuthStore;
window.OrderStore = OrderStore;
