"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import ClientOnly from './ClientOnly';

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

const Map = ({ lat, lng, zoom = 13 }: MapProps) => {
  const position: [number, number] = [lat, lng];

  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <ClientOnly>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Position du pointage
          </Popup>
        </Marker>
      </MapContainer>
    </ClientOnly>
  );
};

export default Map; 