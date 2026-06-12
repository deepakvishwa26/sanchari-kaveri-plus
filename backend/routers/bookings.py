import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Booking, Ward, AuditLog
from schemas import BookingCreate, BookingCreateResponse, ConfirmDeliveryRequest, ConfirmDeliveryResponse
from services.otp import generate_otp
from datetime import datetime

router = APIRouter()


@router.post("/bookings", response_model=BookingCreateResponse)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    # Validate ward exists
    ward = db.query(Ward).filter(Ward.id == payload.ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail=f"Ward {payload.ward_id} not found")

    # Generate OTP
    otp = generate_otp()

    # Create booking
    booking = Booking(
        id=str(uuid.uuid4()),
        citizen_name=payload.citizen_name,
        phone=payload.phone,
        ward_id=payload.ward_id,
        delivery_lat=payload.delivery_lat,
        delivery_lng=payload.delivery_lng,
        volume_liters=payload.volume_liters,
        status="PENDING",
        otp=otp,
    )
    db.add(booking)

    # Increment ward pending bookings
    ward.pending_bookings = (ward.pending_bookings or 0) + 1
    db.commit()

    return BookingCreateResponse(
        booking_id=booking.id,
        otp=otp,
        status="PENDING",
        message=f"Booking created. OTP: {otp}. Estimated wait: 4 hours.",
    )


@router.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return [
        {
            "id": b.id,
            "citizen_name": b.citizen_name,
            "phone": b.phone,
            "ward_id": b.ward_id,
            "delivery_lat": b.delivery_lat,
            "delivery_lng": b.delivery_lng,
            "volume_liters": b.volume_liters,
            "status": b.status,
            "otp": b.otp,
            "assigned_tanker_id": b.assigned_tanker_id,
            "ai_reasoning": b.ai_reasoning,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "delivered_at": b.delivered_at.isoformat() if b.delivered_at else None,
        }
        for b in bookings
    ]


@router.get("/bookings/{booking_id}")
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {
        "id": booking.id,
        "citizen_name": booking.citizen_name,
        "phone": booking.phone,
        "ward_id": booking.ward_id,
        "delivery_lat": booking.delivery_lat,
        "delivery_lng": booking.delivery_lng,
        "volume_liters": booking.volume_liters,
        "status": booking.status,
        "otp": booking.otp,
        "assigned_tanker_id": booking.assigned_tanker_id,
        "ai_reasoning": booking.ai_reasoning,
        "created_at": booking.created_at.isoformat() if booking.created_at else None,
        "delivered_at": booking.delivered_at.isoformat() if booking.delivered_at else None,
    }


@router.post("/confirm-delivery", response_model=ConfirmDeliveryResponse)
def confirm_delivery(payload: ConfirmDeliveryRequest, db: Session = Depends(get_db)):
    # Find booking
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Validate OTP
    if booking.otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Validate booking is in a deliverable state
    if booking.status not in ["ASSIGNED", "IN_TRANSIT"]:
        raise HTTPException(
            status_code=400,
            detail=f"Booking status is {booking.status}, cannot confirm delivery",
        )

    # Mark as delivered
    now = datetime.utcnow()
    booking.status = "DELIVERED"
    booking.delivered_at = now

    # Free up the tanker
    if booking.assigned_tanker_id:
        from models import Tanker
        tanker = db.query(Tanker).filter(Tanker.id == booking.assigned_tanker_id).first()
        if tanker:
            tanker.status = "AVAILABLE"

    # Decrement ward pending bookings
    ward = db.query(Ward).filter(Ward.id == booking.ward_id).first()
    if ward and ward.pending_bookings and ward.pending_bookings > 0:
        ward.pending_bookings -= 1

    # Create audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        action="DELIVERY_CONFIRMED",
        booking_id=booking.id,
        tanker_id=booking.assigned_tanker_id,
        ward_id=booking.ward_id,
        actor=booking.citizen_name,
        timestamp=now,
    )
    db.add(audit)
    db.commit()

    return ConfirmDeliveryResponse(
        booking_id=booking.id,
        status="DELIVERED",
        delivered_at=now,
        message="Delivery confirmed successfully.",
    )
