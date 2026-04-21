import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Layers, Navigation, LocateFixed, Search, Satellite, Mountain, Trees } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { RWANDA_PARKS } from '@/src/constants';

interface MapContainerProps {
  onLocationSelect?: (coords: [number, number]) => void;
  focusedLocation?: [number, number] | null;
}

const mapboxToken = (import.meta as any).env.VITE_MAPBOX_TOKEN;

export default function MapContainer({ onLocationSelect, focusedLocation }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(29.8739);
  const [lat, setLat] = useState(-1.9403);
  const [zoom, setZoom] = useState(8);
  const [style, setStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const isValidToken = (token: string | undefined): boolean => {
    return !!token && token.startsWith('pk.') && token.length > 20 && !token.includes('Mapbox.com');
  };

  useEffect(() => {
    if (isMapLoaded && map.current) {
      // Simulate live animal movements
      const animals = [
        { id: '1', name: 'Gorilla-Alpha', center: RWANDA_PARKS.VOLCANOES.center },
        { id: '2', name: 'Elephant-Echo', center: RWANDA_PARKS.AKAGERA.center },
        { id: '3', name: 'Chimp-Charlie', center: RWANDA_PARKS.NYUNGWE.center },
      ];

      animals.forEach(animal => {
        const el = document.createElement('div');
        el.className = 'w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(animal.center)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${animal.name}</b><br/>Status: Monitoring`))
          .addTo(map.current!);
        
        markers.current[animal.id] = marker;
      });

      const interval = setInterval(() => {
        animals.forEach(animal => {
          const marker = markers.current[animal.id];
          if (marker) {
            const current = marker.getLngLat();
            marker.setLngLat([
              current.lng + (Math.random() - 0.5) * 0.002,
              current.lat + (Math.random() - 0.5) * 0.002
            ]);
          }
        });
      }, 3000);

      return () => {
        clearInterval(interval);
        Object.values(markers.current).forEach(m => (m as mapboxgl.Marker).remove());
      };
    }
  }, [isMapLoaded]);

  useEffect(() => {
    if (!mapContainer.current || !isValidToken(mapboxToken)) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (e.error?.message?.includes('Forbidden') || e.error?.status === 403) {
          setMapError('Invalid Mapbox Token. Access Denied.');
        } else {
          setMapError(e.error?.message || 'An error occurred loading the map.');
        }
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
        // Add terrain if applicable
        if (map.current) {
          map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        }
      });

      map.current.on('move', () => {
        if (map.current) {
          setLng(Number(map.current.getCenter().lng.toFixed(4)));
          setLat(Number(map.current.getCenter().lat.toFixed(4)));
          setZoom(Number(map.current.getZoom().toFixed(2)));
        }
      });
    } catch (err: any) {
      console.error('Failed to initialize map:', err);
      setMapError(err.message || 'Map initialization failed.');
    }

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (map.current && focusedLocation && isMapLoaded) {
      map.current.flyTo({
        center: focusedLocation,
        zoom: 14,
        speed: 1.5,
        curve: 1.42,
        essential: true
      });
    }
  }, [focusedLocation, isMapLoaded]);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      map.current.setStyle(style);
    }
  }, [style, isMapLoaded]);

  const flyToPark = (park: keyof typeof RWANDA_PARKS) => {
    if (map.current) {
      map.current.flyTo({
        center: RWANDA_PARKS[park].center,
        zoom: 12,
        essential: true
      });
    }
  };

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords;
      map.current?.flyTo({
        center: [longitude, latitude],
        zoom: 14
      });
    });
  };

  if (!isValidToken(mapboxToken) || mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-slate-400 p-8 text-center">
        <MapIcon className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-semibold text-slate-200">
          {mapError ? 'Tracking System Error' : 'Mapbox Token Required'}
        </h3>
        <p className="mt-2 text-sm max-w-md">
          {mapError 
            ? `Error details: ${mapError}. Please verify your access token in the secrets panel.`
            : "Please provide a valid Mapbox public token (starting with 'pk.') in your environment secrets to enable the interactive 3D tracking system."
          }
        </p>
        {!mapError && (
          <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-xs font-mono text-left w-full max-w-sm">
            VITE_MAPBOX_TOKEN=pk.eyJ1Ijo...
          </div>
        )}
        {mapError && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel p-1 rounded-xl flex flex-col gap-1">
          <button 
            onClick={() => setStyle('mapbox://styles/mapbox/satellite-v9')}
            className={cn("p-2 rounded-lg transition-colors", style.includes('satellite') ? "bg-emerald-500 text-white" : "hover:bg-slate-800")}
            title="Satellite"
          >
            <Satellite className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setStyle('mapbox://styles/mapbox/dark-v11')}
            className={cn("p-2 rounded-lg transition-colors", style.includes('dark') ? "bg-emerald-500 text-white" : "hover:bg-slate-800")}
            title="Dark"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-panel p-1 rounded-xl flex flex-col gap-1">
          <button onClick={handleLocate} className="p-2 rounded-lg hover:bg-slate-800 transition-colors" title="My Location">
            <LocateFixed className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Park Shortcuts */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-4 px-6 py-3 glass-panel rounded-full overflow-x-auto max-w-[90vw] hide-scrollbar">
        {Object.entries(RWANDA_PARKS).map(([key, park]) => (
          <button
            key={key}
            onClick={() => flyToPark(key as keyof typeof RWANDA_PARKS)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-800 whitespace-nowrap transition-colors border border-transparent hover:border-slate-700"
          >
            {key === 'VOLCANOES' && <Mountain className="w-4 h-4 text-orange-400" />}
            {key === 'AKAGERA' && <Trees className="w-4 h-4 text-yellow-400" />}
            {key === 'NYUNGWE' && <Trees className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-medium">{park.name.replace(' National Park', '')}</span>
          </button>
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 z-10 glass-panel p-4 rounded-2xl min-w-[200px]">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-semibold">Active Monitoring</div>
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-xs text-slate-500">Live Tracked Species</div>
            <div className="text-2xl font-bold text-emerald-400">24</div>
          </div>
          <div className="h-px bg-slate-800" />
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] text-slate-500">LAT</div>
              <div className="text-sm font-mono">{lat.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">LNG</div>
              <div className="text-sm font-mono">{lng.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">ZM</div>
              <div className="text-sm font-mono">{zoom.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
