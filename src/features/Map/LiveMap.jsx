import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useParking } from '../../context/ParkingContext';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createIcon = (color) => new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
    background-color: ${color};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">P</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

// User Location Icon
const userIcon = new L.DivIcon({
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const LocationUpdater = ({ setCentered }) => {
    const { setUserLocation } = useParking();
    const map = useMap();
    const [listening, setListening] = useState(false);

    useEffect(() => {
        if (!listening) {
            map.locate({ setView: true, maxZoom: 16, watch: true });

            map.on("locationfound", function (e) {
                setUserLocation(e.latlng);
                setCentered(true);
            });

            map.on("locationerror", function (e) {
                console.error("Location access denied or failed.", e);
            });

            setListening(true);
        }
    }, [map, setUserLocation, listening, setCentered]);

    return null;
};

const RecenterButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'absolute',
                bottom: '210px', // Above the BookingOverlay
                right: '10px',
                zIndex: 400,
                background: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                cursor: 'pointer'
            }}
            title="Recenter on me"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2L12 5" />
                <path d="M12 19L12 22" />
                <path d="M2 12L5 12" />
                <path d="M19 12L22 12" />
            </svg>
        </button>
    );
};

const RouteLayer = () => {
    const { route } = useParking();
    if (!route || !route.geometry) return null;

    // OSRM returns geojson.coordinates as [lng, lat], Leaflet needs [lat, lng]
    const positions = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

    return <Polyline positions={positions} color="var(--color-primary)" weight={5} opacity={0.7} />;
};

const LiveMap = () => {
    const { spots, userLocation, destination, recommendedSpot, requestParking, flowState } = useParking();
    const [isCentered, setIsCentered] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    // Dynamically determining center
    const center = userLocation || [51.505, -0.09]; // Default fallback

    const handleRecenter = () => {
        if (mapInstance && userLocation) {
            mapInstance.flyTo(userLocation, 16);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative', zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <LocationUpdater setCentered={setIsCentered} />
                <RouteLayer />

                {/* Explicit Recenter Button */}
                <RecenterButton onClick={handleRecenter} />

                {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {destination && (flowState === 'SEARCHING' || flowState === 'RECOMMENDED') && (
                    <Marker position={[destination.lat, destination.lng]} icon={createIcon('var(--color-primary)')}>
                        <Popup>
                            <strong>Target Destination</strong><br />
                            Finding nearby parking...
                        </Popup>
                    </Marker>
                )}

                {spots.map(spot => {
                    let color = 'var(--color-success)';
                    if (spot.status === 'filling') color = 'var(--color-warning)';
                    if (spot.status === 'full') color = 'var(--color-danger)';
                    if (recommendedSpot && recommendedSpot.id === spot.id) color = 'var(--color-info)';

                    return (
                        <Marker
                            key={spot.id}
                            position={[spot.lat, spot.lng]}
                            icon={createIcon(color)}
                        >
                            <Popup>
                                <strong>{spot.name}</strong><br />
                                Slots: {spot.free}/{spot.total}<br />
                                Status: {spot.status.toUpperCase()}<br />
                                <button
                                    style={{
                                        marginTop: '5px',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                    onClick={() => {
                                        if (mapInstance) mapInstance.closePopup();
                                        requestParking({ lat: spot.lat, lng: spot.lng }, spot.id);
                                    }}
                                >
                                    Navigate Here
                                </button>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LiveMap;
