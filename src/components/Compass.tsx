import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCw, RotateCcw, HelpCircle, Compass as CompassIcon, Radio } from "lucide-react";

interface CompassProps {
  currentBearing: number; // calculated bearing to target
  targetStationName: string | null;
  onFineTune: (offset: number) => void;
  fineTuneOffset: number;
}

export default function Compass({ 
  currentBearing, 
  targetStationName, 
  onFineTune, 
  fineTuneOffset 
}: CompassProps) {
  const [deviceHeading, setDeviceHeading] = useState(0); // Simulated phone heading
  const [isSupported, setIsSupported] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Absolute/Real bearing including the fine-tuning done by user
  const finalBearing = (currentBearing + fineTuneOffset + 360) % 360;

  // Listen to physical device orientation if open on real phone
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // standard web heading
      let heading = 0;
      if (e.alpha !== null) {
        // alpha is 0 to 360 counter-clockwise.
        // Convert to clockwise heading:
        heading = (360 - e.alpha) % 360;
        setDeviceHeading(heading);
        setIsSupported(true);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Direction text helper
  const getDirectionText = (degree: number) => {
    const d = (degree + 360) % 360;
    if (d >= 337.5 || d < 22.5) return "UTARA (N)";
    if (d >= 22.5 && d < 67.5) return "TIMUR LAUT (NE)";
    if (d >= 67.5 && d < 112.5) return "TIMUR (E)";
    if (d >= 112.5 && d < 157.5) return "TENGGARA (SE)";
    if (d >= 157.5 && d < 202.5) return "SELATAN (S)";
    if (d >= 202.5 && d < 247.5) return "BARAT DAYA (SW)";
    if (d >= 247.5 && d < 292.5) return "BARAT (W)";
    return "BARAT LAUT (NW)";
  };

  // Pointer angle: how much should the red pointer arrow rotate inside our compass
  const arrowRotation = finalBearing - deviceHeading;

  return (
    <div className="flex flex-col items-center bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-blue-900/10 shadow-lg relative overflow-hidden">
      {/* Decorative techno lines */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-slate-900/10 pointer-events-none rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-slate-900/10 pointer-events-none rounded-bl-2xl" />

      {/* Title */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-1.5">
          <CompassIcon className="w-5 h-5 text-indigo-900 animate-pulse" />
          <span className="text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider">Kompas Sinyal Digital</span>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="p-1 text-slate-400 hover:text-indigo-900 transition"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-[10.5px] text-indigo-950 bg-indigo-50/85 p-2.5 rounded-lg mb-3 border border-indigo-100/50 leading-relaxed font-sans"
        >
          <p className="font-semibold mb-1">Cara Mengarahkan Antena:</p>
          <ol className="list-decimal pl-3.5 space-y-0.5">
            <li>Letakkan HP mendatar di dekat antena TV Anda.</li>
            <li>Arahkan panah <span className="text-red-500 font-bold">MERAH (Pemancar)</span> di kompas agar tepat mengarah ke garis penunjuk atas HP Anda.</li>
            <li>Arahkan tiang antena fisik Yagi Anda sejajar dengan arah panah MERAH tersebut.</li>
          </ol>
        </motion.div>
      )}

      {/* The Compass Dial */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-2">
        {/* Outer glowing border ring */}
        <div className="absolute inset-0 rounded-full border border-indigo-900/10 shadow-[inner_0_4px_12px_rgba(0,0,0,0.05)] bg-slate-50/50" />
        <div className="absolute inset-2 rounded-full border border-dashed border-indigo-950/20" />
        
        {/* Compass Ring tick marks - Fixed in place (North at Top) */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
          {/* North Tick */}
          <line x1="96" y1="6" x2="96" y2="14" stroke="#e11d48" strokeWidth="3" />
          {/* South Tick */}
          <line x1="96" y1="178" x2="96" y2="186" stroke="#1e293b" strokeWidth="2" />
          {/* East Tick */}
          <line x1="178" y1="96" x2="186" y2="96" stroke="#1e293b" strokeWidth="2" />
          {/* West Tick */}
          <line x1="6" y1="96" x2="14" y2="96" stroke="#1e293b" strokeWidth="2" />
        </svg>

        {/* Cardinal Direction indicators */}
        <div className="absolute top-4 font-mono font-bold text-rose-600 text-[11px] tracking-tight">N</div>
        <div className="absolute bottom-4 font-mono font-bold text-slate-800 text-[11px]">S</div>
        <div className="absolute right-4 font-mono font-bold text-slate-800 text-[11px]">E</div>
        <div className="absolute left-4 font-mono font-bold text-slate-800 text-[11px]">W</div>

        {/* Animated Rotating Inner Compass & Pointer Arrow */}
        <motion.div 
          className="absolute inset-4 rounded-full flex items-center justify-center"
          animate={{ rotate: arrowRotation }}
          transition={{ type: "spring", damping: 15, stiffness: 60 }}
        >
          {/* Radar background scanner */}
          <div className="absolute inset-6 rounded-full border border-indigo-200 bg-gradient-to-tr from-indigo-50/20 to-indigo-100/5 select-none" />

          {/* Compass Pointer Arrow pointing to MUX Station */}
          <div className="absolute inset-0 flex flex-col items-center">
            {/* The Arrow (Red points to TV station) */}
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[38px] border-b-rose-600 drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)] mt-2" />
            
            {/* Compass center circle */}
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow flex items-center justify-center mt-auto mb-auto z-10">
              <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </div>

            {/* Opposite tail */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[20px] border-t-slate-400 mb-4" />
          </div>
        </motion.div>

        {/* Dynamic target ring highlighting target orientation */}
        {targetStationName && (
          <div className="absolute inset-1 border border-indigo-500 rounded-full animate-pulse opacity-20 pointer-events-none" />
        )}
      </div>

      {/* Dynamic bearing angle readouts */}
      <div className="text-center w-full bg-slate-50 border border-slate-100/80 rounded-xl py-2 px-3 z-10">
        {targetStationName ? (
          <>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-0.5">Bearing Target Pemancar</div>
            <div className="text-sm font-extrabold text-indigo-950 font-mono tracking-tight flex items-center justify-center gap-1">
              <span>{finalBearing.toFixed(1)}°</span>
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-[11px] text-blue-800 font-semibold">{getDirectionText(finalBearing)}</span>
            </div>
            <div className="text-[9px] text-slate-400 font-sans truncate mt-0.5">{targetStationName}</div>
          </>
        ) : (
          <div className="text-[11px] text-slate-500 font-sans tracking-wide">
            Pilih pemancar di peta untuk melihat arah antena TV Anda.
          </div>
        )}
      </div>

      {/* Fine-Tuning Controls for Physical Antenna Alignment */}
      {targetStationName && (
        <div className="w-full flex flex-col mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center mb-1 text-[9px] font-mono uppercase text-slate-500 tracking-wider">
            <span>Koreksi Sinyal Fisik (+ / -)</span>
            <span className="font-bold text-indigo-950">Offset: {fineTuneOffset > 0 ? "+" : ""}{fineTuneOffset}°</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button 
              onClick={() => onFineTune(-5)} 
              className="py-1 px-1 text-[10px] font-mono bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-slate-200/60 font-bold transition flex items-center justify-center gap-0.5"
            >
              <RotateCcw className="w-2.5 h-2.5" /> -5°
            </button>
            <button 
              onClick={() => onFineTune(-1)} 
              className="py-1 px-1 text-[10px] font-mono bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-slate-200/60 font-bold transition"
            >
              -1°
            </button>
            <button 
              onClick={() => onFineTune(1)} 
              className="py-1 px-1 text-[10px] font-mono bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-slate-200/60 font-bold transition"
            >
              +1°
            </button>
            <button 
              onClick={() => onFineTune(5)} 
              className="py-1 px-1 text-[10px] font-mono bg-slate-100 active:bg-slate-200 text-slate-700 rounded-md border border-slate-200/60 font-bold transition flex items-center justify-center gap-0.5"
            >
              +5° <RotateCw className="w-2.5 h-2.5" />
            </button>
          </div>
          {fineTuneOffset !== 0 && (
            <button 
              onClick={() => onFineTune(-fineTuneOffset)} 
              className="mt-1.5 text-[9px] text-indigo-900 font-bold hover:underline font-mono text-center"
            >
              Reset Koreksi Sinyal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
