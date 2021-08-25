import { Vault, TFile } from "obsidian";

export const parseTasks = function (contents: string): Task[] {
  const todoRegex = /-\s+\[ \]\s(.+)/g;

  const matches = contents.matchAll(todoRegex);
  return Array.from(matches, (m: string) => {
    return {
      description: m[1],
      completed: false,
    };
  });
};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<TaskList> {
  const fileContents = await vault.cachedRead(file);

  return {
    name: file.name,
    basename: file.basename,
    path: file.path,
    tasks: parseTasks(fileContents),
    createdAt: file.stat.ctime,
    modifiedAt: file.stat.mtime,
    file,
  };
};
