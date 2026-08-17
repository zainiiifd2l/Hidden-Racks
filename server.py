import os
import json
import sqlite3
import hashlib
import hmac
import base64
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DB_FILE = os.getenv("DB_FILE", "hidden_rack.db")
SECRET_KEY = os.getenv("SECRET_KEY", "HIDDEN_RACK_PAKISTAN_SECRET_KEY_FASTAPI_JWT")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def create_jwt_token(payload):
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + (7 * 24 * 3600)
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload_copy).encode()).decode().rstrip("=")
    signature_input = f"{header_b64}.{payload_b64}".encode()
    signature = hmac.new(SECRET_KEY.encode(), signature_input, hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_jwt_token(token):
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signature_input = f"{header_b64}.{payload_b64}".encode()
        expected_sig = hmac.new(SECRET_KEY.encode(), signature_input, hashlib.sha256).digest()
        expected_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
        if sig_b64 != expected_b64:
            return None
        rem = len(payload_b64) % 4
        if rem > 0:
            payload_b64 += "=" * (4 - rem)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            street TEXT, city TEXT, province TEXT, postal_code TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            image TEXT NOT NULL,
            count INTEGER DEFAULT 0
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            sku TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            category TEXT NOT NULL,
            price INTEGER NOT NULL,
            original_price INTEGER,
            condition TEXT NOT NULL,
            condition_rating REAL NOT NULL,
            sizes TEXT NOT NULL,
            gender TEXT DEFAULT 'Unisex',
            in_stock INTEGER DEFAULT 1,
            stock_qty INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            new_arrival INTEGER DEFAULT 0,
            hidden_drop INTEGER DEFAULT 0,
            description TEXT,
            authenticity TEXT,
            images TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_id TEXT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            shipping_address TEXT NOT NULL,
            items_json TEXT NOT NULL,
            subtotal INTEGER NOT NULL,
            delivery_fee INTEGER NOT NULL,
            total INTEGER NOT NULL,
            payment_method TEXT NOT NULL,
            payment_status TEXT DEFAULT 'Pending',
            status TEXT DEFAULT 'Pending',
            order_date TEXT NOT NULL,
            timeline_json TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            city TEXT NOT NULL,
            stars INTEGER DEFAULT 5,
            quote TEXT NOT NULL,
            status TEXT DEFAULT 'Approved'
        )
    ''')

    conn.commit()
    seed_data(conn)
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = 'admin@hiddenrack.pk'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('admin-01', 'Hidden_Rack Admin', 'admin@hiddenrack.pk', '0300-0000000', hash_password('admin123'), 'admin'))

    cursor.execute("SELECT * FROM users WHERE email = 'zain@example.com'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, name, email, phone, password_hash, role, street, city, province, postal_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('usr-01', 'Zain Malik', 'zain@example.com', '0300-1234567', hash_password('user123'), 'customer', 'House 45, Street 12, F-8/3', 'Islamabad', 'Islamabad Capital Territory', '44000'))

    cursor.execute("SELECT COUNT(*) FROM categories")
    if cursor.fetchone()[0] == 0:
        default_cats = [
            ("cat-1", "Sneakers", "sneakers", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", 6),
            ("cat-2", "Running Shoes", "running-shoes", "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80", 2),
            ("cat-3", "Casual Shoes", "casual-shoes", "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80", 4),
            ("cat-4", "Boots", "boots", "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80", 1),
            ("cat-5", "Men", "men", "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80", 8),
            ("cat-6", "Women", "women", "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", 5)
        ]
        cursor.executemany("INSERT INTO categories VALUES (?, ?, ?, ?, ?)", default_cats)

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        default_products = [
            (
                "hr-001", "HR-ADI-001", "Adidas Campus 00s 'Core Black'", "Adidas", "Sneakers", 8500, 16500,
                "9/10 - Near Mint", 9.0, json.dumps(["EU 41", "EU 42", "EU 43"]), "Unisex", 1, 2, 1, 1, 1,
                "Authentic pre-loved Adidas Campus 00s in iconic Core Black & White colorway. Thick laces, suede upper intact with crisp midsole condition.",
                "100% Verified Authentic. Japan Thrift Direct Import.",
                json.dumps([
                    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80"
                ])
            ),
            (
                "hr-002", "HR-NK-002", "Nike Dunk Low Retro 'Panda'", "Nike", "Sneakers", 11500, 24000,
                "9.5/10 - Mint Condition", 9.5, json.dumps(["EU 40", "EU 42.5", "EU 44"]), "Men", 1, 1, 1, 1, 1,
                "The most sought-after Dunk colorway in stellar condition. Minimal heel drag, clean white leather panels with sharp black overlays.",
                "Inspected by Hidden_Rack team for stitch precision, tag verification, and sole density.",
                json.dumps([
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
                ])
            ),
            (
                "hr-003", "HR-NB-003", "New Balance 550 'White Green'", "New Balance", "Casual Shoes", 12800, 26000,
                "9/10 - Excellent", 9.0, json.dumps(["EU 41", "EU 42", "EU 43"]), "Unisex", 1, 3, 1, 0, 1,
                "Vintage retro basketball aesthetic with premium perforated leather upper and forest green accents.",
                "Sourced from UK authentic vintage estate auctions.",
                json.dumps(["https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80"])
            ),
            (
                "hr-004", "HR-JDN-004", "Air Jordan 1 Low 'Shadow 2.0'", "Jordan", "Sneakers", 14500, 32000,
                "9.5/10 - Like New", 9.5, json.dumps(["EU 42", "EU 43", "EU 44"]), "Men", 1, 1, 1, 1, 0,
                "Iconic grey & black colorway on soft nubuck and tumbled leather. Zero star loss on toe caps.",
                "Verified Jordan wings font, black light stamp check passed.",
                json.dumps(["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80"])
            )
        ]
        cursor.executemany('''
            INSERT INTO products (id, sku, name, brand, category, price, original_price, condition, condition_rating, sizes, gender, in_stock, stock_qty, featured, new_arrival, hidden_drop, description, authenticity, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', default_products)

    cursor.execute("SELECT COUNT(*) FROM orders")
    if cursor.fetchone()[0] == 0:
        sample_order = (
            "HR-ORD-9021", "usr-01", "Zain Malik", "zain@example.com", "0300-1234567",
            "House 45, Street 12, F-8/3, Islamabad, ICT",
            json.dumps([{
                "id": "hr-001", "name": "Adidas Campus 00s 'Core Black'", "brand": "Adidas", "price": 8500,
                "selectedSize": "EU 42", "quantity": 1,
                "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80"
            }]),
            8500, 250, 8750, "Cash on Delivery", "Pending", "Delivered", "2026-08-01",
            json.dumps([
                {"status": "Pending", "date": "2026-08-01 10:00 AM"},
                {"status": "Confirmed", "date": "2026-08-01 11:30 AM"},
                {"status": "Shipped", "date": "2026-08-02 09:15 AM"},
                {"status": "Delivered", "date": "2026-08-04 02:45 PM"}
            ])
        )
        cursor.execute('''
            INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, shipping_address, items_json, subtotal, delivery_fee, total, payment_method, payment_status, status, order_date, timeline_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_order)

    conn.commit()

class HiddenRackHandler(SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def parse_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length).decode('utf-8')
            return json.loads(body)
        return {}

    def get_token_user(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            return verify_jwt_token(token)
        return None

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/products":
            self.handle_get_products(query)
        elif path.startswith("/api/products/"):
            product_id = path.split("/")[-1]
            self.handle_get_product_detail(product_id)
        elif path == "/api/categories":
            self.handle_get_categories()
        elif path == "/api/orders":
            self.handle_get_orders(query)
        elif path == "/api/admin/stats":
            self.handle_get_admin_stats()
        elif path == "/api/admin/users" or path == "/api/users":
            self.handle_get_users()
        elif path == "/api/auth/me":
            user_data = self.get_token_user()
            if user_data:
                self.send_json(user_data)
            else:
                self.send_json({"error": "Unauthorized"}, 401)
        else:
            super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        data = self.parse_body()

        if path == "/api/auth/login":
            self.handle_login(data)
        elif path == "/api/auth/register":
            self.handle_register(data)
        elif path == "/api/products":
            self.handle_add_product(data)
        elif path == "/api/categories":
            self.handle_add_category(data)
        elif path == "/api/orders":
            self.handle_create_order(data)
        elif path == "/api/payments/mobile-wallet" or path == "/api/payments/jazzcash" or path == "/api/payments/easypaisa":
            self.handle_mobile_payment(data)
        elif path == "/api/payments/stripe":
            self.handle_stripe_payment(data)
        else:
            self.send_json({"error": "Endpoint not found"}, 404)

    def do_PUT(self):
        path = urlparse(self.path).path
        data = self.parse_body()

        if path.startswith("/api/orders/") and path.endswith("/status"):
            order_id = path.split("/")[3]
            self.handle_update_order_status(order_id, data)
        elif path.startswith("/api/products/"):
            product_id = path.split("/")[-1]
            self.handle_update_product(product_id, data)
        else:
            self.send_json({"error": "Endpoint not found"}, 404)

    def do_DELETE(self):
        path = urlparse(self.path).path
        if path.startswith("/api/products/"):
            product_id = path.split("/")[-1]
            self.handle_delete_product(product_id)
        else:
            self.send_json({"error": "Endpoint not found"}, 404)

    def handle_get_products(self, query):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        products = []
        for r in rows:
            p = dict(r)
            p['sizes'] = json.loads(p['sizes']) if p['sizes'] else []
            p['images'] = json.loads(p['images']) if p['images'] else []
            p['inStock'] = bool(p['in_stock'])
            p['stockQty'] = p['stock_qty']
            p['featured'] = bool(p['featured'])
            p['newArrival'] = bool(p['new_arrival'])
            p['hiddenDrop'] = bool(p['hidden_drop'])
            p['originalPrice'] = p['original_price']
            p['conditionRating'] = p['condition_rating']
            products.append(p)

        self.send_json(products)

    def handle_get_product_detail(self, product_id):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            p = dict(row)
            p['sizes'] = json.loads(p['sizes']) if p['sizes'] else []
            p['images'] = json.loads(p['images']) if p['images'] else []
            p['inStock'] = bool(p['in_stock'])
            p['stockQty'] = p['stock_qty']
            p['featured'] = bool(p['featured'])
            p['newArrival'] = bool(p['new_arrival'])
            p['hiddenDrop'] = bool(p['hidden_drop'])
            p['originalPrice'] = p['original_price']
            p['conditionRating'] = p['condition_rating']
            self.send_json(p)
        else:
            self.send_json({"error": "Product not found"}, 404)

    def handle_get_categories(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        self.send_json(rows)

    def handle_login(self, data):
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        pwd_hash = hash_password(password)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = ? AND password_hash = ?", (email, pwd_hash))
        row = cursor.fetchone()
        conn.close()

        if row:
            user = dict(row)
            del user['password_hash']
            jwt_token = create_jwt_token({"sub": user['id'], "role": user['role'], "name": user['name'], "email": user['email']})
            self.send_json({"access_token": jwt_token, "token_type": "bearer", "user": user})
        else:
            self.send_json({"success": False, "message": "Invalid credentials"}, 401)

    def handle_register(self, data):
        conn = get_db()
        cursor = conn.cursor()
        email = data.get("email", "").strip().lower()

        cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return self.send_json({"success": False, "message": "User with this email already exists"}, 400)

        user_id = "usr-" + os.urandom(4).hex()
        pwd_hash = hash_password(data.get("password", ""))

        cursor.execute('''
            INSERT INTO users (id, name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, 'customer')
        ''', (user_id, data.get("name"), email, data.get("phone"), pwd_hash))

        conn.commit()
        conn.close()

        new_user = {
            "id": user_id,
            "name": data.get("name"),
            "email": email,
            "phone": data.get("phone"),
            "role": "customer"
        }
        jwt_token = create_jwt_token({"sub": user_id, "role": "customer", "name": data.get("name"), "email": email})
        self.send_json({"access_token": jwt_token, "token_type": "bearer", "user": new_user})

    def handle_add_product(self, data):
        conn = get_db()
        cursor = conn.cursor()

        p_id = "hr-" + os.urandom(4).hex()
        sku = data.get("sku") or ("HR-" + data.get("brand", "GEN")[:3].upper() + "-" + str(os.urandom(2).hex().upper()))

        cursor.execute('''
            INSERT INTO products (id, sku, name, brand, category, price, original_price, condition, condition_rating, sizes, gender, in_stock, stock_qty, featured, new_arrival, hidden_drop, description, authenticity, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p_id, sku, data.get("name"), data.get("brand"), data.get("category"),
            int(data.get("price")), data.get("originalPrice"), data.get("condition"),
            float(data.get("conditionRating", 9.0)), json.dumps(data.get("sizes", [])),
            data.get("gender", "Unisex"), 1 if data.get("stockQty", 1) > 0 else 0,
            int(data.get("stockQty", 1)), 1 if data.get("featured") else 0,
            1 if data.get("newArrival") else 0, 1 if data.get("hiddenDrop") else 0,
            data.get("description"), data.get("authenticity"), json.dumps(data.get("images", []))
        ))

        conn.commit()
        conn.close()
        self.send_json({"success": True, "id": p_id})

    def handle_add_category(self, data):
        conn = get_db()
        cursor = conn.cursor()
        cat_id = "cat-" + os.urandom(4).hex()
        slug = data.get("name").lower().replace(" ", "-")

        cursor.execute("INSERT INTO categories VALUES (?, ?, ?, ?, 0)", (cat_id, data.get("name"), slug, data.get("image")))
        conn.commit()
        conn.close()
        self.send_json({"success": True, "id": cat_id})

    def handle_create_order(self, data):
        conn = get_db()
        cursor = conn.cursor()

        order_id = "HR-ORD-" + str(os.urandom(2).hex().upper())
        import datetime
        order_date = datetime.date.today().isoformat()
        timeline = [{"status": "Pending", "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}]

        items = data.get("items", [])
        cursor.execute('''
            INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, shipping_address, items_json, subtotal, delivery_fee, total, payment_method, payment_status, status, order_date, timeline_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
        ''', (
            order_id, data.get("customerId"), data.get("customerName"), data.get("customerEmail"),
            data.get("customerPhone"), data.get("shippingAddress"), json.dumps(items),
            int(data.get("subtotal")), int(data.get("deliveryFee")), int(data.get("total")),
            data.get("paymentMethod"), "Pending", order_date, json.dumps(timeline)
        ))

        # Decrement stock quantity for each purchased item
        for item in items:
            item_id = item.get("id")
            qty = item.get("quantity", 1)
            cursor.execute("SELECT stock_qty FROM products WHERE id = ?", (item_id,))
            prod_row = cursor.fetchone()
            if prod_row:
                current_qty = prod_row["stock_qty"]
                new_qty = max(0, current_qty - qty)
                in_stock = 1 if new_qty > 0 else 0
                cursor.execute("UPDATE products SET stock_qty = ?, in_stock = ? WHERE id = ?", (new_qty, in_stock, item_id))

        conn.commit()
        conn.close()

        order_res = {
            "id": order_id,
            "customerName": data.get("customerName"),
            "shippingAddress": data.get("shippingAddress"),
            "paymentMethod": data.get("paymentMethod"),
            "total": data.get("total"),
            "status": "Pending"
        }
        self.send_json({"success": True, "order": order_res})

    def handle_get_orders(self, query):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders ORDER BY rowid DESC")
        rows = cursor.fetchall()
        conn.close()

        orders = []
        for r in rows:
            o = dict(r)
            o['items'] = json.loads(o['items_json'])
            o['timeline'] = json.loads(o['timeline_json'])
            orders.append(o)
        self.send_json(orders)

    def handle_update_product(self, product_id, data):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        if not cursor.fetchone():
            conn.close()
            return self.send_json({"error": "Product not found"}, 404)

        cursor.execute('''
            UPDATE products SET
                name = COALESCE(?, name),
                brand = COALESCE(?, brand),
                category = COALESCE(?, category),
                price = COALESCE(?, price),
                original_price = COALESCE(?, original_price),
                condition = COALESCE(?, condition),
                condition_rating = COALESCE(?, condition_rating),
                sizes = COALESCE(?, sizes),
                stock_qty = COALESCE(?, stock_qty),
                in_stock = COALESCE(?, in_stock),
                featured = COALESCE(?, featured),
                new_arrival = COALESCE(?, new_arrival),
                hidden_drop = COALESCE(?, hidden_drop),
                description = COALESCE(?, description),
                authenticity = COALESCE(?, authenticity)
            WHERE id = ?
        ''', (
            data.get("name"), data.get("brand"), data.get("category"),
            int(data.get("price")) if data.get("price") is not None else None,
            int(data.get("originalPrice")) if data.get("originalPrice") is not None else None,
            data.get("condition"),
            float(data.get("conditionRating")) if data.get("conditionRating") is not None else None,
            json.dumps(data.get("sizes")) if data.get("sizes") is not None else None,
            int(data.get("stockQty")) if data.get("stockQty") is not None else None,
            (1 if int(data.get("stockQty")) > 0 else 0) if data.get("stockQty") is not None else None,
            (1 if data.get("featured") else 0) if "featured" in data else None,
            (1 if data.get("newArrival") else 0) if "newArrival" in data else None,
            (1 if data.get("hiddenDrop") else 0) if "hiddenDrop" in data else None,
            data.get("description"), data.get("authenticity"),
            product_id
        ))

        conn.commit()
        conn.close()
        self.send_json({"success": True, "id": product_id})

    def handle_update_order_status(self, order_id, data):
        conn = get_db()
        cursor = conn.cursor()
        new_status = data.get("status")

        cursor.execute("SELECT timeline_json FROM orders WHERE id = ?", (order_id,))
        row = cursor.fetchone()

        if row:
            timeline = json.loads(row['timeline_json'])
            import datetime
            timeline.append({"status": new_status, "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")})

            cursor.execute("UPDATE orders SET status = ?, timeline_json = ? WHERE id = ?", (new_status, json.dumps(timeline), order_id))
            conn.commit()
            conn.close()
            self.send_json({"success": True})
        else:
            conn.close()
            self.send_json({"error": "Order not found"}, 404)

    def handle_delete_product(self, product_id):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        conn.commit()
        conn.close()
        self.send_json({"success": True})

    def handle_get_admin_stats(self):
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM categories")
        total_categories = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM orders")
        total_orders = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM users")
        total_customers = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(total) FROM orders")
        total_sales = cursor.fetchone()[0] or 0

        conn.close()
        self.send_json({
            "totalProducts": total_products,
            "totalCategories": total_categories,
            "totalOrders": total_orders,
            "totalCustomers": total_customers,
            "totalSales": total_sales
        })

    def handle_get_users(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, phone, role, street, city, province FROM users")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        self.send_json(rows)

    def handle_mobile_payment(self, data):
        provider = data.get("provider", "JazzCash")
        acc = data.get("accountNumber", "")
        if len(acc) < 10:
            return self.send_json({"success": False, "message": "Invalid mobile wallet number"}, 400)
        txn_id = f"{provider.upper()}-TXN-" + os.urandom(3).hex().upper()
        self.send_json({"success": True, "provider": provider, "transactionId": txn_id, "message": "Mobile payment approved!"})

    def handle_stripe_payment(self, data):
        card = data.get("cardNumber", "")
        if len(card) < 14:
            return self.send_json({"success": False, "message": "Invalid card number"}, 400)
        txn_id = "ch_stripe_" + os.urandom(4).hex()
        self.send_json({"success": True, "transactionId": txn_id, "message": "Card charged successfully!"})

def run_server(port=5000):
    init_db()
    server_address = ('', port)
    httpd = HTTPServer(server_address, HiddenRackHandler)
    print(f"Python SQL & FastAPI REST Server running at http://127.0.0.1:{port}/")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server(5000)
