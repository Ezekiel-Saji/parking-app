import React, { createContext, useContext, useState, useEffect } from 'react';

const ParkingContext = createContext();

export const useParking = () => useContext(ParkingContext);

const MOCK_SPOTS = [
    { id: 1, name: 'Zone 1', lat: 0.015, lng: 0.015, status: 'available', total: 50, free: 12, price: 5 }, // ~2km
    { id: 2, name: 'Zone 2', lat: -0.045, lng: -0.045, status: 'filling', total: 30, free: 5, price: 8 }, // ~5km
    { id: 3, name: 'Tech Park Zone A', lat: 0.080, lng: 0.020, status: 'full', total: 100, free: 0, price: 4 }, // ~10km
    { id: 4, name: 'Riverside Walk', lat: -0.020, lng: 0.070, status: 'available', total: 20, free: 15, price: 6 }, // ~8km
    { id: 5, name: 'Central Hospital P1', lat: 0.120, lng: -0.030, status: 'available', total: 40, free: 32, price: 3 }, // ~14km
    { id: 6, name: 'Retail Hub Parking', lat: -0.090, lng: -0.010, status: 'filling', total: 60, free: 10, price: 7 }, // ~10km
    { id: 7, name: 'Green Plaza', lat: 0.040, lng: -0.100, status: 'available', total: 25, free: 18, price: 4 }, // ~12km
    { id: 8, name: 'Station Side', lat: -0.060, lng: 0.090, status: 'full', total: 15, free: 0, price: 9 }, // ~12km
];

