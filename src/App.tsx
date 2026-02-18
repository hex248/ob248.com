import {
  Downasaur,
  Github,
  Home as HomeIcon,
  Image,
  ImageDelete,
  Mail,
  Notes,
} from "@nsmr/pixelart-react";
import { Fragment, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { type BlogEntry, blogPostList, blogPosts } from "@/blog";
import { AskAI } from "@/components/ask-ai";
import { BlogListItem } from "@/components/BlogListItem";
import { BlogPage } from "@/components/BlogPage";
import { ProjectListItem } from "@/components/ProjectListItem";
import { TimeSince } from "@/components/time-since";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ProjectEntry, projectList, projects } from "@/projects";
import { locationPhotos, locations } from "@/travel";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

const asciiFiles = [
  "cat-sleep.txt",
  "polar-bear.txt",
  "polar-bear-sitting.txt",
  "penguin-surfboard.txt",
  "cat-shock.txt",
  "exclamation.txt",
  "fat-cat-head.txt",
  "grumpy-dog.txt",
  "cat-peek.txt",
  "cat-loaf.txt",
];

const isBlogEnabled = import.meta.env.VITE_BLOG === "1";
const homeTabs = [
  "work",
  "travel",
  ...(isBlogEnabled ? ["blog"] : []),
] as const;
type HomeTab = (typeof homeTabs)[number];

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:slug" element={<ProjectRoute />} />
      <Route path="/blog/:slug" element={<BlogRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

function Home() {
  const isDevMode = import.meta.env.VITE_PUBLIC_DEV === "1";
  const navigate = useNavigate();
  const [asciiArt, setAsciiArt] = useState("");
  const [activeHomeTab, setActiveHomeTab] = useState<HomeTab>("work");
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(
    null,
  );
  const [activeBlogIndex, setActiveBlogIndex] = useState<number | null>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState<number | null>(
    null,
  );
  const [expandedLocationIndex, setExpandedLocationIndex] = useState<
    number | null
  >(null);
  const [previewPhotoPath, setPreviewPhotoPath] = useState<string | null>(null);
  const [travelFocusLevel, setTravelFocusLevel] = useState<
    "location" | "photo"
  >("location");
  const [activePhotoIndexByLocation, setActivePhotoIndexByLocation] = useState<
    Record<number, number | null>
  >({});
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
  const sortedBlogPosts: BlogEntry[] = [...blogPostList].sort(
    (a, b) =>
      parseDate(b.metadata.date).getTime() -
      parseDate(a.metadata.date).getTime(),
  );
  const visibleBlogPosts = sortedBlogPosts.filter(
    (post) => isDevMode || !post.metadata.hidden,
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
    setActiveProjectIndex((prev) => {
      if (visibleProjects.length === 0) return prev;
      if (prev === null) return null;
      return Math.min(prev, visibleProjects.length - 1);
    });
  }, [visibleProjects.length]);

  useEffect(() => {
    setActiveBlogIndex((prev) => {
      if (visibleBlogPosts.length === 0) return prev;
      if (prev === null) return null;
      return Math.min(prev, visibleBlogPosts.length - 1);
    });
  }, [visibleBlogPosts.length]);

  useEffect(() => {
    if (activeHomeTab !== "travel") {
      setTravelFocusLevel("location");
      return;
    }

    setActiveLocationIndex((prev) => {
      if (locations.length === 0) return null;
      if (prev === null) return 0;
      return clampIndex(prev, locations.length);
    });

    setExpandedLocationIndex((prev) => {
      if (prev === null || locations.length === 0) return null;
      return clampIndex(prev, locations.length);
    });
  }, [activeHomeTab]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Tab") {
        event.preventDefault();
        setActiveHomeTab((prev) => {
          const currentIndex = homeTabs.indexOf(prev);
          const safeIndex = currentIndex === -1 ? 0 : currentIndex;
          const nextIndex = (safeIndex + 1) % homeTabs.length;
          return homeTabs[nextIndex];
        });
        return;
      }

      if (isInteractiveTarget(event.target)) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (activeHomeTab === "work") {
        if (visibleProjects.length === 0) return;

        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const columns = isDesktop ? 2 : 1;

        let delta = 0;
        if (key === "ArrowLeft" || key === "h") delta = -1;
        if (key === "ArrowRight" || key === "l") delta = 1;
        if (key === "ArrowUp" || key === "k") delta = -columns;
        if (key === "ArrowDown" || key === "j") delta = columns;

        if (delta !== 0) {
          event.preventDefault();
          setActiveProjectIndex((prev) => {
            if (prev === null) return 0;
            return clampIndex(prev + delta, visibleProjects.length);
          });
          return;
        }

        if (key === "Enter") {
          if (activeProjectIndex === null) return;
          event.preventDefault();
          const target = visibleProjects[activeProjectIndex];
          if (!target) return;
          navigate(`/projects/${target.metadata.slug}`);
        }

        return;
      }

      if (activeHomeTab === "blog") {
        if (visibleBlogPosts.length === 0) return;

        const delta = getLinearDelta(key);
        if (delta !== 0) {
          event.preventDefault();
          setActiveBlogIndex((prev) => {
            if (prev === null) return 0;
            return clampIndex(prev + delta, visibleBlogPosts.length);
          });
          return;
        }

        if (key === "Enter") {
          if (activeBlogIndex === null) return;
          event.preventDefault();
          const target = visibleBlogPosts[activeBlogIndex];
          if (!target) return;
          navigate(`/blog/${target.metadata.slug}`);
        }

        return;
      }

      if (locations.length === 0) return;

      const expandedLocation =
        expandedLocationIndex === null
          ? null
          : locations[expandedLocationIndex];
      const expandedLocationPhotoList = expandedLocation
        ? (locationPhotos[expandedLocation.id] ?? [])
        : [];
      const isAtPhotoLevel =
        travelFocusLevel === "photo" &&
        expandedLocationIndex !== null &&
        expandedLocationPhotoList.length > 0;

      const locationDelta = getLinearDelta(key);
      if (isAtPhotoLevel) {
        if (expandedLocationIndex === null || !expandedLocation) return;

        const locationId = expandedLocation.id;
        const currentPhotoIndex = activePhotoIndexByLocation[locationId] ?? 0;

        if ((key === "ArrowUp" || key === "k") && currentPhotoIndex === 0) {
          event.preventDefault();
          setTravelFocusLevel("location");
          return;
        }

        if (
          (key === "ArrowDown" || key === "j") &&
          currentPhotoIndex === expandedLocationPhotoList.length - 1
        ) {
          event.preventDefault();
          setTravelFocusLevel("location");
          setActiveLocationIndex(
            clampIndex(expandedLocationIndex + 1, locations.length),
          );
          return;
        }

        if (locationDelta !== 0) {
          event.preventDefault();
          const nextPhotoIndex = clampIndex(
            currentPhotoIndex + locationDelta,
            expandedLocationPhotoList.length,
          );

          setActivePhotoIndexByLocation((prev) => ({
            ...prev,
            [locationId]: nextPhotoIndex,
          }));

          const nextPhotoName = expandedLocationPhotoList[nextPhotoIndex];
          if (nextPhotoName) {
            setPreviewPhotoPath(
              getTravelPhotoPath(expandedLocation, nextPhotoName),
            );
          }
          return;
        }

        return;
      }

      if (locationDelta !== 0) {
        if (
          (key === "ArrowUp" || key === "k") &&
          activeLocationIndex !== null
        ) {
          const nextLocationIndex = clampIndex(
            activeLocationIndex - 1,
            locations.length,
          );
          const nextLocation = locations[nextLocationIndex];
          const nextLocationPhotos = nextLocation
            ? (locationPhotos[nextLocation.id] ?? [])
            : [];
          const lastPhotoIndex = nextLocationPhotos.length - 1;
          const lastPhotoName = nextLocationPhotos[lastPhotoIndex];

          if (
            expandedLocationIndex === nextLocationIndex &&
            nextLocation &&
            lastPhotoName
          ) {
            event.preventDefault();
            setActiveLocationIndex(nextLocationIndex);
            setActivePhotoIndexByLocation((prev) => ({
              ...prev,
              [nextLocation.id]: lastPhotoIndex,
            }));
            setPreviewPhotoPath(
              getTravelPhotoPath(nextLocation, lastPhotoName),
            );
            setTravelFocusLevel("photo");
            return;
          }
        }

        if (
          activeLocationIndex !== null &&
          expandedLocationIndex === activeLocationIndex &&
          (key === "ArrowDown" || key === "j")
        ) {
          const location = locations[activeLocationIndex];
          const photoList = location ? (locationPhotos[location.id] ?? []) : [];
          const firstPhotoName = photoList[0];

          if (location && firstPhotoName) {
            event.preventDefault();
            setActivePhotoIndexByLocation((prev) => ({
              ...prev,
              [location.id]: 0,
            }));
            setPreviewPhotoPath(getTravelPhotoPath(location, firstPhotoName));
            setTravelFocusLevel("photo");
            return;
          }
        }

        event.preventDefault();
        setActiveLocationIndex((prev) => {
          if (prev === null) return 0;
          return clampIndex(prev + locationDelta, locations.length);
        });
        return;
      }

      if (key === "Enter") {
        if (activeLocationIndex === null) return;
        event.preventDefault();

        if (expandedLocationIndex === activeLocationIndex) {
          setExpandedLocationIndex(null);
          setPreviewPhotoPath(null);
          setTravelFocusLevel("location");
          return;
        }

        const location = locations[activeLocationIndex];
        if (!location) return;

        const photoList = locationPhotos[location.id] ?? [];
        setExpandedLocationIndex(activeLocationIndex);

        if (photoList.length === 0) {
          setPreviewPhotoPath(null);
          setTravelFocusLevel("location");
          return;
        }

        const nextPhotoIndex = clampIndex(
          activePhotoIndexByLocation[location.id] ?? 0,
          photoList.length,
        );
        const nextPhotoName = photoList[nextPhotoIndex];
        if (!nextPhotoName) return;

        setActivePhotoIndexByLocation((prev) => ({
          ...prev,
          [location.id]: nextPhotoIndex,
        }));
        setPreviewPhotoPath(getTravelPhotoPath(location, nextPhotoName));
        setTravelFocusLevel("photo");
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [
    activeHomeTab,
    activeBlogIndex,
    activeLocationIndex,
    activePhotoIndexByLocation,
    activeProjectIndex,
    expandedLocationIndex,
    navigate,
    travelFocusLevel,
    visibleBlogPosts,
    visibleProjects,
  ]);

  useEffect(() => {
    if (activeHomeTab !== "travel") return;
    if (travelFocusLevel !== "photo") return;
    if (expandedLocationIndex === null) return;

    const location = locations[expandedLocationIndex];
    if (!location) return;

    const activePhotoIndex = activePhotoIndexByLocation[location.id];
    if (activePhotoIndex === null || activePhotoIndex === undefined) return;

    const photoListElement = document.getElementById(
      getTravelPhotoListId(location.id),
    );
    const activePhotoElement = document.getElementById(
      getTravelPhotoItemId(location.id, activePhotoIndex),
    );

    if (!(photoListElement instanceof HTMLElement)) return;
    if (!(activePhotoElement instanceof HTMLElement)) return;

    const listRect = photoListElement.getBoundingClientRect();
    const activeRect = activePhotoElement.getBoundingClientRect();
    const isAbove = activeRect.top < listRect.top;
    const isBelow = activeRect.bottom > listRect.bottom;

    if (isAbove || isBelow) {
      activePhotoElement.scrollIntoView({ block: "nearest" });
    }
  }, [
    activeHomeTab,
    activePhotoIndexByLocation,
    expandedLocationIndex,
    travelFocusLevel,
  ]);

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
            className="inline-flex items-center gap-2 hover:text-accent pointer"
          >
            <Github className="size-6" />
            hex248
          </a>
          <span className="text-fg/60">/</span>
          <a
            href="mailto:ob248@proton.me"
            className="inline-flex items-center gap-2 hover:text-accent pointer"
          >
            <Mail className="size-6" />
            ob248@proton.me
          </a>
          <span className="text-fg/60">/</span>
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 hover:text-accent pointer"
          >
            <Notes className="size-6" /> CV
          </a>
        </div>
        <div className="text-base text-fg">
          Age: <TimeSince date={new Date(2004, 10, 4, 11, 47, 0)} />
        </div>
      </div>
      <Tabs
        value={activeHomeTab}
        onValueChange={(value) => setActiveHomeTab(value as HomeTab)}
        className="w-full max-w-5xl gap-0"
      >
        <TabsList
          variant="line"
          className="relative z-0 h-auto w-full gap-0 p-0"
        >
          <TabsTrigger
            data-keynav-nav="true"
            value={homeTabs[0]}
            className="border-border -mr-[1px] after:hidden data-[state=active]:text-accent focus-visible:ring-0 focus-visible:outline-none focus-visible:border-border"
          >
            Work
          </TabsTrigger>
          <TabsTrigger
            data-keynav-nav="true"
            value={homeTabs[1]}
            className="border-border after:hidden data-[state=active]:text-accent focus-visible:ring-0 focus-visible:outline-none focus-visible:border-border"
          >
            Travel
          </TabsTrigger>
          {isBlogEnabled && (
            <TabsTrigger
              data-keynav-nav="true"
              value="blog"
              className="border-border -ml-[1px] after:hidden data-[state=active]:text-accent focus-visible:ring-0 focus-visible:outline-none focus-visible:border-border"
            >
              Blog
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value={homeTabs[0]} className="relative z-10">
          <div className="-mt-[1.5px] border p-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {visibleProjects.map((project, index) => (
              <ProjectListItem
                key={project.metadata.slug}
                metadata={project.metadata}
                isDevMode={isDevMode}
                isActive={
                  activeProjectIndex !== null && index === activeProjectIndex
                }
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value={homeTabs[1]} className="relative z-10">
          <div className="-mt-[1px] grid grid-cols-1">
            {locations.map((location, index) => (
              <Fragment key={location.id}>
                <Button
                  data-keynav-nav="true"
                  className={cn(
                    "text-sm border pointer hover:border-accent justify-start w-full focus-visible:ring-0 focus-visible:outline-none focus-visible:border-border",
                    activeLocationIndex === index &&
                      activeHomeTab === "travel" &&
                      travelFocusLevel === "location" &&
                      "border-accent",
                  )}
                  onClick={(_e) => {
                    const isExpanded = expandedLocationIndex === index;
                    const photos = locationPhotos[location.id] ?? [];

                    setActiveLocationIndex(index);

                    if (isExpanded) {
                      setExpandedLocationIndex(null);
                      setTravelFocusLevel("location");
                      setPreviewPhotoPath(null);
                      return;
                    }

                    setExpandedLocationIndex(index);

                    if (photos.length === 0) {
                      setTravelFocusLevel("location");
                      setPreviewPhotoPath(null);
                      return;
                    }

                    const nextPhotoIndex = clampIndex(
                      activePhotoIndexByLocation[location.id] ?? 0,
                      photos.length,
                    );
                    const nextPhotoName = photos[nextPhotoIndex];
                    if (!nextPhotoName) {
                      setTravelFocusLevel("location");
                      setPreviewPhotoPath(null);
                      return;
                    }

                    setActivePhotoIndexByLocation((prev) => ({
                      ...prev,
                      [location.id]: nextPhotoIndex,
                    }));
                    setPreviewPhotoPath(
                      getTravelPhotoPath(location, nextPhotoName),
                    );
                    setTravelFocusLevel("photo");
                  }}
                  variant="dummy"
                  size="sm"
                >
                  {location.city}, {location.country} - {location.date}
                </Button>
                {expandedLocationIndex === index &&
                  (locationPhotos[location.id].length === 0 ? (
                    <div className="flex">
                      <div className="flex flex-col flex-1 ml-8">
                        <Button
                          disabled
                          className={cn(
                            "flex text-sm border pointer hover:border-accent items-center justify-start p-0 pl-2 w-full",
                          )}
                          variant="dummy"
                          size="sm"
                        >
                          <ImageDelete size={16} /> No photos available
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        id={getTravelPhotoListId(location.id)}
                        className="flex flex-col flex-1 ml-8 max-h-128 overflow-y-auto"
                      >
                        {locationPhotos[location.id].map(
                          (photo, photoIndex) => (
                            <Button
                              key={photo}
                              data-keynav-nav="true"
                              id={getTravelPhotoItemId(location.id, photoIndex)}
                              onClick={() => {
                                const path = getTravelPhotoPath(
                                  location,
                                  photo,
                                );
                                setActiveLocationIndex(index);
                                setExpandedLocationIndex(index);
                                setTravelFocusLevel("photo");
                                setActivePhotoIndexByLocation((prev) => ({
                                  ...prev,
                                  [location.id]: photoIndex,
                                }));
                                setPreviewPhotoPath(path);
                              }}
                              className={cn(
                                "flex text-sm border pointer hover:border-accent items-center justify-start p-0 pl-2 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-borde",
                                activeHomeTab === "travel" &&
                                  travelFocusLevel === "photo" &&
                                  activePhotoIndexByLocation[location.id] ===
                                    photoIndex &&
                                  "border-accent",
                              )}
                              variant="dummy"
                              size="sm"
                            >
                              <Image size={22} />
                              {photo}
                            </Button>
                          ),
                        )}
                      </div>
                      <div
                        className={
                          "flex-1 max-w-lg border flex items-center h-128 justify-center text-sm gap-4"
                        }
                      >
                        {previewPhotoPath ? (
                          <img
                            className={"flex-1 object-contain max-h-full"}
                            src={previewPhotoPath}
                            alt={"active-photo"}
                          />
                        ) : (
                          <span>
                            <ImageDelete />
                            No photo selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </Fragment>
            ))}
          </div>
        </TabsContent>
        {isBlogEnabled && (
          <TabsContent value="blog" className="relative z-10">
            <div className="-mt-[1.5px] border p-2 grid grid-cols-1 gap-2">
              {visibleBlogPosts.map((post, index) => (
                <BlogListItem
                  key={post.metadata.slug}
                  metadata={post.metadata}
                  isDevMode={isDevMode}
                  isActive={
                    activeBlogIndex !== null && index === activeBlogIndex
                  }
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
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

function clampIndex(index: number, itemCount: number): number {
  return Math.max(0, Math.min(itemCount - 1, index));
}

function getLinearDelta(key: string): number {
  if (key === "ArrowLeft" || key === "h" || key === "ArrowUp" || key === "k") {
    return -1;
  }
  if (
    key === "ArrowRight" ||
    key === "l" ||
    key === "ArrowDown" ||
    key === "j"
  ) {
    return 1;
  }
  return 0;
}

function getTravelPhotoPath(
  location: { city: string; country: string; date: string },
  photo: string,
): string {
  return `/travel/${location.city} ${location.country} ${location.date}/${photo}`;
}

function getTravelPhotoListId(locationId: number): string {
  return `travel-photo-list-${locationId}`;
}

function getTravelPhotoItemId(locationId: number, photoIndex: number): string {
  return `travel-photo-item-${locationId}-${photoIndex}`;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName;
  if (target.isContentEditable) return true;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }

  if (tagName === "BUTTON" || tagName === "A") {
    return !target.closest('[data-keynav-nav="true"]');
  }

  return false;
}

function ProjectRoute() {
  const { slug } = useParams();
  if (!slug || !projects[slug]) return <NotFound />;

  const { Component } = projects[slug];
  return <Component />;
}

function BlogRoute() {
  const { slug } = useParams();
  if (!isBlogEnabled || !slug || !blogPosts[slug]) return <NotFound />;

  const { metadata, content } = blogPosts[slug];
  return <BlogPage metadata={metadata} content={content} />;
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

      <Link to="/" className={"pointer"}>
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
