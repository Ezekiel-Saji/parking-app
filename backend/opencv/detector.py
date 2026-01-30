import cv2
import pickle
import cvzone
import numpy as np
import os
import threading
import time

# Global State
current_parking_status = {
    "total_slots": 0,
    "free_slots": 0,
    "status": "unknown"
}

stop_event = threading.Event()

def get_parking_data():
    return current_parking_status

def checkParkingSpace(img, imgPro, posList, width, height):
    spaceCounter = 0

    for pos in posList:
        x, y = pos

        imgCrop = imgPro[y:y + height, x:x + width]
        # count non-zero pixels (white pixels)
        count = cv2.countNonZero(imgCrop)

        if count < 900:
            color = (0, 255, 0)
            thickness = 5
            spaceCounter += 1
        else:
            color = (0, 0, 255)
            thickness = 2
        
        # Draw rectangles (optional if not showing GUI)
        # cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), color, thickness)
    
    return spaceCounter

def run_parking_detection():
    global current_parking_status
    
    # Paths relative to this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    video_path = os.path.join(base_dir, 'carPark.mp4')
    pickle_path = os.path.join(base_dir, 'CarParkPos')
    
    # Check if files exist
    if not os.path.exists(pickle_path):
        print(f"Error: Pickle file not found at {pickle_path}")
        return

    width, height = 107, 48

    with open(pickle_path, 'rb') as f:
        posList = pickle.load(f)

    cap = cv2.VideoCapture(video_path)
    
    print("Starting Parking Detection Loop...")

    while not stop_event.is_set():
        if cap.get(cv2.CAP_PROP_POS_FRAMES) == cap.get(cv2.CAP_PROP_FRAME_COUNT):
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        
        success, img = cap.read()
        if not success:
            break
            
        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
        imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                             cv2.THRESH_BINARY_INV, 25, 16)
        imgMedian = cv2.medianBlur(imgThreshold, 5)
        kernel = np.ones((3, 3), np.uint8)
        imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

        free_slots = checkParkingSpace(img, imgDilate, posList, width, height)
        total_slots = len(posList)
        
        # Update Global State
        current_parking_status["total_slots"] = total_slots
        current_parking_status["free_slots"] = free_slots
        
        if free_slots == 0:
            current_parking_status["status"] = "full"
        elif free_slots < 5:
            current_parking_status["status"] = "filling"
        else:
            current_parking_status["status"] = "available"

        # Limit frame rate to save CPU
        time.sleep(0.03) 
        
    cap.release()
    print("Parking Detection Stopped.")

def start_background_thread():
    t = threading.Thread(target=run_parking_detection, daemon=True)
    t.start()
