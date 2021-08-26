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

import { TaskListView } from "./ui/TaskView";
import { VaultTasks } from "./vault-tasks";
import { VIEW_TYPE } from "./constants";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  vaultTasks: VaultTasks;

  constructor(app: App, mainfest: PluginManifest) {
    super(app, mainfest);
    this.vaultTasks = new VaultTasks(this.app.vault);
  }

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();

    this.addRibbonIcon("dice", "Sample Plugin", () => {
      new Notice("This is a notice!");
    });

    this.addStatusBarItem().setText("Status Bar Text");

    this.addCommand({
      id: "open-sample-modal",
      name: "Open Sample Modal",
      // callback: () => {
      //	console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new SampleModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });

    const { vaultTasks } = this;

    this.registerView(VIEW_TYPE, (leaf: WorkspaceLeaf) => {
      const view = new TaskListView(leaf, this.vaultTasks);
      return view;
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log("codemirror", cm);
    });

    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );

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
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
    });
    await this.vaultTasks.initialize();
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
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

    const desc = Array.from(this.plugin.vaultTasks.getTasks().entries());
    console.log(desc);

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc(JSON.stringify(desc))
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
