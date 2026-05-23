import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Compass as CompassIcon, Radio, MapPin, Eye, Satellite, ServerCrash } from "lucide-react";
import { MuxStation, UserLocation } from "../types";

// Check for Google Maps Platform key in environment
const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidGoogleKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== "YOUR_API_KEY" && GOOGLE_MAPS_KEY.trim() !== "";

interface MapAreaProps {
  userLocation: UserLocation;
  stations: MuxStation[];
  selectedStation: MuxStation | null;
  onSelectStation: (station: MuxStation) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isMapModeGoogle: boolean;
  setIsMapModeGoogle: (mode: boolean) => void;
}

export default function MapArea({
  userLocation,
  stations,
  selectedStation,
  onSelectStation,
  onMapClick,
  isMapModeGoogle,
  setIsMapModeGoogle
}: MapAreaProps) {
  const [radarPulse, setRadarPulse] = useState(0);

  // Animate the radar sweep line
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarPulse((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Helper: coordinate mapping for SVG grid based on user location as 0,0 center
  // Scale so that up to 60km fits comfortably inside a 160px radius circle
  const getRelativePosition = (stationLat: number, stationLng: number) => {
    const latDiff = stationLat - userLocation.lat;
    const lngDiff = stationLng - userLocation.lng;
    
    // Scale factor: 1 degree latitude = ~111km.
    // Let's map 1 KM to 2.8 pixels.
    // Earth latitude conversion
    const dy = latDiff * 111 * 3.8; // vertical pixels
    const dx = lngDiff * 111 * Math.cos(userLocation.lat * Math.PI / 180) * 3.8; // horizontal pixels
    
    // Cap to keep within radius
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 140; // max SVG boundary
    
    if (dist > maxRadius) {
      const angle = Math.atan2(dy, dx);
      return {
        cx: 160 + Math.cos(angle) * maxRadius,
        cy: 160 - Math.sin(angle) * maxRadius,
        isOutOfRange: true,
        actualDx: dx,
        actualDy: dy
      };
    }

    return {
      cx: 160 + dx,
      // Map SVG vertical: y grows down, but latitude grows UP
      cy: 160 - dy,
      isOutOfRange: false,
      actualDx: dx,
      actualDy: dy
    };
  };

  return (
    <div className="flex flex-col bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-blue-900/10 shadow-lg relative overflow-hidden">
      {/* Tab Switcher: Google Map Vs Cyber MUX Radar */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-xs font-mono font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
          <Satellite className="w-4 h-4 text-indigo-900" /> Plotting Pemancar
        </span>
        
        {hasValidGoogleKey && (
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setIsMapModeGoogle(false)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider transition-all duration-150 ${
                !isMapModeGoogle
                  ? "bg-slate-900 text-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Cyber Radar
            </button>
            <button
              onClick={() => setIsMapModeGoogle(true)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider transition-all duration-150 ${
                isMapModeGoogle
                  ? "bg-slate-900 text-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Google Map
            </button>
          </div>
        )}
      </div>

      {hasValidGoogleKey && isMapModeGoogle ? (
        /* GOOGLE MAP MODE */
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
          <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
              defaultZoom={11}
              mapId="DVB_TV_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              style={{ width: "100%", height: "100%" }}
            >
              {/* User Location Marker */}
              <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }}>
                <Pin background="#E11D48" glyphColor="#fff" scale={1.1} />
              </AdvancedMarker>

              {/* Transmitter Towers */}
              {stations.map((st) => (
                <AdvancedMarker
                  key={st.id}
                  position={{ lat: st.lat, lng: st.lng }}
                  onClick={() => onSelectStation(st)}
                >
                  <div className={`transition-transform duration-150 hover:scale-110 flex flex-col items-center ${selectedStation?.id === st.id ? "scale-110 z-20" : "scale-100 opacity-80"}`}>
                    <div className={`p-1.5 rounded-full border-2 ${selectedStation?.id === st.id ? "bg-blue-900 text-white border-cyan-400 shadow-lg shadow-blue-500/50 animate-pulse" : "bg-white text-indigo-900 border-indigo-900"} h-8 w-8 flex items-center justify-center`}>
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-900/90 text-[9px] font-mono text-zinc-100 font-bold px-1 py-0.5 rounded-md mt-0.5 whitespace-nowrap shadow uppercase border border-slate-700">
                      Ch.{st.channelFreq}
                    </div>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>
      ) : (
        /* CYBER MUX RADAR SCANNER */
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-[325px] h-[320px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
            {/* Embedded Radar Sweep lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
              {/* Concentric Grid Circles */}
              <circle cx="160" cy="160" r="140" stroke="#1e293b" strokeWidth="0.8" fill="none" />
              <circle cx="160" cy="160" r="105" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" fill="none" />
              <circle cx="160" cy="160" r="70" stroke="#1e293b" strokeWidth="0.8" fill="none" />
              <circle cx="160" cy="160" r="35" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" fill="none" />
              
              {/* Crosshairs axis details */}
              <line x1="20" y1="160" x2="300" y2="160" stroke="#1e293b" strokeWidth="0.8" />
              <line x1="160" y1="20" x2="160" y2="300" stroke="#1e293b" strokeWidth="0.8" />
              
              {/* Angle scale indicators */}
              <text x="160" y="15" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">0° N</text>
              <text x="312" y="163" fill="#475569" fontSize="7" fontFamily="monospace">90° E</text>
              <text x="160" y="315" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">180° S</text>
              <text x="2" y="163" fill="#475569" fontSize="7" fontFamily="monospace">270° W</text>
              
              {/* Distance scale text */}
              <text x="164" y="240" fill="#334155" fontSize="7" fontFamily="monospace">20 KM</text>
              <text x="164" y="275" fill="#334155" fontSize="7" fontFamily="monospace">40 KM</text>
              
              {/* Spinning Radar line wave */}
              <line 
                x1="160" 
                y1="160" 
                x2={160 + 140 * Math.cos(radarPulse * Math.PI / 180)} 
                y2={160 - 140 * Math.sin(radarPulse * Math.PI / 180)} 
                stroke="#38bdf8" 
                strokeWidth="1.2" 
                opacity="0.32"
              />
              
              {/* Sweep gradient arc simulation */}
              <path 
                d={`M 160 160 L ${160 + 140 * Math.cos(radarPulse * Math.PI / 180)} ${160 - 140 * Math.sin(radarPulse * Math.PI / 180)} A 140 140 0 0 1 ${160 + 140 * Math.cos((radarPulse - 25) * Math.PI / 180)} ${160 - 140 * Math.sin((radarPulse - 25) * Math.PI / 180)} Z`} 
                fill="url(#radarGradient)" 
                opacity="0.12" 
              />
              
              {/* Defined gradient */}
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Active linking Pointer Directional Arrow to selected station */}
              {selectedStation && (() => {
                const pos = getRelativePosition(selectedStation.lat, selectedStation.lng);
                return (
                  <>
                    <line 
                      x1="160" 
                      y1="160" 
                      x2={pos.cx} 
                      y2={pos.cy} 
                      stroke="#f43f5e" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="animate-pulse"
                    />
                    {/* Floating signal waves from transmitter along the connection path */}
                    <circle 
                      cx={pos.cx} 
                      cy={pos.cy} 
                      r="12" 
                      fill="none" 
                      stroke="#f43f5e" 
                      strokeWidth="1" 
                      opacity="0.5"
                      className="animate-ping"
                      style={{ transformOrigin: `${pos.cx}px ${pos.cy}px` }}
                    />
                  </>
                );
              })()}
            </svg>

            {/* User Central Target (Marker Icon) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[18px] flex flex-col items-center z-10 pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-rose-600 border border-white flex items-center justify-center animate-pulse shadow shadow-rose-500">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="bg-rose-950/90 text-[7px] font-mono text-zinc-100 font-extrabold px-1 rounded scale-90 border border-rose-800 tracking-tighter shadow uppercase mt-0.5">
                RUMAH
              </div>
            </div>

            {/* Plotting Station MUX nodes as interactive clickable components */}
            {stations.map((st) => {
              const pos = getRelativePosition(st.lat, st.lng);
              const isSelected = selectedStation?.id === st.id;
              
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectStation(st)}
                  className="absolute cursor-pointer transition-all duration-200 z-10 select-none group focus:outline-none"
                  style={{
                    left: `${pos.cx}px`,
                    top: `${pos.cy}px`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Red pulsing dot representing transmitter tower */}
                    <div className={`relative ${isSelected ? "w-6 h-6" : "w-4 h-4"} rounded-full flex items-center justify-center transition-all duration-200`}>
                      <div className={`absolute inset-0 rounded-full ${isSelected ? "bg-cyan-400 opacity-60 animate-ping" : "bg-blue-400 opacity-20 group-hover:bg-blue-300"}`} />
                      
                      {/* Central small antenna tower */}
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                        isSelected 
                          ? "bg-cyan-500 text-slate-950 border-white shadow-md shadow-cyan-400/50" 
                          : "bg-indigo-900 border-indigo-700 text-cyan-400 group-hover:bg-slate-800"
                      }`}>
                        <Radio className="w-2 h-2" />
                      </div>
                    </div>

                    {/* Channel name label on hovering or selected */}
                    <div className={`transition-all duration-200 ${
                      isSelected 
                        ? "bg-slate-900 text-cyan-400 border border-slate-700 opacity-100 scale-100" 
                        : "bg-slate-950/75 text-zinc-300 opacity-80 border border-slate-800 group-hover:opacity-100 scale-90"
                    } text-[7px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg translate-y-0.5 whitespace-nowrap uppercase tracking-tight`}>
                      {st.operator.replace("LPP ", "")} Ch.{st.channelFreq}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!hasValidGoogleKey && (
            <div className="w-full mt-2 grid grid-cols-1 select-none">
              <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-lg">
                <div className="p-1 rounded bg-indigo-100 text-indigo-900">
                  <ServerCrash className="w-4.5 h-4.5" />
                </div>
                <div className="text-[10px] text-indigo-900 leading-normal font-medium">
                  <strong>Simulasi Cyber Radar Aktif:</strong> Sinyal dipetakan secara real-time berdasarkan jarak antena ke stasiun MUX. Hubungkan Google Maps API Key di Settings untuk peta visual satelit!
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
