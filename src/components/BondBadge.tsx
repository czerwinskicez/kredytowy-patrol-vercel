"use client";
import React from 'react';

type BondBadgeProps = {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// Wspólne kolory dla wszystkich komponentów
export const bondColors: { [key: string]: string } = {
  OTS: '#3B82F6', // blue-500
  ROR: '#10B981', // emerald-500
  DOR: '#8B5CF6', // violet-500
  TOS: '#D97706', // amber-600
  COI: '#EF4444', // red-500
  EDO: '#6366F1', // indigo-500
  ROS: '#EC4899', // pink-500
  ROD: '#6B7280', // gray-500
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'px-3 py-1 text-sm',
};

export function BondBadge({ symbol, size = 'md', className = '' }: BondBadgeProps) {
  const backgroundColor = bondColors[symbol] || '#6B7280';
  const sizeClass = sizeClasses[size];

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-lg text-white font-bold ${sizeClass} ${className}`}
      style={{ backgroundColor }}
    >
      {symbol}
    </span>
  );
}