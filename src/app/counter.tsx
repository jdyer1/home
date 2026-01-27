"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("count");
      return stored !== null ? Number(stored) : 0;
    }
    return 0;
  });

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
    <>
      <button id="counter-button" onClick={handleClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        count
      </button>
      <span id="counter-value" className="count-value">{count}</span>
    </>
  );
}