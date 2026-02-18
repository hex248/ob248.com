import { Home } from "@nsmr/pixelart-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import type { BlogMetadata } from "@/blog";

export function BlogPage({
  metadata,
  content,
}: {
  metadata: BlogMetadata;
  content: string;
}) {
  const navigate = useNavigate();
  const tags = metadata.tags ? [...metadata.tags].sort() : [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isInteractiveTarget(event.target)) return;

      if (
        event.key === "Escape" ||
        event.key === "Backspace" ||
        event.key === "q"
      ) {
        event.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="relative mx-auto w-full max-w-4xl px-6 py-4 text-md border my-8">
      <p className="absolute top-4 right-6 text-xs text-fg/75">
        esc or backspace to go back
      </p>
      <Link
        to="/"
        className="inline-flex items-center text-sm hover:text-accent mb-4 pointer"
      >
        <Home />
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-6 mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-accent text-balance">
            {metadata.title}
          </h1>
          {metadata.image ? (
            <img
              src={metadata.image}
              alt={`${metadata.title} cover`}
              className="w-24 h-24 rounded mb-2 object-cover"
            />
          ) : (
            <div className="w-24 h-24 mb-2 border rounded" />
          )}
        </div>
      </div>

      <p className="text-sm mb-2">{metadata.date}</p>

      {tags.length > 0 ? (
        <div className="flex gap-1.5 text-sm flex-wrap leading-3 items-center mb-2 no-select">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center font-500 rounded-sm border px-1.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <article className="text-pretty space-y-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName;
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    tagName === "BUTTON" ||
    tagName === "A"
  );
}
