import { Vault } from "obsidian";

const parseTasks = function (contents: string): string[] {
  const todoRegex = /\s*-\s+\[ \]\s(.+)/g;

  if (!todoRegex.test(contents)) {
    return [];
  }

  const matches = contents.matchAll(todoRegex);
  return Array.from(matches, (m: string) => m[1]);
};

class VaultTasks {
  private index: Map<string, string[]>;
  private vault: Vault;
  private markdownFiles: any;

  constructor(vault: Vault) {
    this.vault = vault;
    this.index = new Map<string, string[]>();
  }

  async initialize(): Promise<void> {
    console.log(this.vault);
    const files = this.vault.getMarkdownFiles();

    for (const file of files) {
      const fileContents = await this.vault.cachedRead(file);
      const tasks = parseTasks(fileContents);
      this.index.set(file.path, tasks);
    }
  }

  getTasks() {
    return this.index;
  }
}

export { VaultTasks };
