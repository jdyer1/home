"use client";
import { useState, useEffect } from "react";

export default function Counter() {

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("count");
      if (stored !== null) {
        setCount(Number(stored));
      }
    }
  }, []);

  const handleClick = () => {
    setCount((c) => {
      const next = c + 1;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("count", next.toString());
      }
      return next;
    });
  };

  return (
    <button
      id="counter-button"
      onClick={handleClick}
      className="flex items-center justify-center bg-gray-200 text-gray-700 rounded shadow font-cousine text-xl transition-all duration-200 border border-gray-400 select-none"
      style={{
        minWidth: '2.5rem',
        minHeight: '2.5rem',
        padding: '0.5rem',
        width: count === 0 ? '2.5rem' : 'auto',
        height: '2.5rem',
      }}
    >
      {count === 0 ? '#' : count}
    </button>
  );
}