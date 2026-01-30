# Running the Parking OS Backend with OpenCV
This backend integrates your OpenCV logic (`opencv/detector.py`) with a FastAPI server.

1.  **Navigate to the backend folder**:
    ```powershell
    cd backend
    ```
2.  **Install Python Dependencies**:
    ```powershell
    python -m pip install -r requirements.txt
    ```
3.  **Start the Server**:
    The server will automatically start the OpenCV video processing thread.
    ```powershell
    uvicorn main:app --reload
    ```
    *Note: You might see opencv logs in the terminal.*

4.  **Verify**:
    -   **API**: Open `http://localhost:8000/api/parking/live` to see the JSON data.
    -   **Frontend**: The map should update the "City Center Garage" marker based on the video feed.
