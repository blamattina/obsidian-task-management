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
    container.addClass("markdown-preview-view");

    const allTasks = this.vaultTasks.getTasks();
    console.log(allTasks);

    for (const [file, tasks] of allTasks) {
      if (tasks.length) {
        container.createDiv(
          "task-management-file-name",
          (el) => (el.innerHTML = `<h4>${file}</h4>`)
        );
        for (const task of tasks) {
          container.createDiv("task-management-todo", (el) => {
            MarkdownRenderer.renderMarkdown(task, el);
          });
        }
      }
    }

    console.log(container);

    return;
  }
}
