from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager

from opencv import detector
from opencv import detector_zone2  # Import zone 2 detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start both background threads
    detector.start_background_thread()
    detector_zone2.start_background_thread_zone2()
    yield
    # Shutdown
    detector.stop_event.set()
    detector_zone2.stop_event_zone2.set()

app = FastAPI(lifespan=lifespan)

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

@app.get("/api/parking/zone1")
async def get_zone1_parking_data():
    data = detector.get_parking_data()
    return {
        "id": 1,
        "name": "Zone 1 - City Center Garage",
        "total_slots": data["total_slots"],
        "free_slots": data["free_slots"],
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
        "free_slots": data["free_slots"],
        "status": data["status"],
        "timestamp": asyncio.get_event_loop().time()
    }

@app.get("/api/parking/all")
async def get_all_parking_data():
    """Get data from all zones"""
    zone1 = detector.get_parking_data()
    zone2 = detector_zone2.get_parking_data_zone2()
    
    return {
        "zones": [
            {
                "id": 1,
                "name": "Zone 1 - City Center Garage",
                "total_slots": zone1["total_slots"],
                "free_slots": zone1["free_slots"],
                "status": zone1["status"]
            },
            {
                "id": 2,
                "name": "Zone 2 - Parking Lot",
                "total_slots": zone2["total_slots"],
                "free_slots": zone2["free_slots"],
                "status": zone2["status"]
            }
        ],
        "timestamp": asyncio.get_event_loop().time()
    }