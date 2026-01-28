import React from "react";

export interface ArticleLink {
  title: string;
  htmlFile: string;
  mtime: number;
}

interface Props {
  folder: string;
  articles: ArticleLink[];
  sort: "lex" | "date";
}

export const ArticleLinks: React.FC<Props> = ({ folder, articles }) => {
  if (!articles.length) return <div className="py-8" />;
  if (articles.length === 1) {
    // Should never render this, handled by router logic
    return null;
  }
  return (
    <div className="py-8">
      <ul className="space-y-4">
        {articles.map((a) => (
          <li key={a.htmlFile}>
            <a
              href={`#/${encodeURIComponent(folder)}/${encodeURIComponent(a.htmlFile)}`}
              className="text-gray-800 underline hover:text-gray-600 font-cousine text-lg"
            >
              {a.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
