import { TFile } from "obsidian";

export type TaskList = {
  name: string;
  basename: string;
  path: string;
  completed: boolean;
  createdAt: number;
  modifiedAt: number;
  tasks: Task[];
  file: TFile;
};

export type Task = {
  description: string;
  index: number;
  completed: boolean;
  file: TFile;
};
