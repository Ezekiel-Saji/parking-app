import React from 'react';
import SpotManager from '../features/Dashboard/SpotManager';
import { Database, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
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
                    <a href="/dashboard" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '600' }}>View Public Dashboard</a>
                    <a href="/map" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>← Back to Map</a>
                </div>
            </header>

            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#ebf8ff', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                <strong>Administrator Access:</strong> You have full control to add or remove parking zones. Changes reflect immediately on the live map.
            </div>

            <SpotManager />

        </div>
    );
};

export default AdminDashboard;
