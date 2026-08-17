import json, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models, auth
from routers import auth as auth_router, products, categories, orders, admin, payments

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hidden_Rack Pakistan API",
    description="FastAPI + SQLAlchemy + JWT Backend for Premium Thrift Footwear E-Commerce",
    version="2.0.0"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(payments.router)

# Seed Database on Startup
@app.on_event("startup")
def seed_database():
    db = SessionLocal()

    # Seed Admin User
    admin_user = db.query(models.User).filter(models.User.email == "admin@hiddenrack.pk").first()
    if not admin_user:
        admin_user = models.User(
            id="admin-01",
            name="Hidden_Rack Admin",
            email="admin@hiddenrack.pk",
            phone="0300-0000000",
            password_hash=auth.hash_password("admin123"),
            role="admin"
        )
        db.add(admin_user)

    # Seed Customer User
    customer_user = db.query(models.User).filter(models.User.email == "zain@example.com").first()
    if not customer_user:
        customer_user = models.User(
            id="usr-01",
            name="Zain Malik",
            email="zain@example.com",
            phone="0300-1234567",
            password_hash=auth.hash_password("user123"),
            role="customer",
            street="House 45, Street 12, F-8/3",
            city="Islamabad",
            province="Islamabad Capital Territory",
            postal_code="44000"
        )
        db.add(customer_user)

    # Seed Categories
    if db.query(models.Category).count() == 0:
        default_cats = [
            models.Category(id="cat-1", name="Sneakers", slug="sneakers", image="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", count=6),
            models.Category(id="cat-2", name="Running Shoes", slug="running-shoes", image="https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80", count=2),
            models.Category(id="cat-3", name="Casual Shoes", slug="casual-shoes", image="https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80", count=4),
            models.Category(id="cat-4", name="Boots", slug="boots", image="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80", count=1),
            models.Category(id="cat-5", name="Men", slug="men", image="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80", count=8),
            models.Category(id="cat-6", name="Women", slug="women", image="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", count=5)
        ]
        db.add_all(default_cats)

    # Seed Products
    if db.query(models.Product).count() == 0:
        default_products = [
            models.Product(
                id="hr-001", sku="HR-ADI-001", name="Adidas Campus 00s 'Core Black'", brand="Adidas", category="Sneakers",
                price=8500, original_price=16500, condition="9/10 - Near Mint", condition_rating=9.0,
                sizes=json.dumps(["EU 41", "EU 42", "EU 43"]), gender="Unisex", in_stock=True, stock_qty=2,
                featured=True, new_arrival=True, hidden_drop=True,
                description="Authentic pre-loved Adidas Campus 00s in iconic Core Black & White colorway. Thick laces, suede upper intact with crisp midsole condition.",
                authenticity="100% Verified Authentic. Japan Thrift Direct Import.",
                images=json.dumps([
                    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80"
                ])
            ),
            models.Product(
                id="hr-002", sku="HR-NK-002", name="Nike Dunk Low Retro 'Panda'", brand="Nike", category="Sneakers",
                price=11500, original_price=24000, condition="9.5/10 - Mint Condition", condition_rating=9.5,
                sizes=json.dumps(["EU 40", "EU 42.5", "EU 44"]), gender="Men", in_stock=True, stock_qty=1,
                featured=True, new_arrival=True, hidden_drop=True,
                description="The most sought-after Dunk colorway in stellar condition. Minimal heel drag, clean white leather panels with sharp black overlays.",
                authenticity="Inspected by Hidden_Rack team for stitch precision, tag verification, and sole density.",
                images=json.dumps([
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
                ])
            ),
            models.Product(
                id="hr-003", sku="HR-NB-003", name="New Balance 550 'White Green'", brand="New Balance", category="Casual Shoes",
                price=12800, original_price=26000, condition="9/10 - Excellent", condition_rating=9.0,
                sizes=json.dumps(["EU 41", "EU 42", "EU 43"]), gender="Unisex", in_stock=True, stock_qty=3,
                featured=True, new_arrival=False, hidden_drop=True,
                description="Vintage retro basketball aesthetic with premium perforated leather upper and forest green accents.",
                authenticity="Sourced from UK authentic vintage estate auctions.",
                images=json.dumps(["https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80"])
            ),
            models.Product(
                id="hr-004", sku="HR-JDN-004", name="Air Jordan 1 Low 'Shadow 2.0'", brand="Jordan", category="Sneakers",
                price=14500, original_price=32000, condition="9.5/10 - Like New", condition_rating=9.5,
                sizes=json.dumps(["EU 42", "EU 43", "EU 44"]), gender="Men", in_stock=True, stock_qty=1,
                featured=True, new_arrival=True, hidden_drop=False,
                description="Iconic grey & black colorway on soft nubuck and tumbled leather. Zero star loss on toe caps.",
                authenticity="Verified Jordan wings font, black light stamp check passed.",
                images=json.dumps(["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80"])
            )
        ]
        db.add_all(default_products)

    # Seed Sample Order
    if db.query(models.Order).count() == 0:
        sample_order = models.Order(
            id="HR-ORD-9021",
            customer_id="usr-01",
            customer_name="Zain Malik",
            customer_email="zain@example.com",
            customer_phone="0300-1234567",
            shipping_address="House 45, Street 12, F-8/3, Islamabad, ICT",
            items_json=json.dumps([{
                "id": "hr-001", "name": "Adidas Campus 00s 'Core Black'", "brand": "Adidas", "price": 8500,
                "selectedSize": "EU 42", "quantity": 1,
                "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80"
            }]),
            subtotal=8500,
            delivery_fee=250,
            total=8750,
            payment_method="Cash on Delivery",
            payment_status="Pending",
            status="Delivered",
            order_date="2026-08-01",
            timeline_json=json.dumps([
                {"status": "Pending", "date": "2026-08-01 10:00 AM"},
                {"status": "Confirmed", "date": "2026-08-01 11:30 AM"},
                {"status": "Shipped", "date": "2026-08-02 09:15 AM"},
                {"status": "Delivered", "date": "2026-08-04 02:45 PM"}
            ])
        )
        db.add(sample_order)

    db.commit()
    db.close()

@app.get("/")
def root():
    return {"message": "Hidden_Rack FastAPI + SQLAlchemy + JWT Backend Active", "docs": "/docs"}
