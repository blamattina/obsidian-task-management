import { TFile } from "obsidian";

export type ProjectItem = Heading | List | Task;

export type PositionLocator = {
  line: number;
  column: number;
  offset: number;
};

export type Position = {
  start: PositionLocator;
  end: PositionLocator;
};

export type Project = {
  name: string;
  basename: string;
  path: string;
  completed: boolean;
  createdAt: number;
  modifiedAt: number;
  children: ProjectItem[];
};

export type Heading = {
  name: string;
  depth: number;
  position: Position;
  filePath: string;
};

export type List = {
  children: ProjectItem[];
  filePath: string;
};

export type Task = {
  description: string;
  completed: boolean;
  children: ProjectItem[];
  position: Position;
  filePath: string;
};

export function isHeading(obj: any): obj is Heading {
  return obj && typeof obj.name === "string" && typeof obj.depth === "number";
}

export function isTask(obj: any): obj is Task {
  return obj && typeof obj.completed === "boolean";
}

export type ProjectQuery = {
  projectPredicate(project: Project): boolean;
  projectSort(a: Project, b: Project): number;
};
