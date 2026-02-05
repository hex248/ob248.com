import { Demo } from "@/components/Demo";
import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
	title: "PrayerBud",
	description:
		"A faith-based social platform facilitating sharing of support and prayers within communities.",
	date: "February 2025 - Present",
	slug: "prayerbud",
	image: "/prayerbud-icon.svg",
	url: "https://prayerbud.co.uk",
	hidden: false,
	tags: ["Web", "React", "TypeScript", "PostgreSQL", "OAuth2", "Databases"],
	type: "professional",
};

export function PrayerbudProject() {
	return (
		<ProjectPage metadata={metadata}>
			<div className="space-y-4 mb-4 text-pretty">
				<p>
					Pray Together and Grow Together: Join a diverse community of
					individuals from around the world who are passionate about prayer and
					spiritual growth. Create and share prayer requests with your PrayerBud
					community who are ready to offer support, encouragement, and heartfelt
					prayers.
				</p>
				<p>
					For prayer teams or churches, the app offers a streamlined way to
					manage and organise prayer requests, ensuring that no request goes
					unnoticed.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-muted p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Create and manage prayer networks</li>
						<li>Manage prayer communities</li>
						<li>Intimate engagement with friends and family</li>
						<li>Admin dashboard for managing users and user content</li>
						<li>Responsive design for mobile and desktop</li>
					</ul>
				</div>

				<div className="bg-muted p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Next.js</li>
						<li>React</li>
						<li>TypeScript</li>
						<li>PostgreSQL</li>
						<li>Node.js</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Demo
						image="/images/prayerbud/pre-login.png"
						title="Front page / pre-login"
						type="boxed"
					/>
					<Demo
						image="/images/prayerbud/post-login.png"
						title="Post-login"
						type="boxed"
					/>
					<Demo
						image="/images/prayerbud/create-network.png"
						title="Create Network"
						type="boxed"
					/>
					<Demo
						image="/images/prayerbud/welcome-to-network.png"
						title="Welcome to your Network"
						type="boxed"
					/>
					<Demo
						image="/images/prayerbud/prayer-card.png"
						title="Create Prayer Card"
						type="boxed"
					/>
					<Demo
						image="/images/prayerbud/dashboard.png"
						title="Admin Dashboard"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
