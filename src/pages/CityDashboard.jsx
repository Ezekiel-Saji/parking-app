import React, { useMemo } from 'react';
import Card from '../components/Card';
import { useParking } from '../context/ParkingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Map as MapIcon, Activity } from 'lucide-react';

const COLORS = ['#e53e3e', '#38a169'];

const CityDashboard = () => {
    const { spots } = useParking();
    const [liveData, setLiveData] = React.useState({ free_slots: 0, total_slots: 0 });

    // Poll Backend for Live Data specifically for Dashboard
    React.useEffect(() => {
        const fetchLive = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/parking/live');
                if (response.ok) {
                    const data = await response.json();
                    setLiveData(data);
                }
            } catch (error) {
                console.warn("Dashboard backend poll failed.");
            }
        };

        const interval = setInterval(fetchLive, 2000);
        fetchLive();
        return () => clearInterval(interval);
    }, []);

    // Calculate System Metrics
    const metrics = useMemo(() => {
        // As per user request: Use backend values for available/total slots display
        const totalSlots = liveData.total_slots;
        const freeSlots = liveData.free_slots;
        const occupiedSlots = totalSlots - freeSlots;
        const utilization = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

        return { totalSlots, freeSlots, occupiedSlots, utilization };
    }, [liveData]);

    // Format Data for Bar Chart (Zone Occupancy)
    const zoneData = useMemo(() => {
        return spots.map(spot => {
            // If it's the live zone (ID 1), use the latest live data
            if (spot.id === 1) {
                return {
                    name: "Live Feed",
                    occupied: liveData.total_slots > 0 ? Math.round(((liveData.total_slots - liveData.free_slots) / liveData.total_slots) * 100) : 0,
                    full_name: spot.name
                };
            }
            return {
                name: spot.name.split(' ').slice(0, 2).join(' '), // Shorten name
                occupied: spot.total > 0 ? Math.round(((spot.total - spot.free) / spot.total) * 100) : 0,
                full_name: spot.name
            };
        });
    }, [spots, liveData]);

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
                    <a href="/map" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>← Back to Map</a>
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
                                    <YAxis label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        formatter={(value, name, props) => [`${value}% Occupied`, props.payload.full_name]}
                                    />
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
