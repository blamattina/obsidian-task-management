import { Vault, TAbstractFile, TFile, Events } from "obsidian";

export type TaskList = {
  name: string;
  basename: string;
  path: string;
  createdAt: number;
  modifiedAt: number;
  tasks: Task[];
  file: TFile;
};

export type Task = {
  description: string;
  completed: boolean;
};

const parseTasks = function (contents: string): Task[] {
  const todoRegex = /-\s+\[ \]\s(.+)/g;

  const matches = contents.matchAll(todoRegex);
  return Array.from(matches, (m: string) => {
    return {
      description: m[1],
      completed: false,
    };
  });
};

const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<TaskList> {
  const fileContents = await vault.cachedRead(file);

  return {
    name: file.name,
    basename: file.basename,
    path: file.path,
    tasks: parseTasks(fileContents),
    createdAt: file.stat.ctime,
    modifiedAt: file.stat.mtime,
    file,
  };
};

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

export { VaultTasks };
