from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

# Auto-create all DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sanchari Kaveri Plus API",
    description="AI-powered water tanker dispatch system",
    version="1.0.0",
)

# CORS — allows React apps at 5173 and 5174 to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Sanchari Kaveri Plus"}


# ─────────────────────────────────────────────────────────────
# ROUTERS
# ─────────────────────────────────────────────────────────────
from routers import wards, bookings, dispatch, tankers, demo

app.include_router(wards.router, tags=["Wards"])
app.include_router(bookings.router, tags=["Bookings"])
app.include_router(dispatch.router, tags=["Dispatch"])
app.include_router(tankers.router, tags=["Tankers"])
app.include_router(demo.router, tags=["Demo"])
