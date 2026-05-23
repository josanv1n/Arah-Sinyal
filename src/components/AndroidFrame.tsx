import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Wifi, Battery, Signal, Volume2, ShieldAlert } from "lucide-react";

interface AndroidFrameProps {
  children: React.ReactNode;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  const [time, setTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isPowerOn, setIsPowerOn] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate slowly consuming battery over time or just fixed high level
  useEffect(() => {
    const batTimer = setInterval(() => {
      setBatteryLevel((prev) => (prev > 5 ? prev - 1 : 100));
    }, 120000);
    return () => clearInterval(batTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 py-6 px-4 select-none">
      {/* Phone container */}
      <div className="relative w-full max-w-[420px] h-[864px] bg-slate-950 rounded-[48px] shadow-[0_25px_50px_-12px_rgba(15,23,42,0.3)] border-[12px] border-slate-900 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Android Top Camera Punch Hole & Speaker */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-center z-50 pointer-events-none">
          <div className="w-24 h-5 bg-black rounded-b-xl flex items-center justify-center gap-1.5 px-3">
            {/* Camera lens mirror */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
            </div>
            {/* Speaker lines */}
            <div className="w-8 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>

        {/* Side physical buttons */}
        <div className="absolute top-36 -right-[15px] w-[3px] h-12 bg-slate-800 rounded-l border border-slate-900 cursor-pointer hover:bg-slate-700 transition" onClick={() => setIsPowerOn(!isPowerOn)} />
        <div className="absolute top-52 -right-[15px] w-[3px] h-20 bg-slate-800 rounded-l border border-slate-900" />

        {isPowerOn ? (
          <div className="relative flex-1 flex flex-col bg-slate-50 overflow-hidden rounded-[36px]">
            {/* Status Bar */}
            <div className="h-8 bg-slate-900/90 text-slate-100 flex items-center justify-between px-6 text-xs font-medium tracking-tight shrink-0 z-40 select-none">
              <div>{time}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-emerald-400 font-bold mr-0.5">LTE</span>
                <Signal className="w-3.5 h-3.5 text-slate-100 fill-slate-100" />
                <Wifi className="w-3.5 h-3.5 text-slate-100" />
                <div className="flex items-center gap-0.5 ml-0.5">
                  <span className="text-[10px] scale-90">{batteryLevel}%</span>
                  <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                </div>
              </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-slate-50">
              {children}
            </div>

            {/* Android Navigation Bar */}
            <div className="h-10 bg-slate-900/95 flex items-center justify-between px-16 shrink-0 z-40 border-t border-slate-800">
              {/* Back Triangle Button */}
              <button 
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full active:scale-95 transition"
                onClick={() => window.dispatchEvent(new CustomEvent("android-back"))}
                aria-label="Back"
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-slate-400 mr-1" />
              </button>
              
              {/* Home Circle Button */}
              <button 
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full active:scale-95 transition"
                onClick={() => window.dispatchEvent(new CustomEvent("android-home"))}
                aria-label="Home"
              >
                <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-400" />
              </button>

              {/* Recents Square Button */}
              <button 
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full active:scale-95 transition"
                onClick={() => window.dispatchEvent(new CustomEvent("android-recents"))}
                aria-label="Recents"
              >
                <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm" />
              </button>
            </div>
          </div>
        ) : (
          /* Phone Turned Off screen */
          <div className="flex-1 bg-black flex flex-col items-center justify-center text-slate-600 gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center shadow-lg shadow-black/40">
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 animate-pulse" />
            </div>
            <div className="text-center text-xs font-mono">
              <p className="text-zinc-600">SmartPhone Powered Off</p>
              <button 
                onClick={() => setIsPowerOn(true)} 
                className="mt-4 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-sans font-semibold rounded-lg active:scale-95 transition"
              >
                Turn On Power
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PC Helper instructions outside of device */}
      <div className="text-center mt-3 text-xs text-slate-500 max-w-sm px-4">
        <p>Aplikasi dalam bentuk frame <strong className="text-slate-700">Android OS 14</strong>. Anda bisa menggunakan klik/sentuhan layaknya HP sungguhan.</p>
      </div>
    </div>
  );
}
