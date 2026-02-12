export type BlogMetadata = {
  title: string;
  description: string;
  date: string;
  slug: string;
  hidden: boolean;
  image?: string | null;
  tags?: string[];
};

export type BlogEntry = {
  metadata: BlogMetadata;
  content: string;
};

const rawBlogPosts = import.meta.glob("./posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const entries = Object.entries(rawBlogPosts).map(([filePath, rawContent]) => {
  const { data, content } = parseFrontmatter(rawContent);

  return {
    metadata: parseBlogMetadata(data, filePath),
    content,
  } satisfies BlogEntry;
});

export const blogPosts = entries.reduce<Record<string, BlogEntry>>(
  (acc, entry) => {
    const { slug } = entry.metadata;

    if (acc[slug]) {
      throw new Error(`duplicate blog slug: ${slug}`);
    }

    acc[slug] = entry;
    return acc;
  },
  {},
);

export const blogPostList = Object.values(blogPosts);

function parseBlogMetadata(data: unknown, filePath: string): BlogMetadata {
  if (!data || typeof data !== "object") {
    throw new Error(`invalid frontmatter for ${filePath}`);
  }

  const metadata = data as Record<string, unknown>;
  const title = requireString(metadata.title, "title", filePath);
  const description = requireString(
    metadata.description,
    "description",
    filePath,
  );
  const date = requireString(metadata.date, "date", filePath);
  const slug = requireString(metadata.slug, "slug", filePath);

  return {
    title,
    description,
    date,
    slug,
    hidden: typeof metadata.hidden === "boolean" ? metadata.hidden : false,
    image: optionalString(metadata.image),
    tags: optionalStringArray(metadata.tags),
  };
}

function requireString(value: unknown, key: string, filePath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`missing ${key} in ${filePath}`);
  }

  return value;
}

function optionalString(value: unknown): string | null | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const tags = value.filter((item): item is string => typeof item === "string");
  return tags.length > 0 ? tags : undefined;
}

function parseFrontmatter(rawContent: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const normalized = rawContent.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, content: normalized };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {}, content: normalized };
  }

  const frontmatterText = normalized.slice(4, endIndex);
  const content = normalized.slice(endIndex + 5);
  const lines = frontmatterText.split("\n");
  const data: Record<string, unknown> = {};
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith("  - ") && currentArrayKey) {
      const value = stripQuotes(line.slice(4).trim());
      const existing = data[currentArrayKey];
      if (Array.isArray(existing)) {
        existing.push(value);
      }
      continue;
    }

    currentArrayKey = null;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    if (!key) continue;

    if (rawValue.length === 0) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    if (rawValue === "true") {
      data[key] = true;
      continue;
    }

    if (rawValue === "false") {
      data[key] = false;
      continue;
    }

    data[key] = stripQuotes(rawValue);
  }

  return { data, content };
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
