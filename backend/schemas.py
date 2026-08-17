from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: str
    role: str
    street: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class ProductBase(BaseModel):
    name: str
    brand: str
    category: str
    price: int
    originalPrice: Optional[int] = None
    condition: str
    conditionRating: float = 9.0
    sizes: List[str]
    gender: Optional[str] = "Unisex"
    stockQty: int = 1
    featured: Optional[bool] = False
    newArrival: Optional[bool] = False
    hiddenDrop: Optional[bool] = False
    description: str
    authenticity: Optional[str] = None
    images: List[str]

class ProductCreate(ProductBase):
    sku: Optional[str] = None

class ProductOut(ProductBase):
    id: str
    sku: str
    inStock: bool = True

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    image: str

class CategoryOut(CategoryBase):
    id: str
    slug: str
    count: int = 0

    class Config:
        from_attributes = True

class OrderItem(BaseModel):
    id: str
    name: str
    brand: str
    price: int
    selectedSize: str
    quantity: int
    image: str

class OrderCreate(BaseModel):
    customerId: Optional[str] = None
    customerName: str
    customerEmail: str
    customerPhone: str
    shippingAddress: str
    items: List[OrderItem]
    subtotal: int
    deliveryFee: int
    total: int
    paymentMethod: str

class OrderStatusUpdate(BaseModel):
    status: str
