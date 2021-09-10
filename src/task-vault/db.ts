import {
  Project,
  ProjectItem,
  ProjectQuery,
  Task,
  isHeading,
  isTask,
} from "./types";
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
  const tasks = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });

  tasks.createIndex("filePath", "filePath", { unique: false });
};

export const hydrateProject = (transaction: IDBTransaction) => async (
  project: Project
) => {
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
          project.children.map(createProjectItem(transaction, project))
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

  async getTasks(): Promise<Task[]> {
    return await transact(
      this.db.transaction(["projects", "headings", "tasks"], "readwrite"),
      async (transaction: IDBTransaction): Promise<Task[]> => {
        const tasksStore = transaction.objectStore("tasks");
        const taskIndex = tasksStore.index("filePath");
        const projectStore = transaction.objectStore("projects");

        let results = (await find(
          projectStore.openCursor(),
          (p) => p.completed
        )) as any[];

        results = await Promise.all(
          results.map(async (project) => {
            let tasks = (await find(
              taskIndex.openCursor(IDBKeyRange.only(project.path)),
              (task: Task) => !task.completed
            )) as Task[];

            let p = await hydrateProject(transaction)(project);

            const pruneCompleted = (acc, item) => {
              if ("children" in item) {
                item.children = item.children.reduceRight(pruneCompleted, []);
              }

              if ("completed" in item && item.completed) {
                return acc.concat(item.children);
              }

              if ("depth" in item && acc[0] && "depth" in acc[0]) return acc;
              if ("depth" in item && !acc[0]) return acc;

              acc.unshift(item);
              return acc;
            };

            p.children = p.children.reduceRight(pruneCompleted, []);
            return p;
          })
        );

        return results.sort((a: Task, b: Task) => {
          return b.modifiedAt - a.modifiedAt;
        });
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
