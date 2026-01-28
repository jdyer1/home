"use client";

import { useEffect, useState, useCallback } from "react";
import parse from "html-react-parser";
import { Menu } from "./Menu";
import { ArticleLinks, ArticleLink } from "./ArticleLinks";

type ViewState =
  | { type: "root" }
  | { type: "folder"; folder: string }
  | { type: "article"; folder: string; htmlFile: string };

function parseHash(): ViewState {
  // #/folder or #/folder/article.html
  if (!window.location.hash || window.location.hash === "#" || window.location.hash === "") {
    return { type: "root" };
  }
  const parts = window.location.hash.slice(2).split("/");
  if (parts.length === 1 && parts[0]) {
    return { type: "folder", folder: decodeURIComponent(parts[0]) };
  }
  if (parts.length === 2) {
    return { type: "article", folder: decodeURIComponent(parts[0]), htmlFile: decodeURIComponent(parts[1]) };
  }
  return { type: "root" };
}

export default function Home() {
  const [view, setView] = useState<ViewState>({ type: "root" });
  const [html, setHtml] = useState<string>("");
  const [articleLinks, setArticleLinks] = useState<ArticleLink[]>([]);
  const [sort, setSort] = useState<"lex" | "date">("lex");
  const [folder, setFolder] = useState<string>("");

  // Listen to hash changes
  useEffect(() => {
    const onHashChange = () => setView(parseHash());
    window.addEventListener("hashchange", onHashChange);
    setView(parseHash());
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Load content based on view
  useEffect(() => {
    if (view.type === "root") {
      fetch("asciidoc/root.html")
        .then((res) => res.text())
        .then((rawHtml) => {
          const match = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          setHtml(match ? match[1] : rawHtml);
        });
      setArticleLinks([]);
      setFolder("");
      setSort("lex");
    } else if (view.type === "folder") {
      setHtml("");
      setFolder(view.folder);
      fetch(`asciidoc/${encodeURIComponent(view.folder)}/metadata.json`)
        .then((res) => res.ok ? res.json() : { articles: [], sort: "lex" })
        .then((meta) => {
          setArticleLinks(meta.articles || []);
          setSort(meta.sort === "date" ? "date" : "lex");
          // Special case: 1 article, go directly to article
          if (meta.articles && meta.articles.length === 1) {
            window.location.hash = `#/${encodeURIComponent(view.folder)}/${encodeURIComponent(meta.articles[0].htmlFile)}`;
          }
        });
    } else if (view.type === "article") {
      setHtml("");
      setFolder(view.folder);
      fetch(`asciidoc/${encodeURIComponent(view.folder)}/${encodeURIComponent(view.htmlFile)}`)
        .then((res) => res.text())
        .then((rawHtml) => {
          const match = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          setHtml(match ? match[1] : rawHtml);
        });
      // For back navigation, also load metadata
      fetch(`asciidoc/${encodeURIComponent(view.folder)}/metadata.json`)
        .then((res) => res.ok ? res.json() : { articles: [], sort: "lex" })
        .then((meta) => {
          setArticleLinks(meta.articles || []);
          setSort(meta.sort === "date" ? "date" : "lex");
        });
    }
  }, [view]);

  // XSS protection for html-react-parser is handled by default, but we avoid rendering script/style tags
  const safeParse = useCallback((html: string) =>
    parse(html, {
      replace: (domNode) => {
        // @ts-ignore
        if (domNode && domNode.type === "script") return null;
        // @ts-ignore
        if (domNode && domNode.type === "style") return null;
        return undefined;
      },
    }),
    []
  );

  let content: React.ReactNode = null;
  if (view.type === "root") {
    content = <div className="asciidoc-content">{html ? safeParse(html) : null}</div>;
  } else if (view.type === "folder") {
    if (articleLinks.length === 0) {
      content = <div className="py-8" />;
    } else if (articleLinks.length > 1) {
      content = <ArticleLinks folder={folder} articles={articleLinks} sort={sort} />;
    } // else: 1 article, redirected
  } else if (view.type === "article") {
    content = <div className="asciidoc-content">{html ? safeParse(html) : null}</div>;
  }

  useEffect(() => {
    // Only run after html is set and DOM is updated
    if (!html) return;
    const container = document.querySelector('.asciidoc-content');
    if (container) {
      const links = container.querySelectorAll('a[href]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && /^(https?:)?\//.test(href) && !href.startsWith(window.location.origin)) {
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
        {content}
      </main>
    </div>
  );
}
