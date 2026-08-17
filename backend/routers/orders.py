import json, os, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    result = []
    for o in orders:
        res = {
            "id": o.id,
            "customerId": o.customer_id,
            "customerName": o.customer_name,
            "customerEmail": o.customer_email,
            "customerPhone": o.customer_phone,
            "shippingAddress": o.shipping_address,
            "items": json.loads(o.items_json),
            "subtotal": o.subtotal,
            "deliveryFee": o.delivery_fee,
            "total": o.total,
            "paymentMethod": o.payment_method,
            "paymentStatus": o.payment_status,
            "status": o.status,
            "orderDate": o.order_date,
            "timeline": json.loads(o.timeline_json)
        }
        result.append(res)
    return result

@router.post("")
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    order_id = "HR-ORD-" + os.urandom(2).hex().upper()
    order_date = datetime.date.today().isoformat()

    items_list = [item.dict() for item in order_data.items]
    timeline = [{"status": "Pending", "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}]

    new_order = models.Order(
        id=order_id,
        customer_id=order_data.customerId or "guest",
        customer_name=order_data.customerName,
        customer_email=order_data.customerEmail,
        customer_phone=order_data.customerPhone,
        shipping_address=order_data.shippingAddress,
        items_json=json.dumps(items_list),
        subtotal=order_data.subtotal,
        delivery_fee=order_data.deliveryFee,
        total=order_data.total,
        payment_method=order_data.paymentMethod,
        payment_status="Pending",
        status="Pending",
        order_date=order_date,
        timeline_json=json.dumps(timeline)
    )

    db.add(new_order)

    # Decrement stock for ordered products
    for item in order_data.items:
        prod = db.query(models.Product).filter(models.Product.id == item.id).first()
        if prod:
            prod.stock_qty = max(0, prod.stock_qty - item.quantity)
            prod.in_stock = True if prod.stock_qty > 0 else False

    db.commit()

    return {
        "success": True,
        "order": {
            "id": order_id,
            "customerName": order_data.customerName,
            "shippingAddress": order_data.shippingAddress,
            "paymentMethod": order_data.paymentMethod,
            "total": order_data.total,
            "status": "Pending"
        }
    }

@router.put("/{order_id}/status")
def update_order_status(order_id: str, status_data: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    timeline = json.loads(order.timeline_json)
    timeline.append({
        "status": status_data.status,
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    })

    order.status = status_data.status
    order.timeline_json = json.dumps(timeline)
    db.commit()

    return {"success": True, "status": status_data.status}
