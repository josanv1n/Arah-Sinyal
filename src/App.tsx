import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass as CompassIcon, 
  Search, 
  Radio, 
  MapPin, 
  HelpCircle, 
  Cpu, 
  Satellite, 
  Database, 
  Sliders, 
  Wifi, 
  CheckCircle2, 
  ExternalLink,
  Navigation,
  Activity,
  ChevronDown,
  Sparkles,
  Info
} from "lucide-react";

import AndroidFrame from "./components/AndroidFrame";
import TechnoBackground from "./components/TechnoBackground";
import Compass from "./components/Compass";
import MapArea from "./components/MapArea";
import AppsScriptModal from "./components/AppsScriptModal";
import DonationBox from "./components/DonationBox";

import { MuxStation, UserLocation, ActionLog, SignalRecommendation } from "./types";
import { INDONESIA_MUX_STATIONS, CUSTOM_REGIONS, MAJOR_INDONESIAN_CITIES } from "./data/channels";

// Initializing state coordinates setup (defaults to Jambi)
const INITIAL_LOCATION: UserLocation = {
  lat: -1.6018,
  lng: 103.6181,
  address: "Kota Jambi, Jambi",
  isSimulated: true
};

const DEFAULT_SPREADSHEET_ID = "1jHxBbN5zacD9hBClTHTiimRk2cVCCxlYOXHg9OBFU9w";

