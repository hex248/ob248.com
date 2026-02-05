import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "Sprint",
	description:
		"A simple project management tool for developers. Born out of frustration with Jira.",
	date: "December 2025 - Present",
	slug: "sprint",
	image: "/sprint-icon.svg",
	url: "https://sprintpm.org",
	github: "https://github.com/hex248/sprint",
	hidden: false,
	tags: [
		"Web",
		"React",
		"TypeScript",
		"Tauri",
		"PostgreSQL",
		"Databases",
		"Bun",
	],
	type: "personal",
};

export function SprintProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="mb-4 text-pretty">
				Sprint is a lightweight, self-hostable project management tool built for
				developers who want simplicity over complexity. Frustrated with bloated
				tools like Jira, I created Sprint to focus on what matters: tracking
				tasks within organisations and projects without the overhead. Deploy it
				on your own infrastructure for full control over your data, and access
				it via the web or as a native desktop application via Tauri.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-muted p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Organisation and project management</li>
						<li>Issue creation with titles and descriptions</li>
						<li>Issue assignment to team members</li>
						<li>Time tracking with start, pause, and resume timers</li>
						<li>Sprint management with date ranges</li>
						<li>Customizable issue statuses per organisation</li>
						<li>Resizable split-pane interface</li>
						<li>Role-based access: owner, admin, member</li>
						<li>Avatar uploads with S3 storage</li>
						<li>Native desktop app via Tauri</li>
					</ul>
				</div>

				<div className="bg-muted p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>React + TypeScript (frontend)</li>
						<li>Bun.serve + Drizzle ORM (backend)</li>
						<li>PostgreSQL</li>
						<li>Tailwind + shadcn/ui</li>
						<li>Tauri (desktop)</li>
						<li>S3 file storage (avatars)</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Architecture</h2>
				<p className="mb-4 text-pretty">
					Sprint uses a monorepo structure with three packages: a shared package
					containing database schemas and types, a Bun.serve API with Drizzle
					ORM and auth middleware, and a React frontend that runs as a web app
					or is bundled as a native desktop application with Tauri.
				</p>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
					<Demo
						image="/images/sprint/landing-1.png"
						title="Landing — 1"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/landing-light-1.png"
						title="Landing (light) — 1"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/selected-issue.png"
						title="Main interface — issues list and detail pane"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/filter-status.png"
						title="Filter status"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/create-issue.png"
						title="Create issue"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/sprints.png"
						title="Sprints"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/account-settings.png"
						title="Account settings"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/organisations-edit.png"
						title="Organisation edit"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/organisations-projects-settings.png"
						title="Organisation projects settings"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/organisations-issues-settings.png"
						title="Organisation issues settings"
						type="boxed"
					/>
					<Demo
						image="/images/sprint/organisations-features-settings.png"
						title="Organisation features settings"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
