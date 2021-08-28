import { TFile } from "obsidian";

export type Project = {
  name: string;
  basename: string;
  path: string;
  completed: boolean;
  createdAt: number;
  modifiedAt: number;
  children: (Heading | Task)[];
  file: TFile;
};

export type Heading = {
  name: string;
  depth: number;
};

export type List = {
  children: Task[];
};

export type Task = {
  description: string;
  index: number;
  completed: boolean;
  children: Task[];
  file: TFile;
};

export function isHeading(obj: any): obj is Heading {
  return obj && typeof obj.name === "string" && typeof obj.depth === "number";
}

export function isList(obj: any): obj is List {
  return obj && Array.isArray(obj.children) && Object.keys(obj) === 1;
}
