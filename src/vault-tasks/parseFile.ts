import { Vault, TFile } from "obsidian";
import { Project, Heading, List, Task, isHeading } from "./types";
import { fromMarkdown, toMarkdown } from "./tokenizer";

const convertNodesToMarkdown = (...nodes: any) => {
  return toMarkdown({
    type: "root",
    children: nodes,
  });
};

const identity = (arg: any) => arg;

const hasIncompleteTasks = (child: Heading | Task) => {
  if ("completed" in child) return !child.completed;
  if ("children" in child) {
    return child.children.some(hasIncompleteTasks);
  }
};

const parse = (child): Heading | Task => {
  switch (child.type) {
    case "heading": {
      return {
        name: convertNodesToMarkdown(...child.children),
        depth: child.depth,
      };
    }

    case "list": {
      const children = child.children.map(parse).filter(identity);

      if (children.length) {
        return children;
      }
    }

    case "listItem": {
      if (typeof child.checked === "boolean") {
        const [paragraph, ...others] = child.children;
        return {
          description: convertNodesToMarkdown(paragraph),
          completed: child.checked,
          children: others.map(parse).filter(identity).flat(),
        };
      }
    }
  }
};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<Project> {
  const fileContents = await vault.cachedRead(file);

  const tree = fromMarkdown(fileContents);
  const children = tree.children
    .map(parse)
    .filter(identity)
    .filter((item, index, array) => {
      if (isHeading(item) && index === array.length - 1) return false;
      if (isHeading(item) && isHeading(array[index + 1])) return false;
      return true;
    })
    .flat();

  const completed = children.some(hasIncompleteTasks);
  console.log(file.basename, completed);
  return {
    name: file.name,
    basename: file.basename,
    path: file.path,
    createdAt: file.stat.ctime,
    modifiedAt: file.stat.mtime,
    completed: children.some(hasIncompleteTasks),
    children,
    file,
  };
};
