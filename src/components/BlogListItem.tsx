import { Link } from "react-router-dom";
import type { BlogMetadata } from "@/blog";
import { cn } from "@/lib/utils";

export function BlogListItem({
  metadata,
  isDevMode = false,
  isActive = false,
}: {
  metadata: BlogMetadata;
  isDevMode?: boolean;
  isActive?: boolean;
}) {
  const tags = metadata.tags ? [...metadata.tags].sort() : [];
  if (metadata.hidden && !isDevMode) return null;

  return (
    <Link
      to={`/blog/${metadata.slug}`}
      className={cn(
        "group relative block flex flex-col justify-between transition-colors duration-200 border-2",
        "hover:border-accent",
        isActive && "border-accent",
        isDevMode && metadata.hidden && "border-dashed border-accent",
      )}
      data-tags={tags.join(",")}
    >
      <div className="flex gap-4 p-4 pb-0">
        <div className="w-16 h-16 flex-shrink-0">
          {metadata.image ? (
            <img
              src={metadata.image}
              alt={`${metadata.title} cover`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full border rounded" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-500 -mb-2 -mt-1 text-accent text-balance">
            {metadata.title}
          </h3>
          <p className="text-sm text-fg text-pretty">{metadata.description}</p>
          {tags.length > 0 ? (
            <div className="flex gap-1.5 text-xs flex-wrap leading-3 items-center mb-1 no-select">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center text-fg font-500 rounded-sm border px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-full flex justify-end p-2 pt-1">
        <p className="text-xs group-hover:text-accent">{metadata.date}</p>
      </div>
    </Link>
  );
}
