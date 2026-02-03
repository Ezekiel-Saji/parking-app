# Parking OS - Real-Time Smart Parking Management

Parking OS is a comprehensive, AI-powered parking management system designed to optimize parking space utilization using computer vision and interactive mapping. It provides real-time occupancy data, reservation systems, and an intuitive dashboard for both users and administrators.

---

## 🚀 Key Features

- **AI-Powered Occupancy Detection**: Leverages OpenCV to monitor parking slots in real-time via video feeds.
- **Interactive Multi-Zone Map**: Integrated with Leaflet for visual navigation across different parking zones.
- **Real-Time Synchronization**: Live updates between the backend detection engine and the frontend dashboard using Vite and FastAPI.
- **Reservation & Payment System**: Secure slot reservation with integrated payment tracking.
- **Zone-Based Management**: Support for multiple zones (e.g., Zone 1, Zone 2, Premium Zone 3) with dynamic pricing and status.
- **Responsive Admin Dashboard**: Advanced monitoring and management tools for parking administrators.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS with modern aesthetics
- **Interactive Maps**: Leaflet & React-Leaflet
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts

### Backend
- **Core API**: FastAPI (Python)
- **Computer Vision**: OpenCV, CVZone, NumPy
- **Database**: SQLite (SQLAlchemy/Custom Logic)
- **Concurrency**: Python Threading for real-time background detection

---

## 📊 Analysis: Pros & Cons

### Pros
- ✅ **Dynamic Scalability**: The system can easily add new zones by simply adding video feeds or mock data entries.
- ✅ **Low Latency**: The implementation of background threads for OpenCV ensures that detection doesn't block the API responses.
- ✅ **Modern UI/UX**: High-quality design with glassmorphism, smooth transitions, and intuitive navigation.
- ✅ **End-to-End Solution**: Covers everything from physical slot detection to user payment and reservation.

### Cons
- ❌ **Hardware Dependency**: OpenCV detection performance depends heavily on the server's CPU/GPU and camera quality.
- ❌ **Lighting/Weather Sensitivity**: Standard OpenCV thresholding might require tuning for night-time or rainy conditions.
- ❌ **Client-Side Polling**: Current implementation relies on polling for "live" updates; implementing WebSockets would be more efficient for many-user scenarios.

---

## 💡 Technical Feasibility

The project is **highly feasible** for local and small-to-medium enterprise (SME) deployments. 

1. **Detection Accuracy**: The current "pixel-counting" approach (via `cv2.countNonZero`) is robust for fixed-camera setups but may need upgrading to YOLO or other deep learning models for dynamic environments.
2. **Infrastructure**: Can run on a Raspberry Pi or a mid-range laptop for a single-zone setup.
3. **Integration**: The modular structure of `backend/main.py` and `ParkingContext.jsx` allows for easy integration with third-party payment gateways or IoT sensors.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- OpenCV dependencies

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the root folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🗺️ Project Structure

```text
├── backend/            # FastAPI Server, OpenCV Detection, Database
│   ├── opencv/         # Image processing scripts & video feeds
│   └── parking.db      # SQLite storage
├── src/                # React Frontend
│   ├── components/     # Reusable UI elements
│   ├── context/        # Global state management (Auth, Parking)
│   └── pages/          # Full-page views (Home, Login, Admin)
└── public/             # Static assets
```

---

*Developed as a modern solution for urban parking challenges.*
