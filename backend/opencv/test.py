"""
Quick Test - Zone 2 Detection
==============================
A simple script to quickly check if Zone 2 is working.
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def quick_test():
    print("\n" + "="*60)
    print("QUICK ZONE 2 TEST")
    print("="*60 + "\n")
    
    # Test 1: Server
    print("1. Testing server connection...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=3)
        print(f"   ✓ Server is running: {response.json()}\n")
    except:
        print("   ✗ ERROR: Server is not running!")
        print("   Run: uvicorn main:app --reload\n")
        return
    
    # Test 2: Zone 1
    print("2. Testing Zone 1...")
    try:
        response = requests.get(f"{BASE_URL}/api/parking/zone1", timeout=3)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Zone 1 Active: {data['free_slots']}/{data['total_slots']} free\n")
        else:
            print(f"   ✗ Zone 1 failed: {response.status_code}\n")
    except Exception as e:
        print(f"   ✗ Zone 1 error: {e}\n")
    
    # Test 3: Zone 2
    print("3. Testing Zone 2...")
    try:
        response = requests.get(f"{BASE_URL}/api/parking/zone2", timeout=3)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Zone 2 Active: {data['free_slots']}/{data['total_slots']} free")
            print(f"   ✓ Status: {data['status']}\n")
            
            # Quick live test
            print("4. Live update test (5 seconds)...")
            readings = []
            for i in range(5):
                resp = requests.get(f"{BASE_URL}/api/parking/zone2", timeout=3)
                if resp.status_code == 200:
                    d = resp.json()
                    readings.append(d['free_slots'])
                    print(f"   [{i+1}] Free slots: {d['free_slots']}")
                    time.sleep(1)
            
            unique_values = len(set(readings))
            if unique_values > 1:
                print(f"\n   ✓ Zone 2 is LIVE and updating! ({unique_values} different values)")
            else:
                print(f"\n   ⚠ Zone 2 is static (not changing). Check video processing.")
            
        else:
            print(f"   ✗ Zone 2 endpoint not found!")
            print("   Make sure:")
            print("     - detector_zone2.py exists")
            print("     - main.py has zone2 endpoints")
            print("     - Server was restarted after changes\n")
            return
    except Exception as e:
        print(f"   ✗ Zone 2 error: {e}\n")
        return
    
    # Test 4: Compare zones
    print("\n5. Comparing both zones...")
    try:
        z1 = requests.get(f"{BASE_URL}/api/parking/zone1").json()
        z2 = requests.get(f"{BASE_URL}/api/parking/zone2").json()
        
        print(f"   Zone 1: Total={z1['total_slots']}, Free={z1['free_slots']}")
        print(f"   Zone 2: Total={z2['total_slots']}, Free={z2['free_slots']}")
        
        if z1['total_slots'] == z2['total_slots'] and z1['free_slots'] == z2['free_slots']:
            print("\n   ⚠ WARNING: Both zones have identical data!")
            print("   This suggests they might be using the same video/config.")
        else:
            print("\n   ✓ Zones have different data (Good!)")
    except:
        pass
    
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60 + "\n")

if __name__ == "__main__":
    quick_test()