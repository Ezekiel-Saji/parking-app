import React, { useMemo } from 'react';
import Card from '../components/Card';
import { useParking } from '../context/ParkingContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Map as MapIcon, Activity } from 'lucide-react';

const COLORS = ['#e53e3e', '#38a169'];

const CityDashboard = () => {
    const { spots } = useParking();

    // Calculate System Metrics
    const metrics = useMemo(() => {
        const totalSlots = spots.reduce((acc, spot) => acc + spot.total, 0);
        const freeSlots = spots.reduce((acc, spot) => acc + spot.free, 0);
        const occupiedSlots = totalSlots - freeSlots;
        const utilization = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

        return { totalSlots, freeSlots, occupiedSlots, utilization };
    }, [spots]);

    // Format Data for Bar Chart (Zone Occupancy)
    const zoneData = useMemo(() => {
        return spots.map(spot => {
            const occupied = spot.total - spot.free;
            const percent = spot.total > 0 ? Math.round((occupied / spot.total) * 100) : 0;

            return {
                name: (spot.name || 'Zone').split(' ').slice(0, 2).join(' '),
                occupied: percent,
                count: occupied,
                full_name: spot.name
            };
        });
    }, [spots]);

    // Format Data for Pie Chart
    const pieData = [
        { name: 'Occupied', value: metrics.occupiedSlots },
        { name: 'Available', value: metrics.freeSlots },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>City Overview</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Public Real-time parking availability</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* <a href="/admin" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Admin Login</a> */}
                    <Link to="/map" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>← Back to Map</Link>
                </div>
            </header>

            <div className="animate-fade-in">
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '50%', color: '#3182ce' }}>
                                <MapIcon size={24} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Available Slots</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.freeSlots}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Slots</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.totalSlots}</div>
                                </div>
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
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics.utilization}%</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#fff5f5', borderRadius: '50%', color: '#e53e3e' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Active Zones</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{spots.length}</div>
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
                                <BarChart data={zoneData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Occupied Slots', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        formatter={(value, name, props) => [`${value} Slots`, props.payload.full_name]}
                                    />
                                    <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Occupied" />
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
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
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
        </div>
    );
};

export default CityDashboard;
