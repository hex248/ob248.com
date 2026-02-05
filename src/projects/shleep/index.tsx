import { Demo } from "@/projects/shared/Demo";
import { ProjectPage } from "@/projects/shared/ProjectPage";

export const metadata = {
	title: "Shleep",
	description:
		"A couch co-op base defense game where you protect a sleepign child from nightmares.",
	date: "February - June 2023",
	slug: "shleep",
	image: "/shleep-icon.svg",
	url: "https://bigbootstudio.itch.io/shleep",
	hidden: true,
	tags: ["Unity", "C#", "HLSL", "Shader Graph", "Visual Effects Graph"],
	type: "personal",
};

export function ShleepProject() {
	return (
		<ProjectPage metadata={metadata}>
			<p className="text-pretty">
				Shleep is a couch co-op base defense game where you can build towers to
				help aid you and your party to protect a sleeping child from nightmares.
			</p>

			<div className="bg-highlight p-4 rounded mt-4">
				<h2 className="text-lg text-green-500 mb-2 text-balance">
					Technologies
				</h2>
				<ul className="list-disc list-inside space-y-1 text-pretty">
					<li>Unity</li>
					<li>C#</li>
					<li>HLSL</li>
					<li>Shader Graph</li>
					<li>Visual Effects Graph</li>
				</ul>
			</div>

			<div className="mt-4">
				<h2 className="text-2xl text-accent mb-3 text-balance">Screenshots</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Demo image="/images/shleep/1.png" title="1" type="boxed" />
					<Demo image="/images/shleep/2.png" title="2" type="boxed" />
					<Demo image="/images/shleep/3.png" title="3" type="boxed" />
					<Demo image="/images/shleep/4.png" title="4" type="boxed" />
					<Demo image="/images/shleep/5.png" title="5" type="boxed" />
					<Demo image="/images/shleep/6.png" title="6" type="boxed" />
				</div>
			</div>
		</ProjectPage>
	);
}
