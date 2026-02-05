import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "Wiskatron",
	description: "Spotify listening activity with dynamic visuals",
	date: "February 2024",
	slug: "wiskatron",
	image: "/wiskatron-icon.svg",
	github: "https://github.com/hex248/wiskatron",
	hidden: false,
	tags: ["Web", "React", "TypeScript", "Spotify API", "OAuth2"],
	type: "personal",
};

export function WiskatronProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="mb-4 text-pretty">
				Spotify listening activity web app with dynamic visuals, built with
				Next.js.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-highlight p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Live fetch from Spotify API</li>
						<li>OAuth 2.0 authentication</li>
						<li>Dynamic colour palette extraction</li>
						<li>Smooth song transitions</li>
					</ul>
				</div>

				<div className="bg-highlight p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Next.js + TypeScript</li>
						<li>Spotify API</li>
						<li>OAuth 2.0 with fastify</li>
						<li>Next.js server-side rendering and API routes</li>
						<li>Colour palette extraction with node-vibrant</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Demo image="/images/wiskatron/1.png" title="Example 1" />
					<Demo image="/images/wiskatron/2.png" title="Example 2" />
					<Demo image="/images/wiskatron/3.png" title="Example 3" />
					<Demo image="/images/wiskatron/4.png" title="Example 4" />
					<Demo image="/images/wiskatron/5.png" title="Example 5" />
					<Demo image="/images/wiskatron/6.png" title="Example 6" />
				</div>
			</div>
		</ProjectPage>
	);
}
