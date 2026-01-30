from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager

# Import the new detector module
from opencv import detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the background thread
    detector.start_background_thread()
    yield
    # Shutdown: could clean up here if needed
    detector.stop_event.set()

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

@app.get("/api/parking/live")
async def get_live_parking_data():
    """
    Returns the real-time slot availability from the OpenCV subsystem.
    """
    data = detector.get_parking_data()
    
    return {
        "id": 1,
        "name": "Live Camera Feed Zone",
        "total_slots": data["total_slots"],
        "free_slots": data["free_slots"]-5,
        "status": data["status"],
        "timestamp": asyncio.get_event_loop().time()
    }
