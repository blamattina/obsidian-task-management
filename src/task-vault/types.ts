import { TFile } from "obsidian";

export type ProjectItem = Heading | Task;
export type StoredProjectItem = Heading | StoredTask;

export type PositionLocator = {
  line: number;
  column: number;
  offset: number;
};

export type Relationship = ["headings" | "tasks", number];

export type Position = {
  start: PositionLocator;
  end: PositionLocator;
};

export type StoredProject = {
  name: string;
  basename: string;
  path: string;
  completed: boolean;
  createdAt: number;
  modifiedAt: number;
  children: Relationship[];
};

export type StoredTask = {
  id?: number;
  type?: string;
  description: string;
  completed: boolean;
  children: Relationship[];
  position: Position;
  filePath: string;
  createdAt?: number;
  modifiedAt?: number;
};

export interface Project extends Omit<StoredProject, "children"> {
  children: ProjectItem[];
}

export interface Task extends Omit<StoredTask, "children"> {
  children: ProjectItem[];
}

export type Heading = {
  id?: number;
  type?: string;
  name: string;
  depth: number;
  position: Position;
  filePath: string;
  createdAt?: number;
  modifiedAt?: number;
};

export function isHeading(obj: any): obj is Heading {
  return obj && typeof obj.name === "string" && typeof obj.depth === "number";
}

export function isTask(obj: any): obj is Task {
  return obj && typeof obj.completed === "boolean";
}

export type TaskPredicate = (task: Task) => boolean;

export type ProjectQuery = {
  projectPredicate(project: Project): boolean;
  taskPredicate: TaskPredicate;
  projectSort(a: Project, b: Project): number;
};
