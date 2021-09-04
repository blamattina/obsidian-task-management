import { Project, ProjectItem, isHeading, isTask } from "./types";
import {
  createProjectItem,
  readProjectItem,
  deleteProjectItem,
} from "./project-item-utils";
import { transact, request, initializeDb, find } from "./db-utils";

const DB = "obsidian-task-management";
const VERSION = 1;
const identity = (f) => f;
const mostRecentlyUpdated = (a: Project, b: Project) => {
  return b.modifiedAt - a.modifiedAt;
};

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
  db.createObjectStore("lists", {
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
      this.db.transaction(
        ["projects", "headings", "lists", "tasks"],
        "readwrite"
      ),
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
      this.db.transaction(
        ["projects", "headings", "lists", "tasks"],
        "readwrite"
      ),
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

  async getProjects(
    predicate = identity,
    sortFn = mostRecentlyUpdated
  ): Promise<any> {
    return await transact(
      this.db.transaction(
        ["projects", "headings", "lists", "tasks"],
        "readwrite"
      ),
      async (transaction: IDBTransaction) => {
        const projectStore = transaction.objectStore("projects");
        let results = (await find(
          projectStore.openCursor(),
          predicate || identity
        )) as any[];

        results = (await Promise.all(
          results.map(hydrateProject(transaction))
        )) as Project[];

        return results.sort(sortFn);
      }
    );
  }

  async deleteProject(projectPath: string): Promise<Project> {
    return await transact(
      this.db.transaction(
        ["projects", "headings", "lists", "tasks"],
        "readwrite"
      ),
      async (transaction: IDBTransaction) => {
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
