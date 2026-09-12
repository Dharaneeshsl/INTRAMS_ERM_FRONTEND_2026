import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-2 ${className || ''}`}>
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className="relative group block p-1 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.onClick}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-zinc-800/60 block rounded-2xl"
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
              <p className="text-[11px] font-mono font-semibold text-sky-400 uppercase tracking-wider mt-0.5">
                {item.association}
              </p>
            )}
            <CardDescription>{item.about}</CardDescription>
            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span>{item.dayInfo}</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-cyan-400 font-mono text-[10px] font-semibold">
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
      className={`rounded-xl h-full w-full p-4 overflow-hidden bg-zinc-950 border border-zinc-800 shadow-md group-hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between relative z-10 ${className || ''}`}
    >
      <div>{children}</div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={`text-base font-semibold text-white tracking-tight ${className || ''}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={`text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed ${className || ''}`}>
      {children}
    </p>
  );
};

