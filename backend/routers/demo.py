import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Booking, AuditLog, Tanker

router = APIRouter()

SEED_BOOKINGS = [
    {
        "citizen_name": "Priya Sharma",
        "phone": "9876543210",
        "ward_id": "WARD_WHITEFIELD",
        "delivery_lat": 12.967,
        "delivery_lng": 77.750,
        "volume_liters": 12000,
        "status": "PENDING",
        "otp": "112233",
    },
    {
        "citizen_name": "Ravi Nair",
        "phone": "9876543211",
        "ward_id": "WARD_MAHADEVAPURA",
        "delivery_lat": 12.994,
        "delivery_lng": 77.706,
        "volume_liters": 6000,
        "status": "PENDING",
        "otp": "445566",
    },
    {
        "citizen_name": "Kavitha Reddy",
        "phone": "9876543212",
        "ward_id": "WARD_BELLANDUR",
        "delivery_lat": 12.927,
        "delivery_lng": 77.676,
        "volume_liters": 12000,
        "status": "PENDING",
        "otp": "778899",
    },
]


@router.post("/demo/reset")
def demo_reset(db: Session = Depends(get_db)):
    """Run before each judge presentation to restore clean state."""
    db.query(AuditLog).delete()
    db.query(Booking).delete()
    db.query(Tanker).update({"status": "AVAILABLE", "assigned_connect_centre_id": None})

    for b_data in SEED_BOOKINGS:
        b = Booking(id=str(uuid.uuid4()), **b_data)
        db.add(b)

    db.commit()
    return {
        "message": "Demo state restored",
        "bookings_cleared": True,
        "demo_bookings_added": len(SEED_BOOKINGS),
    }
