import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "factor-e",
	description:
		"Isometric factory sandbox prototype in C++/raylib with procedural worlds, tile building, inventory & tools.",
	date: "August 2025",
	slug: "factor-e",
	image: "/factor-e-icon.svg",
	github: "https://github.com/hex248/factor-e",
	hidden: false,
	tags: ["Game", "C++", "OpenGL", "CMake", "Pixel Art"],
	type: "personal",
};

export function FactorEProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="text-pretty">
				"factor-e" is an isometric factory sandbox prototype I built to learn
				C++ and{" "}
				<a
					href="https://www.raylib.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="link-project-page"
				>
					raylib
				</a>
				. Inspired by Minecraft and{" "}
				<a
					href="https://store.steampowered.com/app/3433610/Terrafactor/"
					target="_blank"
					rel="noopener noreferrer"
					className="link-project-page"
				>
					Terrafactor
				</a>
				, it explores tile-based building, inventory management and procedural
				world generation.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-muted p-4 rounded mt-4">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Isometric rendering with my own pixel art</li>
						<li>Procedural world generation using Perlin noise</li>
						<li>Simple tile place/destroy loop</li>
						<li>Basic inventory and tool system</li>
						<li>Dev/debug overlay</li>
						<li>Cross-platform builds (Windows + Linux)</li>
						<li>
							<span className="text-green-500">Status:</span> active prototype
						</li>
					</ul>
				</div>

				<div className="bg-muted p-4 rounded mt-4">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>C++</li>
						<li>raylib (OpenGL)</li>
						<li>CMake</li>
						<li>Perlin noise generation</li>
						<li>Aseprite</li>
						<li>Engine-less game development</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Demo</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Demo
						image="/images/factor-e/world-gen.gif"
						title="World generation"
						type="boxed"
					/>
					<Demo
						image="/images/factor-e/pixel-art.png"
						title="Pixel art"
						type="boxed"
					/>
					<Demo
						image="/images/factor-e/place-destroy.gif"
						title="Place/destroy loop"
						type="boxed"
					/>
					<Demo
						image="/images/factor-e/debug-overlay.gif"
						title="Dev/debug overlay"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
