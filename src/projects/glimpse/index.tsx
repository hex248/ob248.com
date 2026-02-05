import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "glimpse",
	description: "Simple social media app inspired by early Instagram.",
	date: "May 2025",
	slug: "glimpse",
	image: "/glimpse-icon.svg",
	url: "https://glimpse.ob248.com",
	github: "https://github.com/hex248/glimpse",
	hidden: false,
	tags: [
		"Web",
		"React",
		"TypeScript",
		"PostgreSQL",
		"Blob Storage",
		"Databases",
		"OAuth2",
	],
	type: "personal",
};

export function GlimpseProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="mb-4 text-pretty">
				"glimpse" is a full-stack social app for sharing photos with friends and
				building real community. Early Instagram and tumblr were huge
				inspirations, no influencers and brands, just keeping up with your
				friends and family. Sign in with Google, and immediately access a
				dynamic feed, view and comment on posts. Choose your profile colour, and
				enable push notifications for new posts, comments, and friend requests.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-highlight p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Key features
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Photo uploads with caption and cropping function</li>
						<li>User profiles with customisable colour themes</li>
						<li>Dynamic, server-rendered feed of friends' photos</li>
						<li>Commenting on posts</li>
						<li>User search</li>
						<li>Push notifications</li>
					</ul>
				</div>

				<div className="bg-highlight p-4 rounded">
					<h2 className="text-lg text-green-500 mb-2 text-balance">
						Technologies
					</h2>
					<ul className="list-disc list-inside space-y-1 text-pretty">
						<li>Next.js + TypeScript</li>
						<li>Prisma ORM + PostgreSQL</li>
						<li>Tailwind CSS</li>
						<li>Google OAuth with NextAuth.js</li>
						<li>Web Push API</li>
						<li>Next.js server-side rendering and API routes</li>
						<li>Progressive Web App (PWA)</li>
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					<Demo
						image="/images/glimpse/feed.png"
						title="Feed view"
						type="boxed"
					/>
					<Demo
						image="/images/glimpse/crop.png"
						title="Share - write a caption + crop"
						type="boxed"
					/>
					<Demo
						image="/images/glimpse/comments.png"
						title="Comments and interactions"
						type="boxed"
					/>
					<Demo
						image="/images/glimpse/profile.png"
						title="Profile (custom colours)"
						type="boxed"
					/>
					<Demo
						image="/images/glimpse/settings.png"
						title="Settings"
						type="boxed"
					/>
					<Demo
						image="/images/glimpse/search.png"
						title="User search and discovery"
						type="boxed"
					/>
				</div>
			</div>
		</ProjectPage>
	);
}
