import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "MIZU",
	description:
		"A discord bot card trading and collection game. (Currently inactive, 4000+ players) ",
	date: "2021 - 2024",
	slug: "mizu",
	image: "/mizu-icon.svg",
	hidden: false,
	tags: [
		"Node.js",
		"TypeScript",
		"PostgreSQL",
		"AWS S3",
		"Discord API",
		"Database",
	],
	type: "personal",
};

export function MizuProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="text-pretty">
				I led a four-person team to create MIZU, a popular anime trading card
				game on Discord. In this role, I was responsible for the full lifecycle
				of the application: designing the core architecture, building the
				application with Node.js and TypeScript, and deploying it on a
				self-managed VPS. We successfully scaled to serve over 4,000 players.
				Although MIZU is no longer active, it was a significant experience in
				leading a team and scaling a live application.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-highlight p-4 rounded mt-4">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Node.js</li>
						<li>TypeScript</li>
						<li>Express.js</li>
						<li>Discord.js</li>
						<li>PostgreSQL</li>
						<li>AWS S3</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Gameplay</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Demo
						image="/images/mizu/card.png"
						title="Card (Large image)"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/card-fighter.png"
						title="Card (Fighter)"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/card-details.png"
						title="Card (Details)"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/collection1.png"
						title="Collection"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/collection2.png"
						title="Collection with sorting and filtering"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/current-trade.png"
						title="Ongoing Trade"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/complete-trade.png"
						title="Completed Trade"
						type="boxed"
					/>
					<Demo image="/images/mizu/forage.png" title="Forage" type="boxed" />
					<Demo
						image="/images/mizu/inventory.png"
						title="Inventory"
						type="boxed"
					/>
					<Demo image="/images/mizu/quests.png" title="Quests" type="boxed" />
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">
					Pre-Production
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Demo
						image="/images/mizu/forage-design.png"
						title="Forage Design"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/forage-locations.png"
						title="Forage Locations"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/quests-planning.png"
						title="Quests Planning"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/update-planning.png"
						title="Update Management"
						type="boxed"
					/>
					<Demo
						image="/images/mizu/pack-planning.png"
						title="Pack System"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
