from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Booking Schemas ───

class BookingCreate(BaseModel):
    citizen_name: str
    phone: str
    ward_id: str
    volume_liters: int = 12000
    delivery_lat: float
    delivery_lng: float


class BookingResponse(BaseModel):
    id: str
    citizen_name: str
    phone: str
    ward_id: str
    delivery_lat: float
    delivery_lng: float
    volume_liters: int
    status: str
    otp: str
    assigned_tanker_id: Optional[str] = None
    ai_reasoning: Optional[str] = None
    created_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BookingCreateResponse(BaseModel):
    booking_id: str
    otp: str
    status: str
    message: str


# ─── Dispatch Schemas ───

class DispatchRequest(BaseModel):
    booking_id: str


class DispatchResponse(BaseModel):
    booking_id: str
    assigned_tanker_id: str
    dwpi_score: float
    dwpi_class: str
    ai_reasoning: str
    route_geojson: Optional[dict] = None
    status: str
    message: str


# ─── Confirm Delivery Schemas ───

class ConfirmDeliveryRequest(BaseModel):
    booking_id: str
    otp: str


class ConfirmDeliveryResponse(BaseModel):
    booking_id: str
    status: str
    delivered_at: Optional[datetime] = None
    message: str


# ─── Ward Schemas ───

class WardResponse(BaseModel):
    ward_id: str
    name: str
    lat: float
    lng: float
    dwpi_score: float
    pending_bookings: int
    emergency_mode: bool
    critical_infra_flag: bool
    groundwater_depth: float
    groundwater_baseline: float
    assigned_tanker_count: int

    class Config:
        from_attributes = True


# ─── Tanker Schemas ───

class TankerResponse(BaseModel):
    id: str
    driver_name: str
    phone: str
    lat: float
    lng: float
    status: str
    trust_score: float
    capacity_liters: int
    assigned_connect_centre_id: Optional[str] = None

    class Config:
        from_attributes = True
