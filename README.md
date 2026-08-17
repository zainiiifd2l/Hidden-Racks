# 👟 Hidden_Rack — Premium Thrift & Pre-Loved Shoes Pakistan

> **Hidden_Rack** is a full-stack e-commerce web platform engineered specifically for authentic thrifted and pre-loved footwear in Pakistan (Nike, Adidas, Jordan, New Balance, etc.).

---

## 🌟 Key Highlights & Features

### 🛒 Customer Storefront
- **Home & Catalog**: Filter sneakers by brand, category, condition rating (8.0 to 10.0), size, and PKR price range.
- **Interactive Cart & Wishlist**: Real-time quantity adjustments, free shipping calculation (over PKR 15,000), dynamic badge count indicators.
- **Pakistani Checkout**: Cash on Delivery (COD), Direct Bank Transfer (IBAN), Card payment simulation with full shipping address form for Pakistani cities.
- **Stock Auto-Decrement**: Product inventory automatically updates upon checkout.
- **Search Modal**: Live client-side product filtering overlay.
- **Policy & Help Center**: Dedicated `FAQ`, `Size Guide`, `Returns & Exchange`, and `404 Error` pages.

### 🖥️ Admin Control Panel (`/admin`)
- **Dashboard Overview**: Metrics cards (Total Products, Sales in PKR, Active Customers, Orders) + Weekly Revenue Chart.
- **Product Management**: List, search, add, **edit (with full modal support)**, and delete listings.
- **Order Management**: Status workflow (Pending → Confirmed → Shipped → Delivered → Cancelled) + **Detailed Order View Modal** (timeline, items, customer info).
- **Categories & Inventory**: Track stock warnings (Low stock alerts for items <= 2).
- **Reviews & Customers**: Manage customer profiles and ratings.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Custom Design System, CSS Variables, Responsive Layouts) |
| **Icons & Fonts** | SVG Vector Icons, Google Fonts (`Syne`, `Inter`, `Space Grotesk`) |
| **Backend (Primary)** | Python 3 `http.server` + SQLite3 + HMAC-SHA256 JWT Authentication (Zero external dependencies) |
| **Backend (REST API)** | Python FastAPI + SQLAlchemy + Pydantic + PyJWT (`/backend`) |
| **Database** | SQLite3 (`hidden_rack.db`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.9+** installed on your system.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/Hidden-Racks.git
   cd Hidden-Racks
   ```

2. **Setup Virtual Environment & Install Dependencies**:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 🏃 Running the Server

### Option A: Standard Server (`server.py` — Recommended for Quick Local Setup)
```bash
python server.py
```
- Runs at: `http://127.0.0.1:5000/`
- Serves both API endpoints (`/api/*`) and static web files.

### Option B: FastAPI Backend (`/backend`)
```bash
uvicorn backend.main:app --reload --port 5000
```
- Swagger Interactive Docs available at: `http://127.0.0.1:5000/docs`

---

## 🔐 Default Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@hiddenrack.pk` | `admin123` |
| **Sample Customer** | `zain@example.com` | `user123` |

*Note: In production environments, override `SECRET_KEY` and admin credentials via the `.env` file.*

---

## 📁 Directory Structure

```
Hidden-Racks/
├── index.html            # Main Homepage
├── shop.html             # Product Catalog & Filtering
├── product.html          # Product Detail Page
├── cart.html             # Shopping Cart
├── checkout.html         # Checkout & Order Placement
├── account.html          # Customer Account & Order History
├── login.html            # Customer Login
├── register.html         # Customer Registration
├── faq.html              # Frequently Asked Questions
├── size-guide.html       # Sneaker Sizing Guide
├── returns.html          # Returns & Exchange Policy
├── 404.html              # Custom Error Page
│
├── admin/                # Admin Panel Interface
│   ├── dashboard.html    # Admin Overview & Revenue Chart
│   ├── products.html     # Product Catalog Table & Edit Modal
│   ├── add-product.html  # Add Product Form
│   ├── orders.html       # Orders Table & Order Detail Modal
│   ├── categories.html   # Category Management
│   ├── customers.html    # Customer List
│   ├── inventory.html   # Stock Inventory Monitor
│   ├── reviews.html     # Customer Reviews Manager
│   ├── settings.html    # Store Settings
│   └── login.html        # Admin Portal Login
│
├── css/
│   ├── style.css         # Core Design System & CSS Tokens
│   ├── responsive.css    # Responsive Mobile Media Queries
│   └── admin.css         # Admin Layout Styles
│
├── js/
│   ├── api.js            # Frontend REST API Client
│   ├── auth.js           # Authentication & Session Store
│   ├── cart.js           # Shopping Cart & Wishlist Store
│   ├── products.js       # Product Data Store & Stock Manager
│   ├── main.js           # Navbar, Search Modal, Toast Engine
│   └── admin.js          # Admin Dashboard & Table Managers
│
├── backend/              # Production FastAPI Backend
│   ├── main.py           # FastAPI App Instance & Seeds
│   ├── database.py       # SQLAlchemy Connection Setup
│   ├── models.py         # DB Models (User, Product, Order, Category, Review)
│   ├── schemas.py        # Pydantic Schemas
│   └── routers/          # Modular API Routers (auth, products, orders, etc.)
│
├── server.py             # Standalone Python HTTP Server & API Engine
├── hidden_rack.db        # SQLite Database File
├── requirements.txt      # Python Dependencies
├── .env                  # Environment Variables
└── README.md             # Project Documentation
```

---

## 📜 License & Ownership
Created for **Hidden_Rack Pakistan**. All Rights Reserved.
