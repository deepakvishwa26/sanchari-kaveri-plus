# 🌊 Sanchari Kaveri Plus
> **HackArena 2.0 · Bangalore Zonals · June 13, 2026**  
> *"We didn't build a new app. We gave the government's existing app a brain."*

---

## 🧠 What Is This?

Sanchari Kaveri Plus is an **AI optimization layer** built on top of BWSSB's existing Sanchari Kaveri water tanker booking platform. It does not replace the government app — it reads its data, makes intelligent dispatch decisions using Google Gemini 2.0 Flash, and pushes results back in real time.

**The problem:** A family in Whitefield books a municipal water tanker. The app says confirmed. They wait 48 hours. The tanker never comes. They call a private operator — ₹3,200 for 12,000L vs the government rate of ₹1,290.

**Our solution:** Dynamic priority scoring, AI-powered dispatch, real-time GIS tracking, and demand forecasting — all without touching or rebuilding the existing system.

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Kaveri Citizen │     │  Kaveri Prime   │     │  Kaveri Link    │
│  (React/Vite)   │     │  (React/Vite)   │     │  (React/Vite)   │
│  Port: 5174     │     │  Port: 5173     │     │  Port: 5175     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │  REST API (JSON/HTTPS)
                        ┌────────▼────────┐
                        │  FastAPI Backend │
                        │  Port: 8000      │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼───┐   ┌──────────▼──────┐  ┌───────▼────────┐
     │ PostgreSQL  │   │  Gemini 2.0     │  │OpenRouteService│
     │  Database   │   │  Flash (AI)     │  │  (Routing)     │
     └────────────┘   └─────────────────┘  └────────────────┘
```

---

## 🎯 The Three Modules

| Module | Users | What It Does |
|--------|-------|--------------|
| **Kaveri Prime** | BWSSB officers, ward admins | Live GIS dashboard — Bangalore map with DWPI heatmap, fleet positions, AI dispatch |
| **Kaveri Citizen** | Residents, apartments, RWAs | Booking form, OTP confirmation, live status tracking, Surge Shield price comparison |
| **Kaveri Link** | Tanker drivers | AI-assigned route with turn-by-turn polyline from Connect Centre to delivery point |

---

## 🤖 Core AI — Dynamic Ward Priority Index (DWPI)

```
DWPI = 0.35 × (demand_ratio) + 0.25 × (lag_ratio) + 0.25 × (groundwater_stress) + 0.15 × (infra_flag)
```

| Weight | Factor | Why It Matters |
|--------|--------|----------------|
| 35% | Pending bookings vs tanker capacity | Direct demand pressure |
| 25% | Average delivery lag (hours) | How badly citizens are waiting |
| 25% | Groundwater depth vs 5-year baseline | Long-term scarcity risk |
| 15% | Critical infrastructure flag | Hospitals always get priority |

**Whitefield scores 0.89 (CRITICAL)** — 68m groundwater vs 40m baseline, 14 pending bookings, 42hr avg lag.

---

## 🗂️ Project Structure

```
sanchari-kaveri-plus/
├── backend/                  # FastAPI server
│   ├── main.py               # App entry point + CORS
│   ├── models.py             # SQLAlchemy ORM (Booking, Ward, Tanker, ConnectCentre)
│   ├── schemas.py            # Pydantic request/response models
│   ├── database.py           # PostgreSQL connection
│   ├── seed_data.py          # 6 wards + 3 tankers + 3 connect centres
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── bookings.py       # POST/GET /bookings, POST /confirm-delivery
│   │   ├── wards.py          # GET /wards, PATCH /wards/:id/emergency
│   │   ├── tankers.py        # GET /tankers, GET /tankers/:id/bookings
│   │   └── dispatch.py       # POST /dispatch, POST /demo/reset, GET /analytics/demand-pulse
│   └── services/
│       ├── dwpi.py           # DWPI formula
│       ├── gemini.py         # Gemini 2.0 Flash integration
│       ├── routing.py        # OpenRouteService client
│       └── otp.py            # OTP generation
│
├── frontend-prime/           # Kaveri Prime — Admin Dashboard (FE1)
├── frontend-citizen/         # Kaveri Citizen — Booking App (FE2)
└── frontend-driver/          # Kaveri Link — Driver App (FE3)
```

---

## ⚡ Running Locally (Judges — Start Here)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and fill in your keys (see .env.example)

# Create the database
psql -U postgres -c "CREATE DATABASE kaveri_db;"

# Create tables + seed data
python seed_data.py

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at: `http://localhost:8000`  
✅ Interactive API docs: `http://localhost:8000/docs`

### 2. Seed demo data

