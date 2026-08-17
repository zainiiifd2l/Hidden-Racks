import json, os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[schemas.ProductOut])
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    max_price: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            models.Product.name.ilike(s) | 
            models.Product.brand.ilike(s) | 
            models.Product.category.ilike(s)
        )

    if category:
        query = query.filter(models.Product.category == category)

    if brand:
        query = query.filter(models.Product.brand == brand)

    if max_price:
        query = query.filter(models.Product.price <= max_price)

    products = query.order_by(models.Product.created_at.desc()).all()

    result = []
    for p in products:
        p_dict = {
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "originalPrice": p.original_price,
            "condition": p.condition,
            "conditionRating": p.condition_rating,
            "sizes": json.loads(p.sizes) if p.sizes else [],
            "gender": p.gender,
            "inStock": bool(p.in_stock),
            "stockQty": p.stock_qty,
            "featured": bool(p.featured),
            "newArrival": bool(p.new_arrival),
            "hiddenDrop": bool(p.hidden_drop),
            "description": p.description or "",
            "authenticity": p.authenticity or "",
            "images": json.loads(p.images) if p.images else []
        }
        result.append(p_dict)
    return result

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": p.id,
        "sku": p.sku,
        "name": p.name,
        "brand": p.brand,
        "category": p.category,
        "price": p.price,
        "originalPrice": p.original_price,
        "condition": p.condition,
        "conditionRating": p.condition_rating,
        "sizes": json.loads(p.sizes) if p.sizes else [],
        "gender": p.gender,
        "inStock": bool(p.in_stock),
        "stockQty": p.stock_qty,
        "featured": bool(p.featured),
        "newArrival": bool(p.new_arrival),
        "hiddenDrop": bool(p.hidden_drop),
        "description": p.description or "",
        "authenticity": p.authenticity or "",
        "images": json.loads(p.images) if p.images else []
    }

@router.post("", response_model=schemas.ProductOut)
def create_product(product_data: schemas.ProductCreate, db: Session = Depends(get_db)):
    p_id = "hr-" + os.urandom(4).hex()
    sku = product_data.sku or ("HR-" + product_data.brand[:3].upper() + "-" + os.urandom(2).hex().upper())

    new_prod = models.Product(
        id=p_id,
        sku=sku,
        name=product_data.name,
        brand=product_data.brand,
        category=product_data.category,
        price=product_data.price,
        original_price=product_data.originalPrice,
        condition=product_data.condition,
        condition_rating=product_data.conditionRating,
        sizes=json.dumps(product_data.sizes),
        gender=product_data.gender or "Unisex",
        in_stock=True if product_data.stockQty > 0 else False,
        stock_qty=product_data.stockQty,
        featured=product_data.featured or False,
        new_arrival=product_data.newArrival or False,
        hidden_drop=product_data.hiddenDrop or False,
        description=product_data.description,
        authenticity=product_data.authenticity or "100% Genuine Verified Import.",
        images=json.dumps(product_data.images)
    )

    db.add(new_prod)
    db.commit()

    return {
        "id": p_id,
        "sku": sku,
        "name": product_data.name,
        "brand": product_data.brand,
        "category": product_data.category,
        "price": product_data.price,
        "originalPrice": product_data.originalPrice,
        "condition": product_data.condition,
        "conditionRating": product_data.conditionRating,
        "sizes": product_data.sizes,
        "gender": product_data.gender,
        "inStock": True,
        "stockQty": product_data.stockQty,
        "featured": product_data.featured,
        "newArrival": product_data.newArrival,
        "hiddenDrop": product_data.hiddenDrop,
        "description": product_data.description,
        "authenticity": product_data.authenticity,
        "images": product_data.images
    }

@router.put("/{product_id}")
def update_product(product_id: str, product_data: dict, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    if "name" in product_data: p.name = product_data["name"]
    if "brand" in product_data: p.brand = product_data["brand"]
    if "category" in product_data: p.category = product_data["category"]
    if "price" in product_data: p.price = int(product_data["price"])
    if "originalPrice" in product_data: p.original_price = int(product_data["originalPrice"]) if product_data["originalPrice"] else None
    if "condition" in product_data: p.condition = product_data["condition"]
    if "conditionRating" in product_data: p.condition_rating = float(product_data["conditionRating"])
    if "sizes" in product_data: p.sizes = json.dumps(product_data["sizes"])
    if "gender" in product_data: p.gender = product_data["gender"]
    if "stockQty" in product_data:
        p.stock_qty = int(product_data["stockQty"])
        p.in_stock = True if p.stock_qty > 0 else False
    if "featured" in product_data: p.featured = bool(product_data["featured"])
    if "newArrival" in product_data: p.new_arrival = bool(product_data["newArrival"])
    if "hiddenDrop" in product_data: p.hidden_drop = bool(product_data["hiddenDrop"])
    if "description" in product_data: p.description = product_data["description"]
    if "authenticity" in product_data: p.authenticity = product_data["authenticity"]
    if "images" in product_data: p.images = json.dumps(product_data["images"])

    db.commit()
    return {"success": True, "id": product_id}

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"success": True}
