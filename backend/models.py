import uuid
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Ward(Base):
    __tablename__ = "wards"
    id = Column(String(20), primary_key=True)
    name = Column(String(100))
    lat = Column(Float)
    lng = Column(Float)
    groundwater_depth = Column(Float, default=45.0)
    groundwater_baseline = Column(Float, default=40.0)
    critical_infra_flag = Column(Boolean, default=False)
    emergency_mode = Column(Boolean, default=False)
    assigned_tanker_count = Column(Integer, default=1)
    pending_bookings = Column(Integer, default=0)
    dwpi_score = Column(Float, default=0.0)


class Tanker(Base):
    __tablename__ = "tankers"
    id = Column(String(10), primary_key=True)
    driver_name = Column(String(100))
    phone = Column(String(15))
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String(20), default="AVAILABLE")
    trust_score = Column(Float, default=0.75)
    capacity_liters = Column(Integer, default=12000)
    assigned_connect_centre_id = Column(String(20), nullable=True)


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_name = Column(String(100))
    phone = Column(String(15))
    ward_id = Column(String(20), ForeignKey("wards.id"))
    delivery_lat = Column(Float)
    delivery_lng = Column(Float)
    volume_liters = Column(Integer, default=12000)
    status = Column(String(20), default="PENDING")
    otp = Column(String(6))
    assigned_tanker_id = Column(String(10), nullable=True)
    ai_reasoning = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)


class ConnectCentre(Base):
    __tablename__ = "connect_centres"
    id = Column(String(20), primary_key=True)
    name = Column(String(100))
    lat = Column(Float)
    lng = Column(Float)
    current_queue_length = Column(Integer, default=0)
    capacity_liters = Column(Integer, default=50000)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action = Column(String(100))
    booking_id = Column(String(36), nullable=True)
    tanker_id = Column(String(10), nullable=True)
    ward_id = Column(String(20), nullable=True)
    actor = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
