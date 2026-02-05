import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "Watercooler",
	description:
		"Virtual office space for remote teams allowing quick questions and spontaneous chats.",
	date: "March 2025",
	slug: "watercooler",
	image: "/watercooler-icon.svg",
	hidden: true,
	tags: [
		"Web",
		"React",
		"TypeScript",
		"WebRTC",
		"LiveKit",
		"PostgreSQL",
		"OAuth2",
		"Databases",
	],
	type: "personal",
};

export function WatercoolerProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="text-pretty">watercooler description here</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-muted p-4 rounded mt-4">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>feature1</li>
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
						<li>LiveKit (WebRTC)</li>
						<li>Next.js + TypeScript</li>
						<li>Prisma ORM + PostgreSQL</li>
						<li>Tailwind CSS</li>
						<li>Google OAuth with NextAuth.js</li>
						<li>Next.js server-side rendering and API routes</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Demo image="/images/watercooler/office.png" title="Office space" />
					<Demo image="/images/watercooler/idk.png" title="idk" />
					<Demo image="/images/watercooler/idk.png" title="idk" />
					<Demo image="/images/watercooler/idk.png" title="idk" />
				</div>
			</div>
		</ProjectPage>
	);
}
