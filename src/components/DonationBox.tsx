import { useState } from "react";
import { Check, Copy, Sparkles, Heart, Coffee } from "lucide-react";

export default function DonationBox() {
  const [copied, setCopied] = useState(false);
  const contactNo = "081341300100"; // raw for copy

  const handleCopyNo = () => {
    navigator.clipboard.writeText(contactNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-blue-900 text-white rounded-2xl p-4 shadow-xl border border-indigo-500/10 relative overflow-hidden select-none">
      {/* Decorative cyber grid lights */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-indigo-500/0 blur-xl pointer-events-none rounded-tr-2xl" />

      {/* Slang text description */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className="p-1.5 rounded-xl bg-orange-400/20 text-orange-300 animate-pulse shrink-0">
          <Coffee className="w-5 h-5 fill-orange-400" />
        </div>
        <div>
          <h4 className="font-sans font-bold text-xs tracking-wider uppercase text-cyan-300 flex items-center gap-1">
            Traktir Kopi Dev! <Sparkles className="w-3.5 h-3.5" />
          </h4>
          <p className="text-[10px] text-zinc-300 leading-normal font-sans mt-0.5">
            Sinyal TV Digital lu udah jernih & mantap sob? Yuk sawer dikit buat dev biar terus semangat update database MUX se-Indonesia! 🍻
          </p>
        </div>
      </div>

      {/* Payment Badges (e-wallets supported) */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <div className="bg-white/10 border border-white/5 rounded-xl px-2 py-1 flex flex-col items-center justify-center transition hover:bg-white/15">
            <span className="text-[9px] font-extrabold tracking-tight text-orange-400 uppercase">SHOPEE</span>
          </div>
          <div className="bg-white/10 border border-white/5 rounded-xl px-2 py-1 flex flex-col items-center justify-center transition hover:bg-white/15">
            <span className="text-[9px] font-extrabold tracking-tight text-emerald-400 uppercase">GOPAY</span>
          </div>
          <div className="bg-white/10 border border-white/5 rounded-xl px-2 py-1 flex flex-col items-center justify-center transition hover:bg-white/15">
            <span className="text-[9px] font-extrabold tracking-tight text-purple-400 uppercase">OVO</span>
          </div>
          <div className="bg-white/10 border border-white/5 rounded-xl px-2 py-1 flex flex-col items-center justify-center transition hover:bg-white/15">
            <span className="text-[9px] font-extrabold tracking-tight text-sky-400 uppercase">DANA</span>
          </div>
        </div>

        {/* Account Details */}
        <div className="flex items-center justify-between bg-white/5 border border-white/5 p-2 rounded-xl">
          <div className="space-y-0.5">
            <div className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-wider">Penerima Transfer / Sawer</div>
            <div className="text-xs font-bold text-white font-sans flex items-center gap-1">
              <span>Johan</span>
              <span className="text-rose-400"><Heart className="w-2.5 h-2.5 fill-rose-500" /></span>
              <span className="text-[9.5px] font-mono font-bold text-cyan-400 select-all">0813-41-300-100</span>
            </div>
          </div>

          <button
            onClick={handleCopyNo}
            className="p-1 px-2.5 bg-cyan-400 active:bg-cyan-500 hover:bg-cyan-300 text-slate-950 font-mono font-extrabold text-[9.5px] rounded-lg active:scale-95 transition flex items-center gap-0.5 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-indigo-950 font-bold" />
                <span>COPIED</span>
              </>
            ) : (
              <span>COPY NO</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
