import React from "react";
import ReactDOM from "react-dom";
import {
  ItemView,
  WorkspaceLeaf,
  MarkdownRenderer,
  TFile,
  Menu,
} from "obsidian";

import { TaskVault } from "../task-vault";
import { VIEW_TYPE } from "../constants";
import { TaskLeaf } from "./task-leaf";

export class TaskLeafContainer extends ItemView {
  private vaultTasks: TaskVault;

  constructor(leaf: WorkspaceLeaf, vaultTasks: TaskVault) {
    super(leaf);
    this.vaultTasks = vaultTasks;
  }

  public getViewType(): string {
    return VIEW_TYPE;
  }
  public getDisplayText(): string {
    return "Task List";
  }

  public getIcon(): string {
    return "checkmark";
  }

  public async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];

    ReactDOM.render(
      <TaskLeaf
        vaultTasks={this.vaultTasks}
        openFile={this.openFile.bind(this)}
      />,
      container
    );
  }

  private async openFile(path: string): Promise<void> {
    const leaf = this.app.workspace.getUnpinnedLeaf();
    const file = await this.app.vault.getAbstractFileByPath(path);
    await leaf.openFile(file as TFile);
  }
}
