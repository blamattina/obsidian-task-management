import { Vault, TAbstractFile, TFile, Events } from "obsidian";
import { Task, Project, ProjectItem, isHeading } from "./types";
import { parseFile } from "./parseFile";
import { toggleTask } from "./toggleTask";

class VaultTasks extends Events {
  private index: Map<string, Project>;
  private vault: Vault;
  private markdownFiles: any;

  constructor(vault: Vault) {
    super();
    this.vault = vault;
    this.index = new Map<string, Project>();
  }

  private async indexFile(file: TAbstractFile) {
    if (!(file instanceof TFile)) return;

    const taskList = await parseFile(this.vault, file as TFile);
    this.index.set(file.path, taskList);
    this.trigger("update");
  }

  private deleteFile(file: TAbstractFile) {
    if (!(file instanceof TFile)) return;

    this.index.delete(file.path);
    this.trigger("update");
  }

  async initialize(): Promise<void> {
    const files = this.vault.getMarkdownFiles();

    for (const file of files) {
      const taskList = await parseFile(this.vault, file);
      this.index.set(file.path, taskList);
    }

    this.vault.on("create", this.indexFile.bind(this));
    this.vault.on("modify", this.indexFile.bind(this));
    this.vault.on("delete", this.deleteFile.bind(this));

    this.trigger("initialized");
  }

  getProjects(): Project[] {
    const projects = Array.from(this.index.values()).sort(
      (a: Project, b: Project): number => {
        return b.modifiedAt - a.modifiedAt;
      }
    );

    return projects;
  }

  async toggleTaskStatus(task: Task) {
    await toggleTask(this.vault, task);
  }
}

export { VaultTasks, Task, Project, ProjectItem, isHeading };
