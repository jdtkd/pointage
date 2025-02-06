"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Chargement dynamique de maplibre-gl pour éviter les problèmes de SSR
const MapLibre = dynamic(() => import('maplibre-gl'), {
  ssr: false, // Désactive le rendu côté serveur pour ce composant
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !MapLibre || mapLoaded) return;

    const initializeMap = async () => {
      // Importer les styles CSS de manière dynamique
      await import('maplibre-gl/dist/maplibre-gl.css');

      const mapInstance = new MapLibre.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [longitude, latitude],
        zoom: 15
      });

      mapInstance.on('load', () => {
        // Ajouter un marqueur
        new MapLibre.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapInstance);
        
        setMapLoaded(true);
      });

      map.current = mapInstance;
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, MapLibre, mapLoaded]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-[200px] rounded-lg overflow-hidden"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
} 