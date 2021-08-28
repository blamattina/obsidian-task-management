import { Vault, TAbstractFile, TFile, Events } from "obsidian";

import { Project, Task } from "./types";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export const toggleTask = async function (vault: Vault, task: Task) {
  const todoRegex = new RegExp(
    "-\\s*\\[( |x)\\]\\s" + escapeRegExp(task.description),
    "gi"
  );
  const fileContents = await vault.cachedRead(task.file);
  const newContents = fileContents.replace(todoRegex, (substring, ...args) => {
    console.log(substring, task);
    return `- [${task.completed ? " " : "x"}] ${task.description}`;
  });

  await vault.modify(task.file, newContents);
};
