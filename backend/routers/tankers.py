from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Tanker, Booking

router = APIRouter()


@router.get("/tankers")
def get_tankers(db: Session = Depends(get_db)):
    tankers = db.query(Tanker).all()
    return [
        {
            "id": t.id,
            "driver_name": t.driver_name,
            "phone": t.phone,
            "lat": t.lat,
            "lng": t.lng,
            "status": t.status,
            "trust_score": t.trust_score,
            "capacity_liters": t.capacity_liters,
            "assigned_connect_centre_id": t.assigned_connect_centre_id,
        }
        for t in tankers
    ]


@router.get("/tankers/{tanker_id}/bookings")
def get_tanker_bookings(tanker_id: str, db: Session = Depends(get_db)):
    bookings = (
        db.query(Booking)
        .filter(Booking.assigned_tanker_id == tanker_id)
        .filter(Booking.status.in_(["ASSIGNED", "IN_TRANSIT"]))
        .all()
    )
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
            "ai_reasoning": b.ai_reasoning,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in bookings
    ]
