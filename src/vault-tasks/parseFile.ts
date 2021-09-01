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

const parse = (item: any, file: TFile): ProjectItem => {
  switch (item.type) {
    case "heading": {
      return {
        name: convertNodesToMarkdown(...item.children).trim(),
        depth: item.depth,
        position: item.position as Position,
        file,
      };
    }

    case "list": {
      const children = item.children
        .map((child: any) => parse(child, file))
        .filter(identity);

      if (children.length) {
        return {
          children,
        };
      }
    }

    case "listItem": {
      if (typeof item.checked === "boolean") {
        const [paragraph, ...others] = item.children;
        return {
          description: convertNodesToMarkdown(paragraph).trim(),
          completed: item.checked as boolean,
          children: others.map(parse).filter(identity).flat(),
          position: item.position as Position,
          file,
        };
      }
    }
  }
};

const reducer = (acc: any, item: any, tree: any) => {};

export const parseFile = async function (
  vault: Vault,
  file: TFile
): Promise<Project> {
  const fileContents = await vault.cachedRead(file);

  const ast = fromMarkdown(fileContents);
  const children = ast.children
    .map((child) => parse(child, file))
    .flat()
    .filter(identity)
    .filter((item, index, array) => {
      if (isHeading(item) && index === array.length - 1) return false;
      if (isHeading(item) && isHeading(array[index + 1])) return false;
      return true;
    });

  const completed = children.some(hasIncompleteTasks);
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
