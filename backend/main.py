from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional

from opencv import detector
from opencv import detector_zone2
from database import init_db, get_all_zones, add_zone, delete_zone, add_payment, get_payments, add_reservation, remove_reservation, get_active_reservations_count

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    init_db()
    # Startup: Start both background threads
    detector.start_background_thread()
    detector_zone2.start_background_thread_zone2()
    yield
    # Shutdown
    detector.stop_event.set()
    detector_zone2.stop_event_zone2.set()

app = FastAPI(lifespan=lifespan)

class PaymentRequest(BaseModel):
    id: str
    user: str
    amount: float
    zone: str
    timestamp: str
    status: str

class ReservationRequest(BaseModel):
    user: str
    zone_id: int


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Parking OS Backend Live"}

@app.get("/api/parking/live")
async def get_live_parking_data():
    """Compatibility endpoint for Zone 1"""
    data = detector.get_parking_data()
    return {
        "id": 1,
        "name": "Live Camera Feed Zone",
        "total_slots": data["total_slots"],
        "free_slots": data["free_slots"]-5,
        "status": data["status"],
        "timestamp": asyncio.get_event_loop().time()
    }

@app.get("/api/parking/zone2")
async def get_zone2_parking_data():
    data = detector_zone2.get_parking_data_zone2()
    return {
        "id": 2,
        "name": "Zone 2 - Parking Lot",
        "total_slots": data["total_slots"],
        "free_slots": data["free_slots"]-5,
        "status": data["status"],
        "timestamp": asyncio.get_event_loop().time()
    }

@app.get("/api/parking/all")
async def get_all_parking_data():
    """Get data from all zones with dynamic reservation sync"""
    db_zones = get_all_zones()
    zone1_live = detector.get_parking_data()
    zone2_live = detector_zone2.get_parking_data_zone2()
    
    zones = []
    for z in db_zones:
        zid = z["id"]
        res_count = get_active_reservations_count(zid)
        
        # Determine base total and free slots
        if zid == 1:
            total = zone1_live["total_slots"]
            free = zone1_live["free_slots"]
            status = zone1_live["status"]
        elif zid == 2:
            total = zone2_live["total_slots"]
            free = zone2_live["free_slots"]
            status = zone2_live["status"]
        else:
            # For other zones, use DB values
            total = z["total_slots"]
            free = total # Assume fully free initially for mock zones
            status = "available"

        # Apply backend reservations
        final_free = max(0, free - res_count)
        final_status = "full" if final_free <= 0 else ("filling" if final_free < 5 else status)

        zones.append({
            "id": zid,
            "name": z["name"],
            "lat": z["lat"],
            "lng": z["lng"],
            "total_slots": total,
            "free_slots": final_free,
            "status": final_status,
            "price": z["price"]
        })
    
    return {
        "zones": zones,
        "timestamp": asyncio.get_event_loop().time()
    }
@app.post("/api/payment")
async def create_payment(payment: PaymentRequest):
    add_payment(payment.id, payment.user, payment.amount, payment.zone, payment.timestamp, payment.status)
    return {"status": "recorded"}

@app.get("/api/payments")
async def get_all_payments():
    return get_payments()

@app.post("/api/parking/reserve")
async def reserve_parking(req: ReservationRequest):
    add_reservation(req.user, req.zone_id)
    return {"status": "reserved"}

@app.post("/api/parking/release")
async def release_parking(req: ReservationRequest):
    remove_reservation(req.user, req.zone_id)
    return {"status": "released"}
