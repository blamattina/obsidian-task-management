import { Vault, TAbstractFile, TFile, Events } from "obsidian";
import { Task, Project, ProjectItem, isHeading, isTask } from "./types";
import { TaskDb } from "./db";
import { parseFile } from "./parseFile";
import { toggleTask } from "./toggleTask";

const incompleteProjects = (p: Project) => p.completed;
const mostRecentlyUpdated = (a: Project, b: Project) => {
  return b.modifiedAt - a.modifiedAt;
};

class TaskVault extends Events {
  private vault: Vault;
  private markdownFiles: any;
  private db: TaskDb;

  constructor(vault: Vault) {
    super();
    this.vault = vault;
  }

  private async indexFile(file: TAbstractFile): Promise<void> {
    if (!(file instanceof TFile)) return;

    console.log(`Deleting ${file.path} from the task db`);
    await this.db.deleteProject(file.path);
    console.log(`Parsing ${file.path}`);
    const project = await parseFile(this.vault, file as TFile);
    console.log(`Saving ${file.path} to the task db`);
    await this.db.addProject(project);
    console.log(`Triggering update`);
    this.trigger("update");
  }

  private async deleteFile(file: TAbstractFile): Promise<void> {
    if (!(file instanceof TFile)) return;

    await this.db.deleteProject(file.path);
    this.trigger("update");
  }

  async initialize(): Promise<void> {
    const files = this.vault.getMarkdownFiles();

    this.db = new TaskDb();
    await this.db.initialize();

    for (const file of files) {
      const existingProject = await this.db.getProject(file.path);

      if (existingProject && existingProject.modifiedAt === file.stat.mtime) {
        console.log(`Skipping ${file.path}`);
      } else {
        await this.db.deleteProject(file.path);

        const project = await parseFile(this.vault, file);
        await this.db.deleteProject(file.path);
        await this.db.addProject(project);
      }
    }

    this.vault.on("create", this.indexFile.bind(this));
    this.vault.on("modify", this.indexFile.bind(this));
    this.vault.on("delete", this.deleteFile.bind(this));

    this.trigger("initialized");
  }

  async getProjects(
    predicate = incompleteProjects,
    sortFn = mostRecentlyUpdated
  ): Promise<Project[]> {
    return await this.db.getProjects(predicate, sortFn);
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    await toggleTask(this.vault, task);
  }
}

export { TaskVault, Task, Project, ProjectItem, isHeading, isTask };
