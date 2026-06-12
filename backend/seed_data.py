import sys, os, uuid
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal
from models import Base, Ward, Tanker, ConnectCentre, Booking, AuditLog
from datetime import datetime


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear all existing data
    db.query(AuditLog).delete()
    db.query(Booking).delete()
    db.query(Ward).delete()
    db.query(Tanker).delete()
    db.query(ConnectCentre).delete()
    db.commit()

    # Wards
    wards = [
        Ward(id="WARD_WHITEFIELD", name="Whitefield", lat=12.967, lng=77.750,
             groundwater_depth=68.0, groundwater_baseline=40.0,
             critical_infra_flag=False, assigned_tanker_count=2,
             pending_bookings=14, dwpi_score=0.89),
        Ward(id="WARD_MAHADEVAPURA", name="Mahadevapura", lat=12.994, lng=77.706,
             groundwater_depth=62.0, groundwater_baseline=40.0,
             critical_infra_flag=True, assigned_tanker_count=1,
             pending_bookings=11, dwpi_score=0.82),
        Ward(id="WARD_BELLANDUR", name="Bellandur", lat=12.927, lng=77.676,
             groundwater_depth=51.0, groundwater_baseline=40.0,
             critical_infra_flag=False, assigned_tanker_count=1,
             pending_bookings=8, dwpi_score=0.67),
        Ward(id="WARD_HSR", name="HSR Layout", lat=12.908, lng=77.640,
             groundwater_depth=44.0, groundwater_baseline=40.0,
             critical_infra_flag=False, assigned_tanker_count=2,
             pending_bookings=5, dwpi_score=0.51),
        Ward(id="WARD_KORAMANGALA", name="Koramangala", lat=12.934, lng=77.626,
             groundwater_depth=38.0, groundwater_baseline=40.0,
             critical_infra_flag=False, assigned_tanker_count=2,
             pending_bookings=2, dwpi_score=0.34),
        Ward(id="WARD_INDIRANAGAR", name="Indiranagar", lat=12.978, lng=77.640,
             groundwater_depth=32.0, groundwater_baseline=40.0,
             critical_infra_flag=False, assigned_tanker_count=3,
             pending_bookings=1, dwpi_score=0.22),
    ]
    for w in wards:
        db.add(w)

    # Tankers
    tankers = [
        Tanker(id="T-01", driver_name="Raju Kumar", phone="9845001122",
               lat=12.967, lng=77.750, status="AVAILABLE", trust_score=0.91),
        Tanker(id="T-02", driver_name="Suresh Babu", phone="9845003344",
               lat=12.934, lng=77.626, status="AVAILABLE", trust_score=0.85),
        Tanker(id="T-03", driver_name="Mohan Das", phone="9845005566",
               lat=12.978, lng=77.640, status="AVAILABLE", trust_score=0.72),
    ]
    for t in tankers:
        db.add(t)

    # Connect Centres
    centres = [
        ConnectCentre(id="CC-SARJAPUR", name="Sarjapur Connect Centre",
                      lat=12.892, lng=77.700, current_queue_length=3),
        ConnectCentre(id="CC-WHITEFIELD", name="Whitefield Connect Centre",
                      lat=12.985, lng=77.748, current_queue_length=7),
        ConnectCentre(id="CC-HSR", name="HSR Connect Centre",
                      lat=12.908, lng=77.630, current_queue_length=2),
    ]
    for c in centres:
        db.add(c)

    # 3 pre-loaded demo bookings (map is never empty on demo day)
    demo_bookings = [
        Booking(id=str(uuid.uuid4()), citizen_name="Priya Sharma",
                phone="9876543210", ward_id="WARD_WHITEFIELD",
                delivery_lat=12.967, delivery_lng=77.750,
                volume_liters=12000, status="PENDING", otp="112233"),
        Booking(id=str(uuid.uuid4()), citizen_name="Ravi Nair",
                phone="9876543211", ward_id="WARD_MAHADEVAPURA",
                delivery_lat=12.994, delivery_lng=77.706,
                volume_liters=6000, status="PENDING", otp="445566"),
        Booking(id=str(uuid.uuid4()), citizen_name="Kavitha Reddy",
                phone="9876543212", ward_id="WARD_BELLANDUR",
                delivery_lat=12.927, delivery_lng=77.676,
                volume_liters=12000, status="PENDING", otp="778899"),
    ]
    for b in demo_bookings:
        db.add(b)

    db.commit()
    db.close()
    print("Seed complete!")
    print(f"   {len(wards)} wards | {len(tankers)} tankers | {len(centres)} connect centres | {len(demo_bookings)} demo bookings")


if __name__ == "__main__":
    seed()
