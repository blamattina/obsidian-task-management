import { Vault, TAbstractFile, TFile, Events } from "obsidian";

import { TaskList, Task } from "./types";
import { parseFile } from "./parseFile";

class VaultTasks extends Events {
  private index: Map<string, TaskList>;
  private vault: Vault;
  private markdownFiles: any;

  constructor(vault: Vault) {
    super();
    this.vault = vault;
    this.index = new Map<string, TaskList>();
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

  getTasks() {
    const taskLists = Array.from(this.index.values()).sort(
      (a: TaskList, b: TaskList): number => {
        return b.modifiedAt - a.modifiedAt;
      }
    );

    return taskLists;
  }
}

export { VaultTasks, TaskList, Task };