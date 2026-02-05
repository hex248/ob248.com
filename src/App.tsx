import { AskAI } from "@/components/ask-ai";
import { ProjectListItem } from "@/components/ProjectListItem";
import { type ProjectEntry, projectList, projects } from "@/projects";
import { Downasaur, Home as HomeIcon } from "@nsmr/pixelart-react";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { ThemeToggle } from "./components/theme-toggle";

const asciiFiles = [
	"cat-sleep.txt",
	"polar-bear.txt",
	"penguin-surfboard.txt",
	"cat-shock.txt",
	"exclamation.txt",
	"fat-cat-head.txt",
	"grumpy-dog.txt",
	"cat-peek.txt",
	"cat-loaf.txt",
];

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
	const isDevMode = import.meta.env.VITE_PUBLIC_DEV === "1";
	const [asciiArt, setAsciiArt] = useState("");
	const [asciiFile] = useState(
		() => asciiFiles[Math.floor(Math.random() * asciiFiles.length)],
	);
	const sortedProjects: ProjectEntry[] = [...projectList].sort(
		(a, b) =>
			parseDate(b.metadata.date).getTime() -
			parseDate(a.metadata.date).getTime(),
	);

	useEffect(() => {
		let isActive = true;
		fetch(`/ascii/${asciiFile}`)
			.then((response) => response.text())
			.then((text) => {
				if (isActive) setAsciiArt(text);
			});
		return () => {
			isActive = false;
		};
	}, [asciiFile]);

	return (
		<div className="min-h-dvh flex flex-col items-center gap-2 text-2xl px-6 py-10">
			<div className="flex flex-col items-center gap-8 mb-4">
				{asciiArt ? (
					<pre className="text-[#000000] dark:text-[#ffffff] leading-1.75 tracking-[-1.75px]">
						<code className="commitmono text-[11px]">{asciiArt}</code>
					</pre>
				) : null}
				<h1 className="text-center picnic text-8xl text-balance">
					Oliver Bryan
				</h1>
			</div>
			<div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
				{sortedProjects.map((project) => (
					<ProjectListItem
						key={project.metadata.slug}
						metadata={project.metadata}
						isDevMode={isDevMode}
					/>
				))}
			</div>
			<div className="w-full max-w-5xl flex items-center justify-between gap-4">
				<div className="flex items-center gap-6">
					<a href="/cv.pdf" className="text-lg text-fg hover:text-accent">
						CV/RESUME
					</a>
					<AskAI name="me" inline />
				</div>
				<ThemeToggle />
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
		<div
			className={`w-full h-[100vh] flex flex-col items-center justify-center gap-4`}
		>
			<span className="-ml-14 -mb-7 -rotate-20 text-xl text-accent">?</span>
			<Downasaur size={72} className="text-accent" />
			<span className="text-7xl">404</span>
			<span className="text-2xl">Not Found</span>

			<Link to="/">
				<HomeIcon className="size-12 hover:text-accent" />
			</Link>
		</div>
	);
}

// function NotFound() {
// 	return (
// 		<div className="min-h-dvh flex flex-col items-center justify-center gap-4 text-2xl">
// 			<Downasaur className="size-24 text-accent" />
// 			<Link to="/">
// 				<HomeIcon className="size-12 hover:text-accent" />
// 			</Link>
// 		</div>
// 	);
// }

function parseDate(dateStr: string): Date {
	const lower = dateStr.toLowerCase();

	if (lower.includes("q1")) return new Date("2023-01-01");
	if (lower.includes("q2")) return new Date("2023-04-01");
	if (lower.includes("q3")) return new Date("2023-07-01");
	if (lower.includes("q4")) return new Date("2023-10-01");

	const months: Record<string, number> = {
		january: 0,
		february: 1,
		march: 2,
		april: 3,
		may: 4,
		june: 5,
		july: 6,
		august: 7,
		september: 8,
		october: 9,
		november: 10,
		december: 11,
	};

	for (const [monthName, monthIndex] of Object.entries(months)) {
		if (lower.includes(monthName)) {
			const yearMatch = dateStr.match(/\b(20\d{2})\b/);
			if (yearMatch) {
				return new Date(Number.parseInt(yearMatch[1], 10), monthIndex, 1);
			}
		}
	}

	const yearMatch = dateStr.match(/\b(20\d{2})\b/);
	if (yearMatch) {
		return new Date(Number.parseInt(yearMatch[1], 10), 0, 1);
	}

	return new Date(0);
}
