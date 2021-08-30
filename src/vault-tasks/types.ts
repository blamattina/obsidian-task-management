import { TFile } from "obsidian";

export type ProjectItem = Heading | Task;

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
  file: TFile;
};

export type Heading = {
  name: string;
  depth: number;
  position: Position;
  file: TFile;
};

export type Task = {
  description: string;
  completed: boolean;
  children: ProjectItem[];
  position: Position;
  file: TFile;
};

export function isHeading(obj: any): obj is Heading {
  return obj && typeof obj.name === "string" && typeof obj.depth === "number";
}
