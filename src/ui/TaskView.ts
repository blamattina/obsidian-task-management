import { ItemView } from "obsidian";

export class TaskListView extends ItemView {
  getViewType(): string {
    return "com.foo.test";
  }
  getDisplayText(): string {
    return "foo";
  }

  getIcon(): string {
    return "checkmark";
  }

  onOpen(): void {
    const container = this.containerEl.children[1];
    container.innerHTML = "hi";
  }
}
