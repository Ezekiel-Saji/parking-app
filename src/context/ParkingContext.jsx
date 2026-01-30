import React, { createContext, useContext, useState, useEffect } from 'react';

const ParkingContext = createContext();

export const useParking = () => useContext(ParkingContext);

const MOCK_SPOTS = [
    { id: 1, name: 'City Center Garage', lat: 0, lng: 0, status: 'available', total: 50, free: 12, price: 5 },
    { id: 2, name: 'Market Square', lat: 0.002, lng: 0.002, status: 'filling', total: 30, free: 5, price: 8 },
    { id: 3, name: 'Tech Park Zone A', lat: -0.002, lng: 0.001, status: 'full', total: 100, free: 0, price: 4 },
    { id: 4, name: 'Riverside Walk', lat: 0.001, lng: -0.003, status: 'available', total: 20, free: 15, price: 6 },
];

export const ParkingProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [spots, setSpots] = useState(MOCK_SPOTS); // Initialize with mock data immediately
    const [destination, setDestination] = useState(null);
    const [route, setRoute] = useState(null);
    const [flowState, setFlowState] = useState('IDLE'); // IDLE, SEARCHING, RECOMMENDED, LOCKED, NAVIGATING, PARKED
    const [recommendedSpot, setRecommendedSpot] = useState(null);

    // Update simulated spots relative to user location when available
    useEffect(() => {
        if (userLocation) {
            setSpots(currentSpots => currentSpots.map(spot => {
                // Find reference in MOCK_SPOTS for relative offsets
                const reference = MOCK_SPOTS.find(m => m.id === spot.id);
                if (!reference) return spot; // Keep manually added spots as they are

                let latOffset = reference.lat;
                let lngOffset = reference.lng;

                // Handle the default MOCK_SPOTS offsets relative to origin
                if (spot.id === 1 && latOffset === 0) {
                    latOffset = 0.045; // ~5km
                    lngOffset = 0.045;
                }

                return {
                    ...spot,
                    lat: userLocation.lat + latOffset,
                    lng: userLocation.lng + lngOffset,
                };
            }));
        }
    }, [userLocation]);

    // Live data polling moved to Dashboard as per user request

    const requestParking = async (destCoords) => {
        setFlowState('SEARCHING');
        setDestination(destCoords);

        // Simulate AI Processing
        setTimeout(() => {
            // Simple logic: Find closest available spot
            // In real app, this would use OSRM distance matrix
            const available = spots.filter(s => s.status !== 'full');
            if (available.length > 0) {
                // Pick random "best" for demo
                const best = available[0];
                setRecommendedSpot(best);
                setFlowState('RECOMMENDED');
            } else {
                alert('No spots available!');
                setFlowState('IDLE');
            }
        }, 2000);
    };

    const lockSpot = () => {
        setFlowState('LOCKED');
        // Start countdown logic in UI
    };

    const startNavigation = () => {
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
            deleteSpot
        }}>
            {children}
        </ParkingContext.Provider>
    );
};
