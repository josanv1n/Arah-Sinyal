import { motion } from "motion/react";

export default function TechnoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Off-white to subtle blue-navy radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A]/5 via-[#F8FAFC] to-[#1E293B]/10 opacity-100" />
      
      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1E3A8A 1px, transparent 1px), radial-gradient(#1E3A8A 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Pulsing signal waves representing digital TV wave transmission */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] flex items-center justify-center opacity-30">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="absolute border border-blue-900/10 rounded-full"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: "100%", 
              height: "100%", 
              opacity: 0 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: (index - 1) * 2,
              ease: "linear",
            }}
            style={{
              maxWidth: "500px",
              maxHeight: "500px",
            }}
          />
        ))}
      </div>

      {/* Floating abstract electronics grid nodes */}
      <div className="absolute top-12 left-8 w-1 h-1 rounded-full bg-blue-500 animate-ping duration-[3000ms]" />
      <div className="absolute bottom-24 right-12 w-2 h-2 rounded-full bg-indigo-500 opacity-20 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[1px] h-[100px] bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0" />
      <div className="absolute bottom-1/3 left-1/4 w-[120px] h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/15 to-indigo-500/0" />
    </div>
  );
}
