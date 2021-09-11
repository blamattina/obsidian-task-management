import {
  Project,
  StoredProject,
  ProjectItem,
  ProjectQuery,
  Task,
  TaskPredicate,
  isHeading,
  isTask,
} from "./types";
import {
  createProjectItem,
  readProjectItem,
  deleteProjectItem,
  pruneTasks,
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
  const tasks = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });

  tasks.createIndex("filePath", "filePath", { unique: false });
};

export const hydrateProject = (
  transaction: IDBTransaction,
  taskPredicate: TaskPredicate
) => async (project: StoredProject): Promise<Project> => {
  const children = await Promise.all(
    project.children.map(readProjectItem(transaction))
  );
  return {
    ...project,
    children: children.reduceRight(pruneTasks(taskPredicate), []),
  };
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
          project.children.map(createProjectItem(transaction, project))
        );
        const projectStore = transaction.objectStore("projects");
        return await request(projectStore.put(project));
      }
    );
  }

  async getProject(
    projectPath: string,
    taskPredicate: TaskPredicate
  ): Promise<Project> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction) => {
        const projectStore = transaction.objectStore("projects");

        const project = await request<StoredProject>(
          projectStore.get(projectPath)
        );

        if (!project) return null;

        return await hydrateProject(transaction, taskPredicate)(project);
      }
    );
  }

  async getProjects({
    projectPredicate,
    taskPredicate,
    projectSort,
  }: ProjectQuery): Promise<Project[]> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction): Promise<Project[]> => {
        const projectStore = transaction.objectStore("projects");
        let results = await find<StoredProject>(
          projectStore.openCursor(),
          projectPredicate
        );

        results = await Promise.all<Project>(
          results.map(hydrateProject(transaction, taskPredicate))
        );

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
