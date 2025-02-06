import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  position: [number, number];
  zoom?: number;
}

const Map = ({ position, zoom = 13 }: MapProps) => {
  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Position de pointage
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map; 