import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Trash2, Plus, MapPin } from 'lucide-react';

const SpotManager = () => {
    const { spots, addSpot, deleteSpot, userLocation } = useParking();
    const [formData, setFormData] = useState({
        name: '',
        total: 20,
        price: 5,
        lat: '',
        lng: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use user location as base if not provided (mock "use my location")
        let lat = parseFloat(formData.lat);
        let lng = parseFloat(formData.lng);

        if (isNaN(lat) || isNaN(lng)) {
            if (userLocation) {
                lat = userLocation.lat + 0.001; // Offset slightly
                lng = userLocation.lng + 0.001;
            } else {
                alert("Please provide coordinates or enable location.");
                return;
            }
        }

        addSpot({
            name: formData.name,
            total: parseInt(formData.total),
            price: parseFloat(formData.price),
            lat,
            lng
        });
        setFormData({ name: '', total: 20, price: 5, lat: '', lng: '' });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* ADD FORM */}
            <Card>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> Add Infrastructure
                </h3>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Parking Zone Name"
                        placeholder="e.g. Westside Mall"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Total Capacity"
                            type="number"
                            value={formData.total}
                            onChange={e => setFormData({ ...formData, total: e.target.value })}
                            required
                        />
                        <Input
                            label="Hourly Rate ($)"
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                        * Coordinates will default near your location if left blank.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Latitude"
                            placeholder="e.g. 51.5074"
                            value={formData.lat}
                            onChange={e => setFormData({ ...formData, lat: e.target.value })}
                        />
                        <Input
                            label="Longitude"
                            placeholder="e.g. -0.1278"
                            value={formData.lng}
                            onChange={e => setFormData({ ...formData, lng: e.target.value })}
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        Use <strong>Standard Decimal Degrees</strong>. For example, New York is 40.7128, -74.0060.
                    </p>
                    <Button type="submit" style={{ width: '100%' }}>Create Zone</Button>
                </form>
            </Card>

            {/* LIST */}
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Managed Zones ({spots.length})</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {spots.map(spot => (
                        <Card key={spot.id} noPadding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    background: spot.status === 'full' ? '#fff5f5' : '#f0fff4',
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    color: spot.status === 'full' ? '#e53e3e' : '#38a169'
                                }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{spot.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        {spot.free} / {spot.total} slots available • ${spot.price}/hr
                                    </div>
                                </div>
                            </div>
                            {spot.id !== 1 && (
                                <Button variant="danger" onClick={() => deleteSpot(spot.id)} style={{ padding: '0.5rem' }}>
                                    <Trash2 size={16} />
                                </Button>
                            )}
                            {spot.id === 1 && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Live Camera Feed</span>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpotManager;
