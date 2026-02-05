import { Home } from "@nsmr/pixelart-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getProjectPrompt } from "@/lib/constants";
import type { ProjectMetadata } from "@/projects";
import { AskAI } from "./ask-ai";

export function ProjectPage({
	metadata,
	children,
}: {
	metadata: ProjectMetadata;
	children: ReactNode;
}) {
	const tags = metadata.tags ? [...metadata.tags].sort() : [];

	return (
		<div className="mx-auto w-full max-w-4xl px-6 py-4 text-md border my-8">
			<Link
				to="/"
				className="inline-flex items-center text-sm hover:text-accent mb-4"
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
							alt={`${metadata.title} project icon`}
							className="w-24 h-24 rounded mb-2"
						/>
					) : (
						<div className="w-24 h-24 mb-2 border rounded" />
					)}
				</div>
				<AskAI
					name={metadata.title}
					prompt={getProjectPrompt(
						metadata.title,
						metadata.description,
						metadata.slug,
					)}
				/>
			</div>
			{metadata.url ? (
				<div className="flex flex-col mb-2">
					<a
						href={metadata.url}
						target="_blank"
						rel="noopener noreferrer"
						className="link-project-page inline-block text-accent hover:underline underline-offset-2 text-sm"
					>
						Try {metadata.title}
					</a>
				</div>
			) : null}

			<p className="text-sm mb-2">
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
							className="flex items-center font-500 rounded-sm border px-1.5 py-1"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}

			<div className="text-pretty">{children}</div>

			<p className="text-center text-md mt-8 mb-4">
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
