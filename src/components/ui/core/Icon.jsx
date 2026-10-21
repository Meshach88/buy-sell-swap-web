import React from 'react';
import { ICONS } from './icons.js';

/** Lucide icon by name (e.g. "shield-check"). Unknown names render an empty box and warn in development. */
export function Icon({ name, size = 18, strokeWidth = 2, color = 'currentColor', style }) {
  const Glyph = ICONS[name];
  if (!Glyph) {
    if (import.meta.env?.DEV) console.warn(`Icon "${name}" is not in components/ui/core/icons.js`);
    return <span aria-hidden="true" style={{ display: 'inline-block', width: size, height: size, flex: '0 0 auto', ...style }} />;
  }
  return <Glyph size={size} strokeWidth={strokeWidth} color={color} aria-hidden="true" style={{ flex: '0 0 auto', ...style }} />;
}
