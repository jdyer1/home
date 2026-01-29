"use client";
import "./globals.css";
import Counter from "./counter";
import { Menu } from "./Menu";
import { ReactNode } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen font-cousine bg-gray-50">
        <Menu />
        <header className="w-full h-12 border-b border-gray-300 bg-gray-50 fixed top-0 left-0 z-50 flex items-center justify-between" style={{ fontFamily: 'Cousine, monospace' }}>
          <div className="flex items-center h-full ml-0">
            <button
              aria-label="Home"
              className="focus:outline-none m-0 p-0 flex items-center justify-center"
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '48px', height: '48px' }}
              onClick={() => { window.location.hash = ''; }}
            >
              <FontAwesomeIcon icon={faHouse} className="text-2xl text-black" />
            </button>
            <span
              className="ml-2 font-cousine text-gray-800 select-none overflow-hidden text-ellipsis max-w-[60vw] sm:max-w-xs md:max-w-sm lg:max-w-md text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight break-words"
              style={{ display: 'inline-block', maxHeight: '2.75rem', lineHeight: '1.2', verticalAlign: 'middle' }}
              title="James Dyer - my github page"
            >
              James Dyer - my github page
            </span>
          </div>
          <div className="absolute right-4">
            <Counter />
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-4 pb-16 bg-gray-50">
          {children}
        </main>
        <footer className="w-full h-12 border-t border-gray-300 bg-gray-50 fixed bottom-0 left-0 z-50" style={{ fontFamily: 'Cousine, monospace' }}>
        </footer>
      </body>
    </html>
  );
}