export const ParkingProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [spots, setSpots] = useState(MOCK_SPOTS); // Initialize with mock data immediately
    const [destination, setDestination] = useState(null);
    const [route, setRoute] = useState(null);
    const [flowState, setFlowState] = useState('IDLE'); // IDLE, SEARCHING, RECOMMENDED, LOCKED, NAVIGATING, PARKED
    const [recommendedSpot, setRecommendedSpot] = useState(null);
    const [hasPaid, setHasPaid] = useState(false); // New state for premium access

    // Update simulated spots relative to user location when available
    useEffect(() => {
        if (userLocation) {
            setSpots(currentSpots => currentSpots.map(spot => {
                // Find reference in MOCK_SPOTS for relative offsets
                const reference = MOCK_SPOTS.find(m => m.id === spot.id);
                if (!reference) return spot; // Keep manually added spots as they are

                let latOffset = reference.lat;
                let lngOffset = reference.lng;

                // Move Zone 3 to a random distance visible on map (approx 300m - 800m)
                if (spot.id === 3) {
                    // Random offset between 0.003 and 0.008
                    const randomLat = 0.003 + Math.random() * 0.005;
                    const randomLng = 0.003 + Math.random() * 0.005;
                    // Randomize direction
                    latOffset = Math.random() > 0.5 ? randomLat : -randomLat;
                    lngOffset = Math.random() > 0.5 ? randomLng : -randomLng;
                }

                return {
                    ...spot,
                    lat: userLocation.lat + latOffset,
                    lng: userLocation.lng + lngOffset,
                };
            }));
        }
    }, [userLocation]);

    // Live data polling restored and updated for multiple zones
    useEffect(() => {
        if (spots.length === 0) return;

        const fetchAllZones = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/parking/all');
                if (response.ok) {
                    const data = await response.json();

                    setSpots(currentSpots => {
                        return currentSpots.map(spot => {
                            const zoneUpdate = data.zones.find(z => z.id === spot.id);
                            if (zoneUpdate) {
                                return {
                                    ...spot,
                                    free: zoneUpdate.free_slots,
                                    total: zoneUpdate.total_slots,
                                    status: zoneUpdate.status
                                };
                            }
                            return spot;
                        });
                    });
                }
            } catch (error) {
                console.warn("Global multizone polling failed.");
            }
        };

        const interval = setInterval(fetchAllZones, 2000);
        fetchAllZones();

        return () => clearInterval(interval);
    }, [spots.length]);

    const requestParking = async (destCoords, forcedSpotId = null) => {
        // Immediate Payment Check for Premium Zone (ID 3)
        if (forcedSpotId === 3 && !hasPaid) {
            const paymentId = prompt("Restricted Access: Enter Payment ID for Premium Zone ($4)");
            if (paymentId === "payment@123") {
                setHasPaid(true);
                alert("Payment Successful! Access Granted.");
            } else {
                alert("Payment Required to access this Premium Zone.");
                return; // Abort request
            }
        }

        setFlowState('SEARCHING');
        setDestination(destCoords);
        setRoute(null); // Clear old route

        // Simulate AI Processing
        setTimeout(() => {
            if (forcedSpotId) {
                const manualSpot = spots.find(s => s.id === forcedSpotId);
                if (manualSpot) {
                    setRecommendedSpot(manualSpot);
                    setFlowState('RECOMMENDED');
                    return;
                }
            }

            // AI Logic: Find nearest available spot to the SEARCHED destination
            const available = spots.filter(s => s.status !== 'full');

            if (available.length > 0) {
                // Calculate distances to the searched destination
                const closest = available.reduce((prev, curr) => {
                    const distPrev = Math.sqrt(
                        Math.pow(prev.lat - destCoords.lat, 2) +
                        Math.pow(prev.lng - destCoords.lng, 2)
                    );
                    const distCurr = Math.sqrt(
                        Math.pow(curr.lat - destCoords.lat, 2) +
                        Math.pow(curr.lng - destCoords.lng, 2)
                    );
                    return distPrev < distCurr ? prev : curr;
                });

                setRecommendedSpot(closest);
                setFlowState('RECOMMENDED');
            } else {
                alert('No spots available near your destination!');
                setFlowState('IDLE');
            }
        }, 1500);
    };

    const lockSpot = () => {
        setFlowState('LOCKED');
        // Start countdown logic in UI
    };

    const startNavigation = () => {
        // Double-check safeguard (though likely already paid via requestParking)
        if (recommendedSpot && recommendedSpot.id === 3 && !hasPaid) {
            const paymentId = prompt("Restricted Access: Enter Payment ID for Premium Zone ($4)");
            if (paymentId === "payment@123") {
                setHasPaid(true);
                alert("Payment Successful! Navigation Unlocked.");
            } else {
                alert("Payment Required to navigate to this Premium Zone.");
                setRoute(null);
                return;
            }
        }
        setFlowState('NAVIGATING');
    };

    const completeParking = () => {
        setFlowState('PARKED');
        if (recommendedSpot) {
            setSpots(prev => prev.map(s => s.id === recommendedSpot.id ? { ...s, free: Math.max(0, s.free - 1), status: s.free - 1 === 0 ? 'full' : s.status } : s));
        }
    };

    const resetFlow = () => {
        setFlowState('IDLE');
        setRecommendedSpot(null);
        setDestination(null);
        setRoute(null);
        setHasPaid(false); // Reset payment status for new requests
    };

    const addSpot = (spotData) => {
        const newSpot = {
            id: spots.length + Math.floor(Math.random() * 1000), // Simple ID generation
            status: 'available',
            free: spotData.total,
            ...spotData
        };
        setSpots(prev => [...prev, newSpot]);
    };

    const deleteSpot = (id) => {
        // Prevent deleting the Live Camera spot (ID 1)
        if (id === 1) {
            alert("Cannot delete the active Live Camera Zone.");
            return;
        }
        setSpots(prev => prev.filter(s => s.id !== id));
    };

    return (
        <ParkingContext.Provider value={{
            userLocation, setUserLocation,
            spots,
            destination,
            route, setRoute,
            flowState,
            recommendedSpot,
            requestParking,
            lockSpot,
            startNavigation,
            completeParking,
            resetFlow,
            addSpot,
            deleteSpot,
            hasPaid, setHasPaid
        }}>
            {children}
        </ParkingContext.Provider>
    );
};
