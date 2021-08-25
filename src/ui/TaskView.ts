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

    for (const [path, taskList] of allTasks) {
      if (taskList.tasks.length) {
        container.createDiv(
          "task-management-file-name",
          (el) => (el.innerHTML = `<h4>${taskList.basename}</h4>`)
        );
        for (const task of taskList.tasks) {
          container.createDiv("task-management-todo", (el) => {
            MarkdownRenderer.renderMarkdown(task.description, el);
          });
        }
      }
    }

    console.log(container);

    return;
  }
}
