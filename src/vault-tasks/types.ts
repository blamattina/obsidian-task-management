import { TFile } from "obsidian";

export type TaskList = {
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
  description: string;
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
