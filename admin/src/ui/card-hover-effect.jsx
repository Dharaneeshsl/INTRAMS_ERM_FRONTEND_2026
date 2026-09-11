import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 ${className || ''}`}>
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.onClick}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-sky-500/20 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            {item.association && (
              <p className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mt-1">
                {item.association}
              </p>
            )}
            <CardDescription>{item.about}</CardDescription>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{item.dayInfo}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                {item.status}
              </span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-5 overflow-hidden bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl group-hover:border-sky-500/50 transition-all duration-200 flex flex-col justify-between relative z-10 ${className || ''}`}
    >
      <div>{children}</div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={`text-xl font-bold text-white font-heading tracking-wide ${className || ''}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={`text-slate-300 text-sm mt-2 line-clamp-3 leading-relaxed ${className || ''}`}>
      {children}
    </p>
  );
};
