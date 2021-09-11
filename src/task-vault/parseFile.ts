import { Vault, TFile } from "obsidian";
import { Project, ProjectItem, Position, isHeading } from "./types";
import { fromMarkdown, toMarkdown } from "./tokenizer";

const convertNodesToMarkdown = (...nodes: any): string => {
  const markdown = toMarkdown({
    type: "root",
    children: nodes,
  });

  // Replace escaped `\[\[` in bidirectional links
  return markdown.replaceAll("\\[", "[").replaceAll("\\#", "#");
};

const identity = (arg: any) => arg;

const hasIncompleteTasks = (child: ProjectItem): boolean => {
  if ("completed" in child && !child.completed) return true;
  if ("children" in child) {
    return child.children.some(hasIncompleteTasks);
  }

  return false;
};

const parse = (filePath: string) => (
  acc: ProjectItem[],
  item: any
): ProjectItem[] => {
  switch (item.type) {
    case "heading": {
      acc.push({
        name: convertNodesToMarkdown(...item.children).trim(),
        depth: item.depth,
        position: item.position as Position,
        filePath,
      });
      return acc;
    }

    case "listItem": {
      if (typeof item.checked === "boolean") {
        const [paragraph, ...others] = item.children;
        acc.push({
          description: convertNodesToMarkdown(paragraph).trim(),
          completed: item.checked as boolean,
          children: others.reduce(parse(filePath), []),
          position: {
            start: item.position.start,
            end: paragraph.position.end,
          },
          filePath,
        });

        return acc;
      }
    }
    default: {
      if ("children" in item) {
        return acc.concat(item.children.reduce(parse(filePath), []));
      }
      return acc;
    }
  }
};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<Project> {
  const fileContents = await vault.cachedRead(file);

  const ast = fromMarkdown(fileContents);
  const children = ast.children
    .reduce(parse(file.path), [])
    .filter((item, index, array) => {
      if (isHeading(item) && index === array.length - 1) return false;
      if (isHeading(item) && isHeading(array[index + 1])) return false;
      return true;
    });

  return {
    name: file.name,
    basename: file.basename,
    path: file.path,
    createdAt: file.stat.ctime,
    modifiedAt: file.stat.mtime,
    completed: !children.some(hasIncompleteTasks),
    children,
  };
};
