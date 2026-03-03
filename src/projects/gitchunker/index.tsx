import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
  title: "gitchunker",
  description:
    "A small C++ CLI utility for splitting large files into numbered chunks and reconstructing them later.",
  date: "March 2026",
  slug: "gitchunker",
  image: "/gitchunker.svg",
  hidden: false,
  tags: ["C++", "CLI", "File Utilities"],
  type: "personal",
  github: "https://github.com/hex248/GitChunker",
};

export function GitChunkerProject() {
  return (
    <ProjectPage metadata={metadata}>
      <p className="mb-4 text-pretty">
        gitchunker is a small C++ CLI utility for splitting large files into
        numbered chunks and reconstructing them later.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            What it does
          </h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>
              <code>chunk</code> splits one or more files into{" "}
              <code>&lt;filename&gt;.chunks/</code> directories.
            </li>
            <li>
              <code>dechunk</code> (or <code>unchunk</code>) rebuilds files from
              chunk directories.
            </li>
            <li>
              Chunk files are named with zero-padded names like <code>001</code>
              , <code>002</code>, and so on.
            </li>
            <li>
              Files can be re-chunked. Existing chunk directories are deleted
              before chunking.
            </li>
          </ul>
        </div>

        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">Why?</h2>
          <p className="text-pretty">
            gitchunker makes it possible to commit large files to git by
            splitting them into smaller chunks, so you can keep them in version
            control without enabling Git LFS.
          </p>
        </div>

        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">Build</h2>
          <pre className="rounded bg-background p-3 overflow-x-auto">
            g++ gitchunker.cpp -o gitchunker
          </pre>
        </div>
      </div>

      <div className="mt-4 bg-muted p-4 rounded">
        <h2 className="text-lg text-green-500 mb-2 text-balance">Usage</h2>
        <pre className="rounded bg-background p-3 overflow-x-auto mb-3">
          {`./gitchunker chunk <files>
./gitchunker dechunk <chunk_dirs>`}
        </pre>

        <h3 className="text-base text-accent mb-2 text-balance">Examples</h3>
        <p className="mb-2 text-pretty">Chunk files:</p>
        <pre className="rounded bg-background p-3 overflow-x-auto mb-3">
          ./gitchunker chunk image.jpg video.mp4
        </pre>

        <p className="mb-2 text-pretty">This creates:</p>
        <ul className="list-disc list-inside space-y-1 mb-3 text-pretty">
          <li>
            <code>image.jpg.chunks/</code>
          </li>
          <li>
            <code>video.mp4.chunks/</code>
          </li>
        </ul>

        <p className="mb-2 text-pretty">Rebuild files:</p>
        <pre className="rounded bg-background p-3 overflow-x-auto">
          ./gitchunker dechunk image.jpg.chunks video.mp4.chunks
        </pre>
      </div>

      <div className="mt-4 bg-muted p-4 rounded">
        <h2 className="text-lg text-green-500 mb-2 text-balance">Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-pretty">
          <li>Current chunk size is 1 MiB.</li>
          <li>
            To use system-wide, copy the binary to <code>~/.local/bin/</code> or{" "}
            <code>/usr/bin/</code> and run as <code>gitchunker</code>.
          </li>
        </ul>
      </div>
    </ProjectPage>
  );
}
