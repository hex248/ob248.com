import { Demo } from "@/components/Demo";
import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
	title: "fonts.ob248.com",
	description: "A lightweight site for browsing and using my go-to fonts.",
	date: "February 2026",
	slug: "fonts",
	image: "/fonts.svg",
	url: "https://fonts.ob248.com",
	hidden: false,
	tags: ["Web", "Typography", "Hono", "HTML", "Bun"],
	type: "personal",
};

export function FontsProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="mb-4 text-pretty">
				fonts.ob248.com is a lightweight site for browsing and using my go-to
				fonts. It simplifies the importing processign for .ttf and .otf fonts on
				the web.
			</p>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
					<Demo
						image="/images/fonts/page.png"
						title="Fonts page"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
