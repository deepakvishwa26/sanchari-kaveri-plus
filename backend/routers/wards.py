from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Ward

router = APIRouter()


@router.get("/wards")
def get_wards(db: Session = Depends(get_db)):
    wards = db.query(Ward).all()
    return [
        {
            "ward_id": w.id,
            "name": w.name,
            "lat": w.lat,
            "lng": w.lng,
            "dwpi_score": w.dwpi_score,
            "pending_bookings": w.pending_bookings,
            "emergency_mode": w.emergency_mode,
            "critical_infra_flag": w.critical_infra_flag,
            "groundwater_depth": w.groundwater_depth,
            "groundwater_baseline": w.groundwater_baseline,
            "assigned_tanker_count": w.assigned_tanker_count,
        }
        for w in wards
    ]


@router.patch("/wards/{ward_id}/emergency")
def toggle_emergency(ward_id: str, db: Session = Depends(get_db)):
    ward = db.query(Ward).filter(Ward.id == ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")
    ward.emergency_mode = not ward.emergency_mode
    db.commit()
    return {
        "success": True,
        "ward_id": ward_id,
        "emergency_mode": ward.emergency_mode,
    }
