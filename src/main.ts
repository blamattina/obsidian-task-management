import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginManifest,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from "obsidian";

import { TaskLeafContainer } from "./ui/task-leaf-container";
import { TaskVault } from "./task-vault";
import { VIEW_TYPE } from "./constants";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  vaultTasks: TaskVault;

  constructor(app: App, mainfest: PluginManifest) {
    super(app, mainfest);
    this.vaultTasks = new TaskVault(this.app.vault);
  }

  async onload() {
    await this.loadSettings();

    const { vaultTasks } = this;

    this.registerView(VIEW_TYPE, (leaf: WorkspaceLeaf) => {
      const view = new TaskLeafContainer(leaf, this.vaultTasks);
      return view;
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));

    if (this.app.workspace.layoutReady) {
      this.initialize();
    } else {
      this.registerEvent(
        this.app.workspace.on(
          "layout-ready",
          async () => await this.initialize()
        )
      );
    }
  }

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async initialize() {
    if (!this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      this.app.workspace.getRightLeaf(false).setViewState({
        type: VIEW_TYPE,
      });
    }
    await this.vaultTasks.initialize();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("Desc")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
