import random
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Booking, Ward

router = APIRouter()


@router.post("/sms/book")
def sms_book(
    phone: str,
    ward_id: str,
    volume: int = 12000,
    db: Session = Depends(get_db),
):
    """
    Simulates an incoming SMS booking.
    SMS format: KP BOOK 12000 WARD_WHITEFIELD
    Demo: POST /sms/book?phone=9876543210&ward_id=WARD_WHITEFIELD&volume=12000
    """
    ward = db.query(Ward).filter(Ward.id == ward_id).first()
    if not ward:
        return {
            "sms_response": (
                f"ERROR: Ward {ward_id} not found. "
                "Valid: WARD_WHITEFIELD, WARD_HSR, WARD_BELLANDUR etc."
            )
        }

    otp = "".join(random.choices("0123456789", k=6))
    booking = Booking(
        id=str(uuid.uuid4()),
        citizen_name=f"SMS User ({phone[-4:]})",
        phone=phone,
        ward_id=ward_id,
        delivery_lat=ward.lat,
        delivery_lng=ward.lng,
        volume_liters=volume,
        otp=otp,
        status="PENDING",
    )
    db.add(booking)
    # Update ward pending count
    ward.pending_bookings = (ward.pending_bookings or 0) + 1
    db.commit()

    return {
        "sms_response": (
            f"KAVERI CONFIRMED: Booking {booking.id[:8]} registered. "
            f"OTP: {otp}. Estimated wait: 4 hours. — BWSSB SANCHARI KAVERI"
        ),
        "booking_id": booking.id,
    }
