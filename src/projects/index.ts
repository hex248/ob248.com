import type { ComponentType } from "react";
import { FactorEProject, metadata as factorEMetadata } from "./factor-e";
import { FlackieProject, metadata as flackieMetadata } from "./flackie";
import { FontsProject, metadata as fontsMetadata } from "./fonts";
import { GitChunkerProject, metadata as gitChunkerMetadata } from "./gitchunker";
import { GlimpseProject, metadata as glimpseMetadata } from "./glimpse";
import {
  GoodMorningProject,
  metadata as goodMorningMetadata,
} from "./good-morning";
import { MizuProject, metadata as mizuMetadata } from "./mizu";
import { PrayerbudProject, metadata as prayerbudMetadata } from "./prayerbud";
import { ShleepProject, metadata as shleepMetadata } from "./shleep";
import { SprintProject, metadata as sprintMetadata } from "./sprint";
import {
  WatercoolerProject,
  metadata as watercoolerMetadata,
} from "./watercooler";
import { WiskatronProject, metadata as wiskatronMetadata } from "./wiskatron";

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
  [factorEMetadata.slug]: {
    metadata: factorEMetadata,
    Component: FactorEProject,
  },
  [fontsMetadata.slug]: {
    metadata: fontsMetadata,
    Component: FontsProject,
  },
  [flackieMetadata.slug]: {
    metadata: flackieMetadata,
    Component: FlackieProject,
  },
  [gitChunkerMetadata.slug]: {
    metadata: gitChunkerMetadata,
    Component: GitChunkerProject,
  },
  [glimpseMetadata.slug]: {
    metadata: glimpseMetadata,
    Component: GlimpseProject,
  },
  [goodMorningMetadata.slug]: {
    metadata: goodMorningMetadata,
    Component: GoodMorningProject,
  },
  [mizuMetadata.slug]: {
    metadata: mizuMetadata,
    Component: MizuProject,
  },
  [prayerbudMetadata.slug]: {
    metadata: prayerbudMetadata,
    Component: PrayerbudProject,
  },
  [shleepMetadata.slug]: {
    metadata: shleepMetadata,
    Component: ShleepProject,
  },
  [sprintMetadata.slug]: {
    metadata: sprintMetadata,
    Component: SprintProject,
  },
  [watercoolerMetadata.slug]: {
    metadata: watercoolerMetadata,
    Component: WatercoolerProject,
  },
  [wiskatronMetadata.slug]: {
    metadata: wiskatronMetadata,
    Component: WiskatronProject,
  },
} satisfies Record<string, ProjectEntry>;

export const projectList = Object.values(projects);
