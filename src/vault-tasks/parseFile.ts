import { Vault, TFile } from "obsidian";
import { fromMarkdown, toMarkdown } from "./tokenizer";

const convertNodesToMarkdown = (...nodes: any) => {
  return toMarkdown({
    type: "root",
    children: nodes,
  });
};

export const parseTasks = function (contents: string, file: TFile): Task[] {
  const todoRegex = /-\s*\[( |x)\]\s(.+)/gi;

  const matches = contents.matchAll(todoRegex);
  return Array.from(matches, (match: RegExpMatchArray) => {
    return {
      description: match[2],
      index: match.index,
      completed: match[1] !== " ",
      file,
    };
  });
};

const parse = (child) => {
  switch (child.type) {
    case "heading": {
      return {
        name: convertNodesToMarkdown(...child.children),
        depth: child.depth,
      };
    }

    case "list": {
      const children = child.children.map(parse).filter((c) => !!c);

      if (children.length) {
        return {
          children,
        };
      }
    }

    case "listItem": {
      if (typeof child.checked === "boolean") {
        const [paragraph, ...others] = child.children;
        return {
          description: convertNodesToMarkdown(paragraph),
          completed: child.checked,
          children: others.map(parse).filter((c) => !!c),
        };
      }
    }
  }
};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<TaskList> {
  const fileContents = await vault.cachedRead(file);
  const tasks = parseTasks(fileContents, file);

  const tree = fromMarkdown(fileContents);
  const children = tree.children.map(parse).filter((c) => !!c);

  console.log(file.basename, tree, children);

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
