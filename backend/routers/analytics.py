from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Booking

router = APIRouter()


@router.get("/analytics/demand-pulse")
def demand_pulse(db: Session = Depends(get_db)):
    """
    Returns hourly booking demand per ward.
    Hardcoded realistic data for demo (SARIMA in production).
    """
    return {
        "labels": ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
        "datasets": [
            {
                "ward": "Whitefield",
                "data": [2, 5, 9, 12, 8, 14, 11, 6],
                "color": "#E63946",
            },
            {
                "ward": "Mahadevapura",
                "data": [1, 4, 7, 10, 6, 11, 9, 4],
                "color": "#F4A261",
            },
            {
                "ward": "HSR Layout",
                "data": [1, 2, 4, 6, 5, 7, 5, 3],
                "color": "#2DC653",
            },
        ],
        "peak_predicted": "2:00 PM - 4:00 PM",
        "recommendation": (
            "Pre-stage 3 tankers at Whitefield Connect Centre by 1:30 PM"
        ),
    }


@router.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    total = db.query(Booking).count()
    pending = db.query(Booking).filter(Booking.status == "PENDING").count()
    delivered = db.query(Booking).filter(Booking.status == "DELIVERED").count()
    return {
        "total_bookings": total,
        "pending": pending,
        "delivered": delivered,
        "in_transit": total - pending - delivered,
    }
