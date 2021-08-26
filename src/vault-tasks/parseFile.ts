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
