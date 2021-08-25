import { Vault, TFile } from "obsidian";

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
    console.log(m);

    return {
      description: m[1],
      completed: false,
    };
  });
};

const parseFile = async function (file: TFile): Promise<TaskList> {
  const fileContents = await this.vault.cachedRead(file);

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

class VaultTasks {
  private index: Map<string, TaskList>;
  private vault: Vault;
  private markdownFiles: any;

  constructor(vault: Vault) {
    this.vault = vault;
    this.index = new Map<string, TaskList>();
  }

  async initialize(): Promise<void> {
    console.log(this.vault);
    const files = this.vault.getMarkdownFiles();

    for (const file of files) {
      const fileContents = await this.vault.cachedRead(file);
      const taskList = {
        name: file.name,
        basename: file.basename,
        path: file.path,
        tasks: parseTasks(fileContents),
        createdAt: file.stat.ctime,
        modifiedAt: file.stat.mtime,
        file,
      };

      const tasks = parseTasks(fileContents);
      this.index.set(file.path, taskList);
    }
  }

  getTasks() {
    return this.index;
  }
}

export { VaultTasks };