export default function App() {
  // Region & filtering states
  const [selectedRegion, setSelectedRegion] = useState("sumatera");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation>(INITIAL_LOCATION);
  const [coordsInput, setCoordsInput] = useState({ lat: "-1.6018", lng: "103.6181" });

  // Digital TV MUX selected transmitter state
  const [selectedStation, setSelectedStation] = useState<MuxStation | null>(() => {
    return INDONESIA_MUX_STATIONS.find(s => s.id === "jambi-tvri") || null;
  });
  const [bearing, setBearing] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [fineTuneOffset, setFineTuneOffset] = useState<number>(0);

  // AI & Sheets Configuration states
  const [gasUrl, setGasUrl] = useState(() => {
    const metaEnv = (import.meta as any).env;
    return (
      localStorage.getItem("gas_url") || 
      metaEnv?.VITE_WEB_APP_URL || 
      metaEnv?.VITE_GAS_URL || 
      ""
    );
  });
  const [showGasModal, setShowGasModal] = useState(false);
  const [logs, setLogs] = useState<ActionLog[]>(() => {
    const localLogs = localStorage.getItem("action_logs");
    return localLogs ? JSON.parse(localLogs) : [];
  });

  // AI Assistant Analysis States
  const [aiReport, setAiReport] = useState<SignalRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [isMapModeGoogle, setIsMapModeGoogle] = useState(false);

  // Sync coords input on userLocation change
  useEffect(() => {
    setCoordsInput({
      lat: userLocation.lat.toFixed(5),
      lng: userLocation.lng.toFixed(5)
    });
  }, [userLocation]);

  // Synchronize dynamic lists based on filtering
  const filteredStations = INDONESIA_MUX_STATIONS.filter((station) => {
    const matchesRegion = 
      selectedRegion === "all" ||
      (selectedRegion === "jabodetabek" && (station.province === "DKI Jakarta" || station.province === "Banten")) ||
      (selectedRegion === "jabar" && station.province === "Jawa Barat") ||
      (selectedRegion === "jateng" && station.province === "Jawa Tengah") ||
      (selectedRegion === "jatim" && station.province === "Jawa Timur") ||
      (selectedRegion === "diy" && station.province === "DIY Yogyakarta") ||
      (selectedRegion === "sumatera" && (station.province === "Sumatera Utara" || station.province === "Sumatera Selatan" || station.province === "Lampung" || station.province === "Jambi")) ||
      (selectedRegion === "kalimantan" && station.province.includes("Kalimantan")) ||
      (selectedRegion === "sulawesi" && station.province.includes("Sulawesi")) ||
      (selectedRegion === "bali-nusra" && (station.province === "Bali" || station.province.includes("Nusa Tenggara")));

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      station.name.toLowerCase().includes(query) ||
      station.operator.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.province.toLowerCase().includes(query) ||
      station.channels.some(ch => ch.toLowerCase().includes(query));

    return matchesRegion && matchesSearch;
  });

  // Haversine calculator for distance and bearing between User & Selected Tower
  useEffect(() => {
    if (!selectedStation) return;

    // Calculate distance
    const R = 6371; // Earth radius in KM
    const lat1 = userLocation.lat * Math.PI / 180;
    const lat2 = selectedStation.lat * Math.PI / 180;
    const dLat = (selectedStation.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (selectedStation.lng - userLocation.lng) * Math.PI / 180;

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const finalDistance = R * c;
    setDistance(finalDistance);

    // Calculate bearing
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    let finalBearing = Math.atan2(y, x) * 180 / Math.PI;
    finalBearing = (finalBearing + 360) % 360;
    setBearing(finalBearing);

    // Auto trigger clear AI statement on station shift
    setAiReport(null);
    setAiError("");
  }, [userLocation, selectedStation]);

  // Handle fine tune offset alignment adjustments
  const handleFineTune = (offset: number) => {
    setFineTuneOffset((prev) => (prev + offset + 360) % 360);
  };

  // Safe client geolocation activation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Lokasi Perangkat Anda",
            isSimulated: false
          });
          setAiReport(null);
        },
        (error) => {
          alert("Gagal mendeteksi lokasi otomatis. Silakan masukkan koordinat secara manual.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung layanan lokasi otomatis.");
    }
  };

  // Log searching / target alignment action
  const logAction = async (station: MuxStation) => {
    // Math indicators
    const finalB = bearing;
    const finalD = distance;
    const signalEstimation = -30 - Math.min(65, Math.pow(finalD, 1.15) * 1.5); // Simple realistic free space path deduction model

    const timestamp = new Date().toLocaleString("id-ID");
    const newLog: ActionLog = {
      timestamp,
      actionType: "PILIH_MUX",
      searchQuery: searchQuery || selectedRegion,
      stationName: station.name,
      bearing: parseFloat(finalB.toFixed(1)),
      distance: parseFloat(finalD.toFixed(1)),
      signalStrength: Math.round(signalEstimation),
      lat: parseFloat(userLocation.lat.toFixed(5)),
      lng: parseFloat(userLocation.lng.toFixed(5)),
      notes: "Arah " + finalB.toFixed(1) + "°, Jarak " + finalD.toFixed(1) + " km."
    };

    // 1. Log to local storage first
    const updatedLogs = [newLog, ...logs].slice(0, 30); // cache last 30 entries
    setLogs(updatedLogs);
    localStorage.setItem("action_logs", JSON.stringify(updatedLogs));

    // 2. Log to Google Spreadsheet if URL is provided
    if (gasUrl && gasUrl.includes("exec")) {
      try {
        fetch(gasUrl, {
          method: "POST",
          mode: "no-cors", // avoid CORS issues with GAS redirect requests
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLog)
        });
      } catch (err) {
        console.error("Failed to post to Google Apps Script", err);
      }
    }
  };

  // Call station selecting with log trigger
  const handleSelectStation = (station: MuxStation) => {
    setSelectedStation(station);
    // Log async action with a small timeout to let bearing & distance states calculate
    setTimeout(() => {
      logAction(station);
    }, 150);
  };

  // Run AI analysis using server-side Gemini 3.5 Flash or Apps Script integration
  const runAiAnalysis = async () => {
    if (!selectedStation) return;
    setIsAiLoading(true);
    setAiError("");
    setAiReport(null);

    let rawData: any = null;
    let success = false;

    // 1. Try using the Google Apps Script Web App if the URL is set (centralized key & history)
    if (gasUrl && gasUrl.includes("exec")) {
      try {
        const response = await fetch(gasUrl, {
          method: "POST",
          // Notice: DO NOT set headers like 'Content-Type': 'application/json' 
          // to bypass browser CORS pre-flight checks when calling Google Apps Script!
          body: JSON.stringify({
            actionType: "GEMINI_ANALYZE",
            stationName: selectedStation.name,
            operator: selectedStation.operator,
            channelFreq: selectedStation.channelFreq,
            distanceKm: distance,
            bearing: bearing,
            province: selectedStation.province,
            city: selectedStation.city,
            channels: selectedStation.channels
          })
        });

        if (response.ok) {
          const gasData = await response.json();
          if (gasData.status === "success" && gasData.result) {
            rawData = { result: gasData.result };
            success = true;
          } else if (gasData.status === "error") {
            console.warn("Apps Script returned error message:", gasData.message);
          }
        }
      } catch (gasErr: any) {
        console.warn("Apps Script Gemini call failed or blocked, falling back to server:", gasErr.message);
      }
    }

    // 2. Fallback: Try using the application backend Express route
    if (!success) {
      try {
        const response = await fetch("/api/gemini/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stationName: selectedStation.name,
            operator: selectedStation.operator,
            channelFreq: selectedStation.channelFreq,
            distanceKm: distance,
            bearing: bearing,
            province: selectedStation.province,
            city: selectedStation.city,
            channels: selectedStation.channels
          })
        });

        if (response.ok) {
          rawData = await response.json();
          success = true;
        } else {
          const errData = await response.json();
          console.warn("Backend Gemini analysis route failed:", errData.error);
        }
      } catch (backendErr: any) {
        console.warn("Backend Gemini call failed:", backendErr.message);
      }
    }

    // Assign final report or default to smart offline mathematical estimate model
    if (success && rawData && rawData.result) {
      setAiReport(rawData.result);
      setIsAiLoading(false);
    } else {
      console.warn("Using smart native offline fallback analysis model.");
      
      // Standalone intelligent signal analysis fallback model of Indonesian DVB-T2
      const isBoosterNeeded = distance > 25;
      let estDb = -45 - Math.round(distance * 1.05);
      if (estDb < -95) estDb = -95;
      
      let signalStatus: "SANGAT BAIK" | "BAIK" | "CUKUP" | "LEMAH" | "SANGAT LEMAH" = "BAIK";
      if (estDb > -60) signalStatus = "SANGAT BAIK";
      else if (estDb > -72) signalStatus = "BAIK";
      else if (estDb > -84) signalStatus = "CUKUP";
      else if (estDb > -90) signalStatus = "LEMAH";
      else signalStatus = "SANGAT LEMAH";

      let recommendationText = "";
      if (distance < 12) {
        recommendationText = `Berdasarkan jarak dekat ${distance.toFixed(1)} km, sinyal pemancar sangat melimpah. Antena Grid/Loop indoor berkemampuan pasif tanpa amplifier sudah sangat cukup ditaruh di samping TV. Jauhkan dari struktur baja padat untuk tangkapan maksimal.`;
      } else if (distance < 28) {
        recommendationText = `Jarak transmisi sedang (${distance.toFixed(1)} km) membutuhkan antena Yagi Medium-Gain Outdoor setinggi 6 - 8 meter. Direkomendasikan ditaruh di luar rumah dan arahkan lurus menghadap ${bearing.toFixed(1)}° untuk memotong halangan struktur perumahan perkotaan.`;
      } else {
        recommendationText = `Pemancar cukup jauh (${distance.toFixed(1)} km). Kamu wajib pasang antena Yagi Outdoor High-Gain (seperti PF HDU-25) setinggi minimal 10-12 meter. Pastikan dipadu Smart Booster UHF (seperti Tanaka) agar gain sinyal optimal terdorong stabil tanpa drop di STB.`;
      }

      setAiReport({
        bearing: bearing,
        distance: distance,
        antennaType: distance > 30 ? "Sangat Direkomendasikan Yagi (Sektoral)" : distance > 15 ? "Yagi Medium-Gain" : "Antena Indoor Grid/Loop",
        antennaHeightMeters: distance > 32 ? 12 : distance > 18 ? 8 : 4,
        boosterNeeded: isBoosterNeeded,
        estSignalDb: estDb,
        estSignalStatus: signalStatus,
        description: recommendationText
      });
      setIsAiLoading(false);
    }
  };

  const handleManualCoordsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(coordsInput.lat);
    const lngNum = parseFloat(coordsInput.lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      alert("Masukkan nilai latitude dan longitude berupa angka yang valid.");
      return;
    }

    setUserLocation({
      lat: latNum,
      lng: lngNum,
      address: "Titik Peta Manual",
      isSimulated: true
    });
    setAiReport(null);
  };

  // Helper to get matching region ID for a city name to show its TV stations
  const getRegionForCity = (cityName: string): string => {
    const name = cityName.toLowerCase();
    if (name.includes("jambi")) return "sumatera";
    if (name.includes("jakarta")) return "jabodetabek";
    if (name.includes("bandung")) return "jabar";
    if (name.includes("semarang")) return "jateng";
    if (name.includes("yogyakarta")) return "diy";
    if (name.includes("surabaya")) return "jatim";
    if (name.includes("medan")) return "sumatera";
    if (name.includes("palembang")) return "sumatera";
    if (name.includes("lampung")) return "sumatera";
    if (name.includes("banjarmasin")) return "kalimantan";
    if (name.includes("samarinda")) return "kalimantan";
    if (name.includes("pontianak")) return "kalimantan";
    if (name.includes("makassar")) return "sulawesi";
    if (name.includes("manado")) return "sulawesi";
    if (name.includes("bali") || name.includes("denpasar")) return "bali-nusra";
    if (name.includes("mataram")) return "bali-nusra";
    if (name.includes("kupang")) return "bali-nusra";
    if (name.includes("serang")) return "jabodetabek";
    return "all";
  };

  // Helper custom quick sets for Indonesian major cities
  const handleQuickCitySelect = (city: typeof MAJOR_INDONESIAN_CITIES[0]) => {
    setUserLocation({
      lat: city.lat,
      lng: city.lng,
      address: city.name,
      isSimulated: true
    });
    setAiReport(null);
    setSelectedRegion(getRegionForCity(city.name));
  };

  // Clear riwayat action
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem("action_logs");
  };

  return (
    <AndroidFrame>
      <div className="flex-1 relative bg-slate-50 flex flex-col font-sans overflow-x-hidden select-none">
        
        {/* Cool Wave Techno Background */}
        <TechnoBackground />

        {/* Content Wrapper inside the emulator */}
        <div className="relative z-10 flex-1 flex flex-col p-4 space-y-4">
          
          {/* Header Area */}
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/10">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://josanvin.github.io/josanvin/img/ArahSinyal2.png" 
                alt="Logo ArahSinyal" 
                className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(30,58,138,0.25)]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-xs font-mono font-black text-indigo-950 uppercase tracking-tight leading-none">Arah Sinyal</h1>
                <h2 className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest uppercase mt-0.5">Antena TV Digital</h2>
              </div>
            </div>

            {/* Config & status buttons */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowGasModal(true)}
                className={`p-2 rounded-xl border flex items-center gap-1 transition-all ${
                  gasUrl 
                    ? "bg-indigo-50 text-indigo-900 border-indigo-200" 
                    : "bg-slate-100/90 text-slate-500 border-slate-200 hover:text-indigo-900"
                }`}
                title="Spreadsheet Logging Setup"
              >
                <Database className="w-4 h-4" />
                <span className="text-[8.5px] font-mono font-black uppercase">
                  {gasUrl ? "LIVE" : "SINKRON"}
                </span>
              </button>
            </div>
          </div>

          {/* User Location Selection Panel */}
          <div className="bg-white/75 backdrop-blur-md border border-blue-900/10 p-3.5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-950 uppercase tracking-wider">
              <MapPin className="w-4.5 h-4.5 text-indigo-900" /> Atur Lokasi TV Anda
            </div>

            {/* Quick pre-configured regions dropdown (drop list) */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const cityObj = MAJOR_INDONESIAN_CITIES.find(c => c.name === e.target.value);
                  if (cityObj) handleQuickCitySelect(cityObj);
                }}
                value={MAJOR_INDONESIAN_CITIES.find(c => userLocation.address === c.name || userLocation.address?.includes(c.name))?.name || MAJOR_INDONESIAN_CITIES[0].name}
                className="w-full text-xs font-sans bg-slate-50 border border-slate-200 p-2.5 pr-10 rounded-xl outline-none appearance-none focus:border-indigo-500 transition cursor-pointer font-bold text-slate-800"
              >
                {MAJOR_INDONESIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none flex items-center text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Input & auto coordinate selector form */}
            <form onSubmit={handleManualCoordsSubmit} className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono font-extrabold text-slate-500 uppercase">Latitude</span>
                <input 
                  type="text" 
                  value={coordsInput.lat}
                  onChange={(e) => setCoordsInput({ ...coordsInput, lat: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 p-1.5 rounded-lg outline-none text-slate-800"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-mono font-extrabold text-slate-500 uppercase">Longitude</span>
                <input 
                  type="text" 
                  value={coordsInput.lng}
                  onChange={(e) => setCoordsInput({ ...coordsInput, lng: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-50/70 border border-slate-200 p-1.5 rounded-lg outline-none text-slate-800"
                />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-1.5 pt-1">
                <button 
                  type="submit" 
                  className="py-1.5 bg-slate-900 active:bg-slate-800 text-white text-[10px] font-mono uppercase font-black tracking-wider rounded-lg active:scale-95 transition"
                >
                  Ganti Titik Manual
                </button>
                <button 
                  type="button"
                  onClick={handleGetLocation}
                  className="py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-950 hover:bg-indigo-100 text-[10px] font-mono uppercase font-black tracking-wider rounded-lg active:scale-95 transition flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3 fill-indigo-950" /> GPS Otomatis
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Radar Grid Map */}
          <MapArea 
            userLocation={userLocation}
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            isMapModeGoogle={isMapModeGoogle}
            setIsMapModeGoogle={setIsMapModeGoogle}
          />

          {/* MUX Selector Filter and Listing */}
          <div className="bg-white/75 backdrop-blur-md border border-blue-900/10 p-3.5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4.5 h-4.5 text-indigo-900 animate-pulse" /> Pilih Pemancar TV Digital
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                {filteredStations.length} MUX
              </span>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Cari stasiun, saluran TV, atau kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-sans bg-slate-50 border border-slate-200 p-2 pl-9 rounded-xl outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Quick region selector select-box */}
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full text-xs font-sans bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none appearance-none focus:border-indigo-500 transition cursor-pointer"
                >
                  {CUSTOM_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Station Cards list */}
            <div className="space-y-2 max-h-[175px] overflow-y-auto no-scrollbar pt-1 pr-1 select-none">
              {filteredStations.length > 0 ? (
                filteredStations.map((station) => {
                  const isCurSelected = selectedStation?.id === station.id;
                  return (
                    <button
                      key={station.id}
                      onClick={() => handleSelectStation(station)}
                      className={`w-full text-left p-2.5 rounded-xl border flex flex-col transition-all duration-150 active:scale-[0.99] ${
                        isCurSelected 
                          ? "bg-slate-900 text-slate-100 border-slate-950 shadow-md shadow-slate-900/35" 
                          : "bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 border-slate-100"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="font-sans font-bold text-xs tracking-tight line-clamp-1 truncate">
                          {station.name}
                        </div>
                        <span className={`text-[9px] font-mono uppercase font-black px-1 rounded ml-1.5 shrink-0 ${
                          isCurSelected ? "bg-cyan-400 text-slate-950" : "bg-indigo-50 text-indigo-900"
                        }`}>
                          UHF CH.{station.channelFreq}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[9px] font-mono mt-1 opacity-80">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{station.city}, {station.province}</span>
                        <span>•</span>
                        <span>Tower: {station.height ? station.height + "m" : "N/A"}</span>
                      </div>

                      <div className={`text-[8.5px] font-sans mt-1.5 flex flex-wrap gap-1 ${
                        isCurSelected ? "text-slate-300" : "text-slate-500"
                      }`}>
                        {station.channels.slice(0, 4).map((ch) => (
                          <span key={ch} className="px-1 py-0.2 rounded border border-current opacity-70">
                            {ch}
                          </span>
                        ))}
                        {station.channels.length > 4 && (
                          <span className="opacity-70 font-bold">+ {station.channels.length - 4} TV</span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 font-sans border border-dashed border-slate-200 rounded-xl">
                  Tidak ada pemancar TV digital yang cocok.
                </div>
              )}
            </div>
          </div>

          {/* Compass & Bearing Alignments */}
          <Compass 
            currentBearing={bearing}
            targetStationName={selectedStation ? selectedStation.name : null}
            onFineTune={handleFineTune}
            fineTuneOffset={fineTuneOffset}
          />

          {/* Selected MUX details analysis & AI Assistant Report */}
          {selectedStation && (
            <div className="bg-white/75 backdrop-blur-md border border-blue-900/10 p-3.5 rounded-2xl shadow-sm space-y-3 select-none">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-mono font-extrabold text-indigo-900 uppercase">Perhitungan Matematis</span>
                  <h4 className="font-sans font-extrabold text-xs text-indigo-950 uppercase tracking-tight line-clamp-1 truncate">
                    {selectedStation.operator}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-[8.5px] font-mono text-slate-400 uppercase">Jarak Pemancar</div>
                  <div className="text-xs font-black font-mono text-indigo-950">{distance.toFixed(1)} KM</div>
                </div>
              </div>

              {/* Smart numeric parameters grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-center">
                  <div className="text-[8px] font-mono uppercase text-slate-500">Arah Antena</div>
                  <div className="text-xs font-bold font-mono text-slate-900 mt-0.5">{(bearing + fineTuneOffset + 360) % 360}°</div>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-center">
                  <div className="text-[8px] font-mono uppercase text-slate-500">Estimasi Sinyal</div>
                  <div className="text-xs font-bold font-mono text-rose-600 mt-0.5">{( -40 - Math.min(50, distance * 1.05) ).toFixed(0)} dBm</div>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-center">
                  <div className="text-[8px] font-mono uppercase text-slate-500">Saluran TV</div>
                  <div className="text-xs font-bold font-mono text-indigo-950 mt-0.5">{selectedStation.channels.length} Saluran</div>
                </div>
              </div>

              {/* Gemini AI Signal Optimizer Analysis */}
              <div className="border-t border-slate-100 pt-3">
                {aiReport ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-50 border border-indigo-100 rounded-xl p-3 space-y-2.5 text-slate-700"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black text-indigo-900 bg-indigo-50/50 px-2 py-1 rounded border border-indigo-100/50">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-blue-900 animate-spin duration-[6000ms]" /> Rekomendasi AI Sinyal
                      </span>
                      <span className="text-rose-600 font-extrabold">{aiReport.estSignalStatus}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                      <div className="space-y-0.5">
                        <div className="text-[8px] font-mono uppercase text-slate-400">Model Antena</div>
                        <div className="text-[10px] font-extrabold text-slate-900 leading-tight">{aiReport.antennaType}</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[8px] font-mono uppercase text-slate-400">Tinggi Tiang</div>
                        <div className="text-[10px] font-extrabold text-indigo-950 leading-tight">{aiReport.antennaHeightMeters} Meter</div>
                      </div>
                      <div className="space-y-0.5 col-span-2">
                        <div className="text-[8px] font-mono uppercase text-slate-400">Penguat Sinyal Booster</div>
                        <div className="text-[10px] font-bold text-slate-700 leading-tight">
                          {aiReport.boosterNeeded 
                            ? "✅ Ya, Butuh Smart Booster UHF tambahan agar gambar tidak freeze." 
                            : "❌ Tidak, gain sinyal cukup dicolok langsung tanpa booster."}
                        </div>
                      </div>
                    </div>

                    <p className="text-[9.5px] leading-relaxed text-slate-650 bg-white/80 p-2.5 rounded-lg border border-slate-100 select-all font-sans font-medium">
                      {aiReport.description}
                    </p>
                  </motion.div>
                ) : (
                  <button
                    onClick={runAiAnalysis}
                    disabled={isAiLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-950 to-indigo-950 active:scale-[0.98] transition hover:shadow-lg hover:shadow-indigo-900/10 text-white font-sans text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 border border-indigo-500/20 shadow-md"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menganalisis Sinyal oleh Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>Analis Setup Antena (Gemini AI)</span>
                      </>
                    )}
                  </button>
                )}
                
                {aiError && (
                  <div className="text-[10px] text-rose-600 font-mono mt-1.5 text-center">
                    {aiError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Logs (History Tab) synced to sheet */}
          <div className="bg-white/75 backdrop-blur-md border border-blue-900/10 p-3.5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1.5 select-none">
              <span className="text-xs font-mono font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4.5 h-4.5 text-indigo-900" /> Riwayat Action (History Sheet)
              </span>
              {logs.length > 0 && (
                <button 
                  onClick={clearLogs}
                  className="text-[9px] font-mono text-slate-400 hover:text-rose-600 transition"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-[145px] overflow-y-auto no-scrollbar font-sans pr-1 select-none">
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className="text-[9.5px] leading-relaxed text-slate-600 p-2 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-400 mb-0.5">
                      <span>{log.timestamp}</span>
                      <span className="bg-indigo-100/60 text-indigo-900 font-bold px-1 rounded uppercase tracking-tighter">
                        {log.actionType}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 pr-12 text-xs leading-snug">
                      Pencarian: {log.stationName}
                    </div>
                    <div className="text-[9px] mt-0.5 grid grid-cols-2 text-slate-500 font-mono">
                      <div>Arah: <strong className="text-slate-700">{log.bearing}°</strong></div>
                      <div>Jarak: <strong className="text-slate-700">{log.distance} KM</strong></div>
                      <div>Tekanan: <strong className="text-slate-700">{log.signalStrength} dBm</strong></div>
                      <div>Point: <strong className="text-slate-700">{log.lat},{log.lng}</strong></div>
                    </div>
                    
                    {/* Cloud uploaded indicators */}
                    <div className="absolute bottom-2 right-2.5 flex items-center gap-0.5">
                      <span className="text-[7.5px] font-mono uppercase font-black tracking-tight text-emerald-600 self-center">Sheet</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100/20 self-center shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 text-[10.5px] text-slate-400 font-sans border border-dashed border-slate-200 rounded-xl leading-normal">
                  Belum ada pencarian/pilihan MUX. Tiap action Anda akan otomatis terekam ke sheet "History".
                </div>
              )}
            </div>
          </div>

          {/* Slang Donation Box Section */}
          <DonationBox />
        </div>
      </div>

      {/* Settings Modal Setup */}
      <AnimatePresence>
        {showGasModal && (
          <AppsScriptModal 
            onClose={() => setShowGasModal(false)}
            gasUrl={gasUrl}
            setGasUrl={(url) => {
              setGasUrl(url);
              localStorage.setItem("gas_url", url);
            }}
            spreadsheetId={DEFAULT_SPREADSHEET_ID}
          />
        )}
      </AnimatePresence>
    </AndroidFrame>
  );
}
