import { Vault, TFile } from "obsidian";

export const parseTasks = function (contents: string): Task[] {
  const todoRegex = /-\s*\[( |x)\]\s(.+)/gi;

  const matches = contents.matchAll(todoRegex);
  return Array.from(matches, (match: RegExpMatchArray) => {
    return {
      description: match[2],
      index: match.index,
      completed: match[1] !== " ",
    };
  });
};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<TaskList> {
  const fileContents = await vault.cachedRead(file);
  const tasks = parseTasks(fileContents);

  return {
    name: file.name,
    basename: file.basename,
    path: file.path,
    createdAt: file.stat.ctime,
    modifiedAt: file.stat.mtime,
    completed: !!tasks.filter((task) => !task.completed).length,
    tasks,
    file,
  };
};
