import {
	Downasaur,
	Github,
	Home as HomeIcon,
	Mail,
	Notes,
} from "@nsmr/pixelart-react";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { AskAI } from "@/components/ask-ai";
import { ProjectListItem } from "@/components/ProjectListItem";
import { TimeSince } from "@/components/time-since";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ProjectEntry, projectList, projects } from "@/projects";
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

const homeTabs = ["work", "travel"] as const;
type HomeTab = (typeof homeTabs)[number];

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
	const isTabsEnabled = import.meta.env.VITE_TABS === "1";
	const navigate = useNavigate();
	const [asciiArt, setAsciiArt] = useState("");
	const [activeTab, setActiveTab] = useState<HomeTab>("work");
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [hasPointerInteraction, setHasPointerInteraction] = useState(false);
	const [asciiFile] = useState(
		() => asciiFiles[Math.floor(Math.random() * asciiFiles.length)],
	);
	const sortedProjects: ProjectEntry[] = [...projectList].sort(
		(a, b) =>
			parseDate(b.metadata.date).getTime() -
			parseDate(a.metadata.date).getTime(),
	);
	const visibleProjects = sortedProjects.filter(
		(project) => isDevMode || !project.metadata.hidden,
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

	useEffect(() => {
		setActiveIndex((prev) => {
			if (visibleProjects.length === 0) return null;
			if (prev === null) return null;
			return Math.min(prev, visibleProjects.length - 1);
		});
	}, [visibleProjects.length]);

	useEffect(() => {
		if (visibleProjects.length === 0) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.isComposing) return;
			if (event.metaKey || event.ctrlKey || event.altKey) return;

			if (isTabsEnabled && event.key === "Tab") {
				event.preventDefault();
				setActiveTab((prev) => {
					const currentIndex = homeTabs.indexOf(prev);
					const safeIndex = currentIndex === -1 ? 0 : currentIndex;
					const nextIndex = (safeIndex + 1) % homeTabs.length;
					return homeTabs[nextIndex];
				});
				return;
			}

			if (isInteractiveTarget(event.target)) return;

			const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
			const isDesktop = window.matchMedia("(min-width: 768px)").matches;
			const columns = isDesktop ? 2 : 1;

			let delta = 0;
			if (key === "ArrowLeft" || key === "h") delta = -1;
			if (key === "ArrowRight" || key === "l") delta = 1;
			if (key === "ArrowUp" || key === "k") delta = -columns;
			if (key === "ArrowDown" || key === "j") delta = columns;

			if (delta !== 0) {
				event.preventDefault();
				setActiveIndex((prev) => {
					if (prev === null) return 0;
					const next = Math.max(
						0,
						Math.min(visibleProjects.length - 1, prev + delta),
					);
					return next;
				});
				return;
			}

			if (key === "Enter") {
				if (activeIndex === null) return;
				event.preventDefault();
				const target = visibleProjects[activeIndex];
				if (!target) return;
				navigate(`/projects/${target.metadata.slug}`);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeIndex, navigate, visibleProjects]);

	useEffect(() => {
		const enablePointerInteraction = () => {
			setHasPointerInteraction(true);
		};

		window.addEventListener("pointermove", enablePointerInteraction, {
			once: true,
		});
		window.addEventListener("pointerdown", enablePointerInteraction, {
			once: true,
		});

		return () => {
			window.removeEventListener("pointermove", enablePointerInteraction);
			window.removeEventListener("pointerdown", enablePointerInteraction);
		};
	}, []);

	return (
		<div className="min-h-dvh flex flex-col items-center gap-2 text-2xl px-6 py-10">
			<div className="flex flex-col items-center gap-4 mb-4">
				{asciiArt ? (
					<pre className="text-[#000000] dark:text-[#ffffff] leading-1.75 tracking-[-1.75px]">
						<code className="commitmono text-[11px]">{asciiArt}</code>
					</pre>
				) : null}
				<h1 className="text-center picnic text-8xl text-balance">
					Oliver Bryan
				</h1>
				<div className="flex flex-wrap items-center justify-center gap-3 text-base text-fg">
					<a
						href="https://github.com/hex248"
						rel="noreferrer"
						target="_blank"
						className="inline-flex items-center gap-2 hover:text-accent"
					>
						<Github className="size-6" />
						hex248
					</a>
					<span className="text-fg/60">/</span>
					<a
						href="mailto:ob248@proton.me"
						className="inline-flex items-center gap-2 hover:text-accent"
					>
						<Mail className="size-6" />
						ob248@proton.me
					</a>
					<span className="text-fg/60">/</span>
					<a
						href="/cv.pdf"
						className="inline-flex items-center gap-2 hover:text-accent"
					>
						<Notes className="size-6" /> CV
					</a>
				</div>
				<div className="text-base text-fg">
					Age: <TimeSince date={new Date(2004, 10, 4, 11, 47, 0)} />
				</div>
			</div>
			{isTabsEnabled ? (
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as HomeTab)}
					className="w-full max-w-5xl gap-0"
				>
					<TabsList variant="line" className="h-auto w-full gap-0 p-0">
						<TabsTrigger
							value={homeTabs[0]}
							className="border-border -mr-[1px] after:hidden data-[state=active]:text-accent"
						>
							Work
						</TabsTrigger>
						<TabsTrigger
							value={homeTabs[1]}
							className="border-border after:hidden data-[state=active]:text-accent"
						>
							Travel
						</TabsTrigger>
					</TabsList>
					<div className="-mt-[1.5px] border p-2">
						<TabsContent value={homeTabs[0]}>
							<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
								{visibleProjects.map((project, index) => (
									<ProjectListItem
										key={project.metadata.slug}
										metadata={project.metadata}
										isDevMode={isDevMode}
										isActive={activeIndex !== null && index === activeIndex}
										enableHover={hasPointerInteraction}
									/>
								))}
							</div>
						</TabsContent>
						<TabsContent value={homeTabs[1]} />
					</div>
				</Tabs>
			) : (
				<div className="w-full max-w-5xl grid grid-cols-1 gap-2 md:grid-cols-2">
					{visibleProjects.map((project, index) => (
						<ProjectListItem
							key={project.metadata.slug}
							metadata={project.metadata}
							isDevMode={isDevMode}
							isActive={activeIndex !== null && index === activeIndex}
							enableHover={hasPointerInteraction}
						/>
					))}
				</div>
			)}
			<div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4">
				<div className="flex items-center gap-6">
					<AskAI name="me" inline />
				</div>
				<p className="text-xs text-fg/80 text-center text-pretty">
					arrows or hjkl, then enter
				</p>
				<div className="justify-self-center md:justify-self-end">
					<ThemeToggle />
				</div>
			</div>
		</div>
	);
}

function isInteractiveTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable) return true;
	const tagName = target.tagName;
	return (
		tagName === "INPUT" ||
		tagName === "TEXTAREA" ||
		tagName === "SELECT" ||
		tagName === "BUTTON" ||
		tagName === "A"
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
