"use client";
import "./globals.css";
import Counter from "./counter";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen font-cousine bg-white">
        <header className="w-full h-12 border-b border-gray-300 bg-gray-50 fixed top-0 left-0 z-50 flex items-center" style={{ fontFamily: 'Cousine, monospace' }}>
          <div className="absolute left-4">
            <Counter />
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-16 pb-16">
          {children}
        </main>
        <footer className="w-full h-12 border-t border-gray-300 bg-gray-50 fixed bottom-0 left-0 z-50" style={{ fontFamily: 'Cousine, monospace' }}>
        </footer>
      </body>
    </html>
  );
}
