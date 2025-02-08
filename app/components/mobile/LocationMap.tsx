"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapContainerProps } from 'react-leaflet';
import type { LeafletEvent } from 'leaflet';
import ClientOnly from '../ClientOnly';

// Chargement dynamique de react-leaflet pour éviter les problèmes de SSR
const MapContainerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const MarkerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const PopupDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

interface MapReadyEvent extends LeafletEvent {
  target: LeafletMap;
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapReady = () => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  };

  if (!isClient) {
    return (
      <div className="relative h-[300px] w-full rounded-lg overflow-hidden bg-base-200 animate-pulse flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
        <MapContainerDynamic
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          whenReady={handleMapReady}
        >
          <TileLayerDynamic
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerDynamic position={[latitude, longitude]}>
            <PopupDynamic>
              Votre position actuelle
            </PopupDynamic>
          </MarkerDynamic>
        </MapContainerDynamic>
      </div>
    </ClientOnly>
  );
} 