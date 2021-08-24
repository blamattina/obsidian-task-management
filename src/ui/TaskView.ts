import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";
import { VaultTasks } from "../vault-tasks";

export class TaskListView extends ItemView {
  private vaultTasks: VaultTasks;

  constructor(leaf: WorkspaceLeaf, vaultTasks: VaultTasks) {
    super(leaf);
    this.vaultTasks = vaultTasks;
  }

  getViewType(): string {
    return "com.foo.test";
  }
  getDisplayText(): string {
    return "foo";
  }

  getIcon(): string {
    return "checkmark";
  }

  onOpen(): Promise<void> {
    const container = this.containerEl.children[1];

    const allTasks = this.vaultTasks.getTasks();
    console.log(allTasks);

    for (const [file, tasks] of allTasks) {
      if (tasks.length) {
        console.log(file);

        container.createDiv("foo", (el) => (el.innerHTML = `<h1>${file}</h1>`));
        for (const task of tasks) {
          container.createDiv("foo", (el) => {
            MarkdownRenderer.renderMarkdown(task, el);
          });
        }
      }
    }

    console.log(container);

    return;
  }
}
