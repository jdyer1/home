"use client";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Menu } from "./Menu";

export default function Home() {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("asciidoc/root.html")
      .then((res) => res.text())
      .then((rawHtml) => {
        // Extract <body>...</body> content only
        const match = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        setHtml(match ? match[1] : rawHtml);
      });
  }, []);

  useEffect(() => {
    // Only run after html is set and DOM is updated
    if (!html) return;
    const container = document.querySelector('.asciidoc-content');
    if (container) {
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && /^(https?:)?\/\//.test(href) && !href.startsWith(window.location.origin)) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
  }, [html]);

  return (
    <div className="relative">
      <Menu />
      <main className="bg-gray-50 p-4 max-w-3xl mx-auto">
        <div className="asciidoc-content">{html ? parse(html) : null}</div>
      </main>
    </div>
  );
}
