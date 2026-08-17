from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="customer")  # 'customer' or 'admin'
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    province = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=False)
    count = Column(Integer, default=0)

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    original_price = Column(Integer, nullable=True)
    condition = Column(String, nullable=False)
    condition_rating = Column(Float, nullable=False, default=9.0)
    sizes = Column(Text, nullable=False)  # JSON string
    gender = Column(String, default="Unisex")
    in_stock = Column(Boolean, default=True)
    stock_qty = Column(Integer, default=1)
    featured = Column(Boolean, default=False)
    new_arrival = Column(Boolean, default=False)
    hidden_drop = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    authenticity = Column(Text, nullable=True)
    images = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, nullable=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    shipping_address = Column(String, nullable=False)
    items_json = Column(Text, nullable=False)
    subtotal = Column(Integer, nullable=False)
    delivery_fee = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    payment_method = Column(String, nullable=False)
    payment_status = Column(String, default="Pending")
    status = Column(String, default="Pending")
    order_date = Column(String, nullable=False)
    timeline_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    author = Column(String, nullable=False)
    city = Column(String, nullable=False)
    stars = Column(Integer, default=5)
    quote = Column(Text, nullable=False)
    status = Column(String, default="Approved")
