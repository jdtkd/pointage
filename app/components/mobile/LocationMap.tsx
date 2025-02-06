"use client";
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MapContainer as MapContainerType, Marker as MarkerType } from 'react-leaflet';

// Chargement dynamique de react-leaflet pour éviter les problèmes de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
) as typeof MapContainerType;

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
) as typeof MarkerType;

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  const mapRef = useRef<MapContainerType | null>(null);

  useEffect(() => {
    // Importer les styles CSS de Leaflet
    void import('leaflet/dist/leaflet.css');
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            Votre position actuelle
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 