import { TFile } from "obsidian";

export type ProjectItem = Heading | Task;

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
};

export type Task = {
  description: string;
  completed: boolean;
  children: ProjectItem[];
};

export function isHeading(obj: any): obj is Heading {
  return obj && typeof obj.name === "string" && typeof obj.depth === "number";
}
