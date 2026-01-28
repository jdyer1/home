// Strict TypeScript, Tailwind, Cousine font, greyscale, XSS safe
import React, { useState, useRef } from 'react';
import menuData from './menu-data.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconName } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

library.add(fas);

interface MenuItem {
  name: string;
  icon: string;
  order: number;
  folder: string;
}

const safeText = (text: string) => text.replace(/[^\w\s-]/g, '');

export const Menu: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpanded(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setExpanded(null), 1000);
  };

  return (
    <nav
      className="fixed left-0 top-12 h-[calc(100vh-6rem)] z-40 flex flex-col items-center bg-gray-50 text-gray-900 py-4 font-cousine"
      style={{ fontFamily: 'Cousine, monospace' }}
      aria-label="Main menu"
    >
      {menuData.map((item: MenuItem, idx: number) => (
        <div
          key={item.folder}
          className="relative mb-6 group"
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon
            icon={["fas", item.icon as IconName]}
            className="transition-transform duration-200 text-2xl group-hover:scale-110 text-black"
            title={safeText(item.name)}
          />
          {expanded === idx && (
            <span
              className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-50 text-black px-4 py-2 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 opacity-100 border border-gray-300"
              style={{ fontFamily: 'Cousine, monospace' }}
            >
              {safeText(item.name)}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
