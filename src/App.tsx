import { Link, Route, Routes, useParams } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { type ProjectMetadata, projectList, projects } from "@/projects";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/projects/:slug" element={<ProjectRoute />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;

function Home() {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center gap-8 text-2xl px-6 py-10">
			<div className="flex flex-col items-center gap-4">
				<h1 className="picnic text-8xl text-balance">Oliver Bryan</h1>
				<ThemeToggle />
			</div>
			<div className="w-full max-w-2xl flex flex-col gap-4">
				{projectList.map((project) => (
					<ProjectListItem
						key={project.metadata.slug}
						metadata={project.metadata}
					/>
				))}
			</div>
		</div>
	);
}

function ProjectRoute() {
	const { slug } = useParams();
	if (!slug || !projects[slug]) return <NotFound />;

	const { Component } = projects[slug];
	return <Component />;
}

function NotFound() {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center gap-4 text-2xl">
			<h1 className="text-4xl text-ayu-accent text-balance">Not found</h1>
			<Link className="text-ayu-accent underline" to="/">
				Go home
			</Link>
		</div>
	);
}

type ProjectListItemProps = {
	metadata: ProjectMetadata;
	isDevMode?: boolean;
	isHidden?: boolean;
};

function ProjectListItem({
	metadata,
	isDevMode = false,
	isHidden = false,
}: ProjectListItemProps) {
	const tags = metadata.tags ? [...metadata.tags].sort() : [];
	const isDevHidden = isDevMode && isHidden;

	return (
		<Link
			to={`/projects/${metadata.slug}`}
			className={cn(
				"group block flex flex-col justify-between rounded-md transition-colors duration-200",
				isDevHidden
					? "border border-dashed border-ayu-accent hover:border-ayu-accent"
					: "border-2 border-ayu-gutter-dim hover:border-ayu-gutter",
			)}
			data-tags={tags.join(",")}
		>
			<div className="flex gap-4 p-4 pb-0">
				<div className="w-16 h-16 flex-shrink-0">
					{metadata.image ? (
						<img
							src={metadata.image}
							alt={`${metadata.title} icon`}
							className="w-full h-full object-cover rounded"
						/>
					) : (
						<div className="w-full h-full border border-ayu-gutter rounded" />
					)}
				</div>
				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-500 -mb-2 -mt-1 text-ayu-accent text-balance">
						{metadata.title}
					</h3>
					<p className="text-sm text-ayu-fg text-pretty">
						{metadata.description}
					</p>
					{tags.length > 0 ? (
						<div className="flex gap-1.5 text-xs flex-wrap leading-3 items-center mb-1 no-select">
							{tags.map((tag) => (
								<span
									key={tag}
									className="flex items-center text-ayu-fg font-500 rounded-md border border-ayu-gutter px-1.5 py-0.5"
								>
									{tag}
								</span>
							))}
						</div>
					) : null}
				</div>
			</div>
			<div className="w-full flex justify-end p-2 pt-1">
				<p className="text-xs text-ayu-gutter group-hover:text-ayu-accent">
					{metadata.date}
				</p>
			</div>
		</Link>
	);
}
