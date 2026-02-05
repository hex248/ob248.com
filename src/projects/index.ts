import type { ComponentType } from "react";
import { SprintProject, metadata as sprintMetadata } from "./sprint";

export type ProjectMetadata = {
	title: string;
	description: string;
	date: string;
	slug: string;
	image?: string | null;
	url?: string;
	github?: string;
	hidden: boolean;
	tags?: string[];
	type: string;
};

export type ProjectEntry = {
	metadata: ProjectMetadata;
	Component: ComponentType;
};

export const projects = {
	[sprintMetadata.slug]: {
		metadata: sprintMetadata,
		Component: SprintProject,
	},
} satisfies Record<string, ProjectEntry>;

export const projectList = Object.values(projects);
