import { Project, ProjectItem, ProjectQuery, isHeading, isTask } from "./types";
import {
  createProjectItem,
  readProjectItem,
  deleteProjectItem,
} from "./project-item-utils";
import { transact, request, initializeDb, find } from "./db-utils";

const DB = "obsidian-task-management";
const VERSION = 1;
const identity = (f: any): any => f;

const upgradeFn = (event: any) => {
  const db = event.target.result;

  db.createObjectStore("projects", {
    keyPath: "path",
    autoIncrement: false,
  });
  db.createObjectStore("headings", {
    keyPath: "id",
    autoIncrement: true,
  });
  db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
};

export const hydrateProject = (transaction) => async (project: any) => {
  project.children = await Promise.all(
    project.children.map(readProjectItem(transaction))
  );

  return project;
};

export class TaskDb {
  private db: IDBDatabase;

  async initialize() {
    this.db = await initializeDb(DB, VERSION, upgradeFn);
  }

  async addProject(project: Project) {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction) => {
        project.children = await Promise.all(
          project.children.map(createProjectItem(transaction))
        );
        const projectStore = transaction.objectStore("projects");
        return await request(projectStore.put(project));
      }
    );
  }

  async getProject(projectPath: string): Promise<Project> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction) => {
        const projectStore = transaction.objectStore("projects");

        const project = (await request(
          projectStore.get(projectPath)
        )) as Project;

        if (!project) return null;

        return await hydrateProject(transaction)(project);
      }
    );
  }

  async getProjects({
    projectPredicate,
    projectSort,
  }: ProjectQuery): Promise<Project[]> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction): Promise<Project[]> => {
        const projectStore = transaction.objectStore("projects");
        let results = (await find(
          projectStore.openCursor(),
          projectPredicate
        )) as any[];

        results = (await Promise.all(
          results.map(hydrateProject(transaction))
        )) as Project[];

        return results.sort(projectSort);
      }
    );
  }

  async deleteProject(projectPath: string): Promise<void> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction): Promise<void> => {
        const projectStore = transaction.objectStore("projects");

        const project = (await request(
          projectStore.get(projectPath)
        )) as Project;

        if (!project) return null;

        await Promise.all(project.children.map(deleteProjectItem(transaction)));

        await projectStore.delete(projectPath);
      }
    );
  }
}
