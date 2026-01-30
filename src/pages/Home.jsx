import React from 'react';
import LiveMap from '../features/Map/LiveMap';
import BookingOverlay from '../features/Booking/BookingOverlay';

const Home = () => {
    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <LiveMap />
            <BookingOverlay />

            {/* Header / Brand Overlay */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 1000,
                background: 'var(--color-bg-overlay)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                backdropFilter: 'blur(5px)'
            }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>Smart</span>Park OS
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    AI-Driven Urban Mobility
                </p>
            </div>

            {/* Link to Admin */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1000
            }}>
                <a href="/admin" style={{
                    textDecoration: 'none',
                    background: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    City Dashboard
                </a>
            </div>
        </div>
    );
};

export default Home;
