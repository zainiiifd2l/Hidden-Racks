from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    total_categories = db.query(models.Category).count()
    total_orders = db.query(models.Order).count()
    total_customers = db.query(models.User).count()
    total_sales = db.query(func.sum(models.Order.total)).scalar() or 0

    return {
        "totalProducts": total_products,
        "totalCategories": total_categories,
        "totalOrders": total_orders,
        "totalCustomers": total_customers,
        "totalSales": total_sales
    }

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role,
            "city": u.city or "Islamabad"
        })
    return result
