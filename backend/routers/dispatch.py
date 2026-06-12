from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Booking, Ward, Tanker
from schemas import DispatchRequest, DispatchResponse
from services.dwpi import calculate_dwpi, classify_dwpi
from services.gemini import get_dispatch_recommendation
from services.routing import get_route_between_points
import asyncio

router = APIRouter()


@router.post("/dispatch", response_model=DispatchResponse)
async def dispatch_tanker(payload: DispatchRequest, db: Session = Depends(get_db)):
    # 1. Find the booking
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail=f"Booking status is {booking.status}, expected PENDING",
        )

    # 2. Get the ward
    ward = db.query(Ward).filter(Ward.id == booking.ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    # 3. Calculate DWPI
    dwpi_score = calculate_dwpi(
        groundwater_depth=ward.groundwater_depth,
        groundwater_baseline=ward.groundwater_baseline,
        pending_bookings=ward.pending_bookings or 0,
        assigned_tanker_count=ward.assigned_tanker_count or 1,
        emergency_mode=ward.emergency_mode or False,
        critical_infra_flag=ward.critical_infra_flag or False,
    )
    dwpi_class = classify_dwpi(dwpi_score)

    # Update ward DWPI score
    ward.dwpi_score = dwpi_score

    # 4. Find available tankers
    available_tankers = (
        db.query(Tanker).filter(Tanker.status == "AVAILABLE").all()
    )
    if not available_tankers:
        raise HTTPException(status_code=400, detail="No tankers available")

    # 5. Get Gemini AI recommendation
    ai_reasoning = get_dispatch_recommendation(
        ward_name=ward.name,
        dwpi_score=dwpi_score,
        pending_count=ward.pending_bookings or 0,
        tankers=available_tankers,
    )

    # 6. Choose best tanker — highest trust score
    best_tanker = max(available_tankers, key=lambda t: t.trust_score)

    # 7. Get route from tanker to delivery point
    route_data = await get_route_between_points(
        origin_lat=best_tanker.lat,
        origin_lng=best_tanker.lng,
        dest_lat=booking.delivery_lat,
        dest_lng=booking.delivery_lng,
    )

    # 8. Update booking
    booking.status = "ASSIGNED"
    booking.assigned_tanker_id = best_tanker.id
    booking.ai_reasoning = ai_reasoning

    # 9. Update tanker status
    best_tanker.status = "EN_ROUTE"

    db.commit()

    return DispatchResponse(
        booking_id=booking.id,
        assigned_tanker_id=best_tanker.id,
        dwpi_score=dwpi_score,
        dwpi_class=dwpi_class,
        ai_reasoning=ai_reasoning,
        route_geojson=route_data,
        status="ASSIGNED",
        message=f"Tanker {best_tanker.id} ({best_tanker.driver_name}) dispatched to {ward.name}.",
    )
