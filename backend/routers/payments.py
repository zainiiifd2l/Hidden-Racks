from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/api/payments", tags=["Payments"])

class MobileWalletPaymentRequest(BaseModel):
    provider: str  # 'JazzCash' or 'Easypaisa'
    accountNumber: str
    amount: int
    orderId: str

class StripePaymentRequest(BaseModel):
    cardNumber: str
    expMonth: str
    expYear: str
    cvc: str
    amount: int
    orderId: str

@router.post("/mobile-wallet")
def process_mobile_wallet(req: MobileWalletPaymentRequest):
    if len(req.accountNumber) < 11:
        raise HTTPException(status_code=400, detail="Invalid mobile wallet account number.")

    txn_id = f"{req.provider.upper()}-TXN-" + os.urandom(3).hex().upper()
    return {
        "success": True,
        "provider": req.provider,
        "transactionId": txn_id,
        "message": f"Payment of PKR {req.amount} via {req.provider} authorized successfully!"
    }

@router.post("/stripe")
def process_stripe(req: StripePaymentRequest):
    if len(req.cardNumber) < 15:
        raise HTTPException(status_code=400, detail="Invalid card number.")

    txn_id = "ch_stripe_" + os.urandom(4).hex()
    return {
        "success": True,
        "transactionId": txn_id,
        "message": f"Card payment of PKR {req.amount} charged successfully!"
    }
