import React from 'react';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Users, Map as MapIcon, Activity } from 'lucide-react';

const MOCK_ZONE_DATA = [
    { name: 'City Center', occupied: 80, available: 20 },
    { name: 'Market Sq', occupied: 45, available: 55 },
    { name: 'Tech Park', occupied: 90, available: 10 },
    { name: 'Riverside', occupied: 30, available: 70 },
];

const PIE_DATA = [
    { name: 'Occupied', value: 245 },
    { name: 'Available', value: 155 },
];
const COLORS = ['#e53e3e', '#38a169'];

const AdminDashboard = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>City Command Center</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Real-time parking infrastructure monitoring</p>
                </div>
                <a href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>← Back to Live Map</a>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '50%', color: '#3182ce' }}>
                            <MapIcon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Slots</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>400</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '50%', color: '#38a169' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Utilization</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>61%</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '50%', color: '#e53e3e' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Avg Wait</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2m 30s</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <Card>
                    <h3 style={{ marginBottom: '1rem' }}>Zone Occupancy Levels</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_ZONE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="occupied" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Occupied (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 style={{ marginBottom: '1rem' }}>System-wide Availability</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PIE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {PIE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
