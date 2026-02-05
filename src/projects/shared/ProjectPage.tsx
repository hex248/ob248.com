import type { ProjectMetadata } from "@/projects";
import type { ReactNode } from "react";

type ProjectPageProps = {
	metadata: ProjectMetadata;
	children: ReactNode;
};

export function ProjectPage({ metadata, children }: ProjectPageProps) {
	const tags = metadata.tags ? [...metadata.tags].sort() : [];

	return (
		<div className="mx-auto w-full max-w-4xl px-6 py-10 text-md">
			<div className="flex flex-wrap items-start justify-between gap-6 mb-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl text-accent text-balance">
						{metadata.title}
					</h1>
					{metadata.image ? (
						<img
							src={metadata.image}
							alt={`${metadata.title} project icon`}
							className="w-24 h-24 rounded mb-2"
						/>
					) : (
						<div className="w-24 h-24 mb-2 border border-gutter rounded" />
					)}
				</div>
				<div className="flex flex-col items-end gap-2">
					{metadata.url ? (
						<a
							href={metadata.url}
							target="_blank"
							rel="noopener noreferrer"
							className="link-project-page inline-block text-sm"
						>
							Try {metadata.title}
						</a>
					) : null}
				</div>
			</div>

			<p className="text-sm text-gutter mb-2">
				{metadata.date}
				{metadata.github ? (
					<>
						{" "}
						-{" "}
						<a
							href={metadata.github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-green-500 hover:underline"
						>
							Source Code
						</a>
					</>
				) : null}
			</p>

			{tags.length > 0 ? (
				<div className="flex gap-1.5 text-sm flex-wrap leading-3 items-center mb-2 no-select">
					{tags.map((tag: string) => (
						<span
							key={tag}
							className="flex items-center text-gutter font-500 rounded-md border border-gutter px-1.5 py-1"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}

			<div className="text-pretty">{children}</div>

			<p className="text-center text-md text-gutter mt-8 mb-4">
				Oliver Bryan - {metadata.date}
				{metadata.github ? (
					<>
						{" "}
						-{" "}
						<a
							href={metadata.github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-green-500 hover:underline"
						>
							Source Code
						</a>
					</>
				) : null}
			</p>
		</div>
	);
}
