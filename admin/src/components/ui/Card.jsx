import React from 'react';

export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}
