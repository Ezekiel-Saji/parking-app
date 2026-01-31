import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import SpotManager from '../features/Dashboard/SpotManager';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { ShieldCheck, CreditCard, Map } from 'lucide-react';

const AdminDashboard = () => {
    const { payments } = useParking();
    const [activeTab, setActiveTab] = useState('spots');

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={32} color="var(--color-primary)" />
                        Admin Console
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage Parking Infrastructure & Zones</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/dashboard" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '600' }}>View Public Dashboard</Link>
                    <Link to="/map" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>← Back to Map</Link>
                </div>
            </header>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-secondary)' }}>
                <button
                    onClick={() => setActiveTab('spots')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'spots' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        fontWeight: activeTab === 'spots' ? 'bold' : 'normal',
                        color: activeTab === 'spots' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Map size={18} />
                    Zone Management
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'payments' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        fontWeight: activeTab === 'payments' ? 'bold' : 'normal',
                        color: activeTab === 'payments' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <CreditCard size={18} />
                    Payment Details
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'spots' ? (
                <>
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#ebf8ff', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                        <strong>Administrator Access:</strong> You have full control to add or remove parking zones. Changes reflect immediately on the live map.
                    </div>
                    <SpotManager />
                </>
            ) : (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Recent Transactions</h3>
                        <Badge variant="success">Total Revenue: ${payments.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</Badge>
                    </div>

                    <Card noPadding style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-secondary)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Transaction ID</th>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>User</th>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Zone</th>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Amount</th>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Time</th>
                                    <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No payments recorded yet.</td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} style={{ borderBottom: '1px solid var(--color-secondary)' }}>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{payment.id}</td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{payment.user}</td>
                                            <td style={{ padding: '1rem' }}>{payment.zone}</td>
                                            <td style={{ padding: '1rem' }}>${payment.amount.toFixed(2)}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                                {new Date(payment.timestamp).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <Badge variant="success">Completed</Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
