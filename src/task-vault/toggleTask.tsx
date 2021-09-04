import { Vault, TAbstractFile, TFile, Events } from "obsidian";

import { Project, Task } from "./types";
import { fromMarkdown, toMarkdown } from "./tokenizer";

export const toggleTask = async function (vault: Vault, task: Task) {
  const { filePath, position } = task;
  const file = await vault.getAbstractFileByPath(filePath);
  const fileContents = await vault.cachedRead(file as TFile);

  const start = fileContents.slice(0, position.start.offset);
  const taskString = `- [${task.completed ? " " : "x"}] ${task.description}`;
  const end = fileContents.slice(position.end.offset);

  await vault.modify(file as TFile, start.concat(taskString, end));
};
