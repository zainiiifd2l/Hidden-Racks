/**
 * Hidden_Rack - Product Catalog & Local Data Management
 * Premium Thrifted & Pre-Loved Footwear in Pakistan
 * Python SQL Server Integrated
 */

const DEFAULT_PRODUCTS = [
  {
    id: "hr-001",
    name: "Adidas Campus 00s 'Core Black'",
    brand: "Adidas",
    category: "Sneakers",
    price: 8500,
    originalPrice: 16500,
    condition: "9/10 - Near Mint",
    conditionRating: 9.0,
    sizes: ["EU 41", "EU 42", "EU 43"],
    gender: "Unisex",
    inStock: true,
    stockQty: 2,
    featured: true,
    newArrival: true,
    hiddenDrop: true,
    sku: "HR-ADI-001",
    description: "Authentic pre-loved Adidas Campus 00s in iconic Core Black & White colorway. Thick laces, suede upper intact with crisp midsole condition. Thoroughly sanitized and authenticated.",
    authenticity: "100% Verified Authentic. Japan Thrift Direct Import.",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "hr-002",
    name: "Nike Dunk Low Retro 'Panda'",
    brand: "Nike",
    category: "Sneakers",
    price: 11500,
    originalPrice: 24000,
    condition: "9.5/10 - Mint Condition",
    conditionRating: 9.5,
    sizes: ["EU 40", "EU 42.5", "EU 44"],
    gender: "Men",
    inStock: true,
    stockQty: 1,
    featured: true,
    newArrival: true,
    hiddenDrop: true,
    sku: "HR-NK-002",
    description: "The most sought-after Dunk colorway in stellar condition. Minimal heel drag, clean white leather panels with sharp black overlays. Deep cleaned and disinfected.",
    authenticity: "Inspected by Hidden_Rack team for stitch precision, tag verification, and sole density.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "hr-003",
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    category: "Casual Shoes",
    price: 12800,
    originalPrice: 26000,
    condition: "9/10 - Excellent",
    conditionRating: 9.0,
    sizes: ["EU 41", "EU 42", "EU 43"],
    gender: "Unisex",
    inStock: true,
    stockQty: 3,
    featured: true,
    newArrival: false,
    hiddenDrop: true,
    sku: "HR-NB-003",
    description: "Vintage retro basketball aesthetic with premium perforated leather upper and forest green accents. Insoles replaced with cushioned orthopedic inserts.",
    authenticity: "Sourced from UK authentic vintage estate auctions.",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "hr-004",
    name: "Air Jordan 1 Low 'Shadow 2.0'",
    brand: "Jordan",
    category: "Sneakers",
    price: 14500,
    originalPrice: 32000,
    condition: "9.5/10 - Like New",
    conditionRating: 9.5,
    sizes: ["EU 42", "EU 43", "EU 44"],
    gender: "Men",
    inStock: true,
    stockQty: 1,
    featured: true,
    newArrival: true,
    hiddenDrop: false,
    sku: "HR-JDN-004",
    description: "Iconic grey & black colorway on soft nubuck and tumbled leather. Zero star loss on toe caps, vivid wings logo stitching.",
    authenticity: "Verified Jordan wings font, black light stamp check passed.",
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80"
    ]
  }
];

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Sneakers", slug: "sneakers", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", count: 6 },
  { id: "cat-2", name: "Running Shoes", slug: "running-shoes", image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80", count: 2 },
  { id: "cat-3", name: "Casual Shoes", slug: "casual-shoes", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80", count: 4 },
  { id: "cat-4", name: "Boots", slug: "boots", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80", count: 1 },
  { id: "cat-5", name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80", count: 8 },
  { id: "cat-6", name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", count: 5 }
];

// Local & Python API Store Adapter
class ProductStore {
  static getProducts() {
    const data = localStorage.getItem("hr_products");
    if (!data) {
      localStorage.setItem("hr_products", JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(data);
  }

  static saveProducts(products) {
    localStorage.setItem("hr_products", JSON.stringify(products));
  }

  static getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  static addProduct(productData) {
    if (window.APIClient) {
      window.APIClient.addProduct(productData);
    }
    const products = this.getProducts();
    const newProduct = {
      id: "hr-" + Date.now().toString(36),
      sku: productData.sku || ("HR-" + (productData.brand || "GEN").toUpperCase().slice(0, 3) + "-" + Math.floor(100 + Math.random() * 900)),
      inStock: (productData.stockQty || 1) > 0,
      conditionRating: parseFloat(productData.conditionRating) || 9.0,
      images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80"],
      ...productData
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id, productData) {
    if (window.APIClient) {
      window.APIClient.updateProduct(id, productData);
    }
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index] = {
        ...products[index],
        ...productData,
        inStock: (productData.stockQty !== undefined ? productData.stockQty : products[index].stockQty) > 0
      };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  }

  static decrementStock(productId, quantity = 1) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStock = Math.max(0, (product.stockQty || 1) - quantity);
      product.stockQty = newStock;
      product.inStock = newStock > 0;
      this.saveProducts(products);
    }
  }

  static deleteProduct(id) {
    if (window.APIClient) {
      window.APIClient.deleteProduct(id);
    }
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
  }

  static getCategories() {
    const data = localStorage.getItem("hr_categories");
    if (!data) {
      localStorage.setItem("hr_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
  }

  static saveCategories(categories) {
    localStorage.setItem("hr_categories", JSON.stringify(categories));
  }

  static addCategory(cat) {
    if (window.APIClient) {
      window.APIClient.request("/categories", { method: "POST", body: JSON.stringify(cat) });
    }
    const cats = this.getCategories();
    const newCat = {
      id: "cat-" + Date.now(),
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      ...cat
    };
    cats.push(newCat);
    this.saveCategories(cats);
    return newCat;
  }

  static formatPKR(amount) {
    return "PKR " + Number(amount).toLocaleString("en-PK");
  }
}

class ReviewStore {
  static getReviews() {
    const data = localStorage.getItem("hr_reviews");
    if (!data) {
      const DEFAULT_REVIEWS = [
        { id: "rev-1", productId: "hr-001", customerName: "Ali Raza", rating: 5, comment: "Crisp 9.5/10 condition! Soles looked brand new. Super fast delivery to Lahore.", date: "2026-08-05" },
        { id: "rev-2", productId: "hr-002", customerName: "Usman Ghani", rating: 5, comment: "Authentic Nike Dunk Panda. Verified serial code under tongue. Will buy again!", date: "2026-08-08" }
      ];
      localStorage.setItem("hr_reviews", JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    return JSON.parse(data);
  }

  static getReviewsForProduct(productId) {
    const reviews = this.getReviews();
    return reviews.filter(r => r.productId === productId);
  }

  static addReview(reviewData) {
    const reviews = this.getReviews();
    const newRev = {
      id: "rev-" + Date.now().toString(36),
      productId: reviewData.productId,
      customerName: reviewData.customerName || "Verified Buyer",
      rating: parseInt(reviewData.rating) || 5,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0]
    };
    reviews.unshift(newRev);
    localStorage.setItem("hr_reviews", JSON.stringify(reviews));
    window.showToast?.("Thank you! Your review has been submitted.", "success");
    return newRev;
  }
}

// Initial API Sync
document.addEventListener("DOMContentLoaded", async () => {
  if (window.APIClient) {
    await window.APIClient.getProducts();
    await window.APIClient.getCategories();
  }
});

window.ProductStore = ProductStore;
window.ReviewStore = ReviewStore;
