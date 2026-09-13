import React, { useRef } from 'react';

export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`white-glass-box ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}


