import React, { useState, useEffect } from 'react';
import { useParking } from '../../context/ParkingContext';
import { fetchRoute, searchLocation } from '../../lib/osrm';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { Navigation, Clock, MapPin, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookingOverlay = () => {
    const {
        flowState,
        requestParking,
        recommendedSpot,
        userLocation,
        destination, // Destructure destination
        setRoute,
        lockSpot,
        startNavigation,
        completeParking,
        resetFlow,
        vacateSpot
    } = useParking();

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    // Handle Search
    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        const results = await searchLocation(query);
        if (results.length > 0) {
            // Take the first result
            const dest = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
            requestParking(dest);
        }
        setLoading(false);
    };

    // Fetch Route when Destination or Recommended Slot is found
    useEffect(() => {
        if (!userLocation) return;

        const getRoute = async (target) => {
            const r = await fetchRoute(
                { lat: userLocation.lat, lng: userLocation.lng },
                { lat: target.lat, lng: target.lng }
            );
            if (r) {
                setRoute(r);
                setRouteInfo({
                    distance: (r.distance / 1000).toFixed(1) + ' km',
                    duration: (r.duration / 60).toFixed(0) + ' min'
                });
            }
        };

        if (flowState === 'SEARCHING' && destination) {
            getRoute(destination);
        } else if (flowState === 'RECOMMENDED' && recommendedSpot) {
            getRoute(recommendedSpot);
        }
    }, [flowState, recommendedSpot, destination, userLocation, setRoute]);

    // Clear route info on reset
    useEffect(() => {
        if (flowState === 'IDLE') {
            setRouteInfo(null);
        }
    }, [flowState]);

    // Timer logic
    useEffect(() => {
        let timer;
        if (flowState === 'LOCKED' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0) {
            resetFlow(); // Expired
            alert("Reservation Expired");
        }
        return () => clearInterval(timer);
    }, [flowState, timeLeft, resetFlow]);


    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', right: '1rem', zIndex: 1000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: '100%', maxWidth: '400px', pointerEvents: 'auto' }}>
                <AnimatePresence mode='wait'>

                    {/* IDLE STATE */}
                    {flowState === 'IDLE' && (
                        <motion.div key="idle" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card>
                                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Search size={20} color="var(--color-primary)" />
                                    Find Smart Parking
                                </h2>
                                <Input
                                    placeholder="Where are you going?"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Button onClick={handleSearch} disabled={loading} style={{ width: '100%' }}>
                                    {loading ? 'Analyzing Traffic...' : 'Request Parking'}
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* SEARCHING */}
                    {flowState === 'SEARCHING' && (
                        <motion.div key="searching" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card style={{ textAlign: 'center' }}>
                                <div className="spinner" style={{ marginBottom: '1rem' }}>Suggesting optimal spot...</div>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Analyzing real-time availability and traffic congestion.</p>
                            </Card>
                        </motion.div>
                    )}

                    {/* RECOMMENDED */}
                    {flowState === 'RECOMMENDED' && recommendedSpot && (
                        <motion.div key="recommended" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <Badge variant="info">AI RECOMMENDED</Badge>
                                        <h3 style={{ marginTop: '0.5rem' }}>{recommendedSpot.name}</h3>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>92%</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Confidence</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ background: 'var(--color-bg-app)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Distance</div>
                                        <strong>{routeInfo?.distance || '...'}</strong>
                                    </div>
                                    <div style={{ background: 'var(--color-bg-app)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>ETA</div>
                                        <strong>{routeInfo?.duration || '...'}</strong>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                    Selected to minimize walking distance and avoid congestion on Main St.
                                </p>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button variant="secondary" onClick={resetFlow} style={{ flex: 1 }}>Cancel</Button>
                                    <Button onClick={lockSpot} style={{ flex: 1 }}>Lock & Navigate</Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* LOCKED */}
                    {flowState === 'LOCKED' && (
                        <motion.div key="locked" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card>
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--color-warning)' }}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Slot Reserved</p>
                                </div>
                                <Button onClick={startNavigation} style={{ width: '100%' }}>
                                    <Navigation size={18} style={{ marginRight: '0.5rem' }} />
                                    Start Navigation
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* NAVIGATING */}
                    {flowState === 'NAVIGATING' && (
                        <motion.div key="navigating" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ background: 'var(--color-info)', padding: '0.75rem', borderRadius: '50%', color: 'white' }}>
                                        <Navigation size={24} />
                                    </div>
                                    <div>
                                        <h3>Navigating...</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Follow the route on the map</p>
                                    </div>
                                </div>
                                <Button onClick={completeParking} variant="success" style={{ width: '100%' }}>
                                    I've Parked
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* PARKED */}
                    {flowState === 'PARKED' && (
                        <motion.div key="parked" variants={variants} initial="hidden" animate="visible" exit="exit">
                            <Card style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>
                                    <CheckCircle size={48} />
                                </div>
                                <h3>Parking Confirmed!</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>The slot is now marked as occupied.</p>
                                <Button onClick={() => { vacateSpot(); setQuery(''); }} variant="outline">
                                    Return Home
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingOverlay;
