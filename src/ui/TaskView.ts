import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";
import { VaultTasks } from "../vault-tasks";
import { VIEW_TYPE } from "../constants";

export class TaskListView extends ItemView {
  private vaultTasks: VaultTasks;

  constructor(leaf: WorkspaceLeaf, vaultTasks: VaultTasks) {
    super(leaf);
    this.vaultTasks = vaultTasks;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }
  getDisplayText(): string {
    return "Task List";
  }

  getIcon(): string {
    return "checkmark";
  }

  render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("markdown-preview-view");

    const allTasks = this.vaultTasks.getTasks();

    for (const taskList of allTasks) {
      if (taskList.tasks.length) {
        container.createDiv(
          "task-management-file-name",
          (el) => (el.innerHTML = `<h4>${taskList.basename}</h4>`)
        );
        for (const task of taskList.tasks) {
          container.createDiv("task-management-todo", (el) => {
            el.createDiv("todo-item-view-item-checkbox", (el) => {
              el.createEl("input", { type: "checkbox" }, (el) => {
                el.checked = task.completed;
                el.onClickEvent(() => {
                  console.log("clicked on", task);
                });
              });
            });
            MarkdownRenderer.renderMarkdown(task.description, el);
          });
        }
      }
    }
  }

  onOpen() {
    this.vaultTasks.on("initialized", () => {
      this.render();
    });

    this.vaultTasks.on("update", () => {
      this.render();
    });
  }
}
