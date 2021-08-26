import React from "react";
import ReactDOM from "react-dom";
import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";

import { VaultTasks } from "../vault-tasks";
import { VIEW_TYPE } from "../constants";
import { TaskLeaf } from "./task-leaf";

export class TaskLeafContainer extends ItemView {
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

  onOpen() {
    const container = this.containerEl.children[1];

    ReactDOM.render(<TaskLeaf vaultTasks={this.vaultTasks} />, container);
  }
}
