
"use client";

import { useState } from "react";

export default function Home() {

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
    <main>
      <button id="counter-button" onClick={handleClick}>
        count
      </button>
      <span id="counter-value" className="count-value">{count}</span>
    </main>
  );
}
