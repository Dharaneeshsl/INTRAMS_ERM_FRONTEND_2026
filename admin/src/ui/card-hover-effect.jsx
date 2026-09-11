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
                className="absolute inset-0 h-full w-full bg-accent-orange/20 block rounded-3xl"
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
              <p className="text-xs font-semibold text-accent-orange uppercase tracking-wider mt-1">
                {item.association}
              </p>
            )}
            <CardDescription>{item.about}</CardDescription>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{item.dayInfo}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
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
      className={`rounded-2xl h-full w-full p-5 overflow-hidden bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl group-hover:border-accent-orange transition-all duration-200 flex flex-col justify-between relative z-10 ${className || ''}`}
    >
      <div>{children}</div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={`text-xl font-bold text-gray-900 tracking-wide ${className || ''}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p className={`text-gray-600 text-sm mt-2 line-clamp-3 leading-relaxed ${className || ''}`}>
      {children}
    </p>
  );
};
