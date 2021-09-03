import React from "react";
import ReactDOM from "react-dom";
import { ItemView, WorkspaceLeaf, MarkdownRenderer } from "obsidian";

import { TaskVault } from "../task-vault";
import { VIEW_TYPE } from "../constants";
import { TaskLeaf } from "./task-leaf";

export class TaskLeafContainer extends ItemView {
  private vaultTasks: TaskVault;

  constructor(leaf: WorkspaceLeaf, vaultTasks: TaskVault) {
    super(leaf);
    console.log("wtf", this.app);
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

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];

    ReactDOM.render(
      <TaskLeaf
        vaultTasks={this.vaultTasks}
        openFile={this.openFile.bind(this)}
      />,
      container
    );
  }

  private async openFile(file: any) {
    console.log(file);
    const leaf = this.app.workspace.getUnpinnedLeaf();
    await leaf.openFile(file);
  }

  toggleTask(file: any) {}
}