```bash
curl -X POST http://localhost:8000/demo/reset
# Returns: {"message":"Demo state restored","bookings_seeded":3}
```

### 3. Frontend — Kaveri Prime (Admin Dashboard)

```bash
cd frontend-prime
npm install
# Create .env with:  VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
✅ Runs at: `http://localhost:5173`

### 4. Frontend — Kaveri Citizen (Booking App)

```bash
cd frontend-citizen
npm install
# Create .env with:  VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
✅ Runs at: `http://localhost:5174`

### 5. Frontend — Kaveri Link (Driver App)

```bash
cd frontend-driver
npm install
# Create .env with:  VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
✅ Runs at: `http://localhost:5175`

---

## 🔑 Environment Variables

Create `backend/.env` using `.env.example` as template:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/kaveri_db
GEMINI_API_KEY=your_gemini_api_key        # aistudio.google.com → Get API Key (free)
ORS_API_KEY=your_openrouteservice_key     # openrouteservice.org → Dashboard → API Keys (free)
SECRET_KEY=kaveri_demo_secret_2025
DEMO_MODE=true
```

---

## 🎬 Demo Flow (4 Minutes)

| Step | Action | What to See |
|------|--------|-------------|
| 1 | Open Kaveri Citizen → submit booking (Whitefield, 12KL) | Booking ID + 6-digit OTP |
| 2 | Switch to Kaveri Prime → map refreshes | Red pin appears live in Whitefield zone |
| 3 | Click Dispatch on Prime dashboard | Gemini AI recommendation card appears |
| 4 | Switch to Kaveri Link (driver view) | Route polyline drawn from Connect Centre to delivery |
| 5 | Back to Citizen → enter OTP → confirm | Status: PENDING → ASSIGNED → DELIVERED |
| 6 | Prime dashboard → Surge Shield panel | ₹1,290 BWSSB vs ₹3,200 private = **₹1,910 saved** |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/wards` | All wards with DWPI scores |
| PATCH | `/wards/:id/emergency` | Toggle emergency mode |
| POST | `/bookings` | Create booking → returns OTP |
| GET | `/bookings` | List all bookings (filterable) |
| GET | `/bookings/:id` | Single booking with route + AI reasoning |
| POST | `/confirm-delivery` | OTP confirmation → status DELIVERED |
| POST | `/dispatch` | AI dispatch — runs DWPI + Gemini + ORS |
| GET | `/tankers` | All tankers (filterable by status) |
| GET | `/tankers/:id/bookings` | Driver's assigned bookings |
| POST | `/demo/reset` | Reset demo state — clears + re-seeds |
| GET | `/analytics/demand-pulse` | Hourly demand forecast data |

---

## 🧪 Quick API Test

```bash
# Health check
curl http://localhost:8000/health

# Get all wards
curl http://localhost:8000/wards

# Create a booking
curl -X POST http://localhost:8000/bookings \
  -H 'Content-Type: application/json' \
  -d '{"citizen_name":"Priya Sharma","phone":"9876543210","ward_id":"WARD_WHITEFIELD","delivery_lat":12.967,"delivery_lng":77.750,"volume_liters":12000}'

# Dispatch (replace BOOKING_ID with id from above)
curl -X POST http://localhost:8000/dispatch \
  -H 'Content-Type: application/json' \
  -d '{"booking_id":"BOOKING_ID"}'
```

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Database | PostgreSQL |
| AI | Google Gemini 2.0 Flash |
| Routing | OpenRouteService API |
| Frontend | React 18, Vite, Tailwind CSS |
| Maps | Leaflet.js, react-leaflet |
| Charts | Recharts |
| Deployment | Render (backend) + Vercel (frontends) |

---

## 👥 Team

| Role | Responsibility |
|------|---------------|
| **Dev 1 — Vishwa** | Backend lead — FastAPI, PostgreSQL, DWPI engine, Gemini integration, Render deployment |
| **Dev 2** | DB setup, Gemini service, ORS routing client, demo/reset endpoint |
| **FE 1** | Kaveri Prime — admin GIS dashboard, DWPI heatmap, AI dispatch panel |
| **FE 2** | Kaveri Citizen + Kaveri Link — booking flow, OTP confirm, driver route view |

---

## 💡 Impact Numbers

- **₹1,910 saved** per citizen booking vs peak private tanker rates
- **~₹6 crore saved per year** across BWSSB's 15,000 daily requests
- **Zero new hardware** — pure software layer on existing infrastructure
- **Works on any phone** — SMS fallback: `KP BOOK 12000 WARD_ID`

---

*Built for HackArena 2.0 · Bangalore Zonals · June 13, 2026*
