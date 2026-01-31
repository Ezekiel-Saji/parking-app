import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useNavigate, Link } from 'react-router-dom';
import LiveMap from '../features/Map/LiveMap';
import BookingOverlay from '../features/Booking/BookingOverlay';
import PaymentModal from '../components/PaymentModal';

const Home = () => {
    const { user, logout } = useAuth();
    const { isPaymentModalOpen, cancelPayment, completePayment } = useParking();
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <LiveMap />
            <BookingOverlay />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={cancelPayment}
                onSuccess={completePayment}
            />

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

            {/* Links / Auth Status */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1000,
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                {!user ? (
                    <button onClick={() => navigate('/login')} style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        Login
                    </button>
                ) : (
                    <>
                        {user.role === 'customer' && (
                            <Link to="/dashboard" style={{
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
                            </Link>
                        )}

                        {user.role === 'admin' && (
                            <>
                                {/* <a href="/dashboard" style={{
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
                                </a> */}
                                <Link to="/admin" style={{
                                    textDecoration: 'none',
                                    background: 'var(--color-text-primary)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    Admin Console
                                </Link>
                            </>
                        )}

                        <button onClick={logout} style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            color: 'var(--color-danger)',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
