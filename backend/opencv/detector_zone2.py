# backend/opencv/detector_zone2.py
import cv2
import pickle
import cvzone
import numpy as np
import os
import threading
import time

# Global State for Zone 2
current_parking_status_zone2 = {
    "total_slots": 0,
    "free_slots": 0,
    "status": "unknown"
}

stop_event_zone2 = threading.Event()

def get_parking_data_zone2():
    return current_parking_status_zone2

def checkParkingSpace(img, imgPro, posList, width, height):
    spaceCounter = 0
    for pos in posList:
        x, y = pos
        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)
        if count < 900:
            spaceCounter += 1
    return spaceCounter

def run_parking_detection_zone2():
    global current_parking_status_zone2
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    video_path = os.path.join(base_dir, 'carPark_zone2.mp4')  # Your second video
    pickle_path = os.path.join(base_dir, 'CarParkPos_zone2')  # Separate parking positions
    
    if not os.path.exists(pickle_path):
        print(f"Error: Pickle file not found at {pickle_path}")
        return

    width, height = 107, 48

    with open(pickle_path, 'rb') as f:
        posList = pickle.load(f)

    cap = cv2.VideoCapture(video_path)
    print("Starting Zone 2 Parking Detection Loop...")

    while not stop_event_zone2.is_set():
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
        
        current_parking_status_zone2["total_slots"] = total_slots
        current_parking_status_zone2["free_slots"] = free_slots
        
        if free_slots == 0:
            current_parking_status_zone2["status"] = "full"
        elif free_slots < 5:
            current_parking_status_zone2["status"] = "filling"
        else:
            current_parking_status_zone2["status"] = "available"

        time.sleep(0.03) 
        
    cap.release()
    print("Zone 2 Parking Detection Stopped.")

def start_background_thread_zone2():
    t = threading.Thread(target=run_parking_detection_zone2, daemon=True)
    t.start()