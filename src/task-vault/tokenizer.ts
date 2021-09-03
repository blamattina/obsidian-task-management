import { fromMarkdown as mdastFromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown as mdastToMarkdown } from "mdast-util-to-markdown";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";
import { frontmatter } from "micromark-extension-frontmatter";
import {
  gfmTaskListItemFromMarkdown,
  gfmTaskListItemToMarkdown,
} from "mdast-util-gfm-task-list-item";
import {
  frontmatterFromMarkdown,
  frontmatterToMarkdown,
} from "mdast-util-frontmatter";

export const fromMarkdown = function (markdown: string) {
  return mdastFromMarkdown(markdown, {
    extensions: [gfmTaskListItem, frontmatter(["yaml"])],
    mdastExtensions: [
      gfmTaskListItemFromMarkdown,
      frontmatterFromMarkdown(["yaml"]),
    ],
  });
};

export const toMarkdown = function (tree: object) {
  return mdastToMarkdown(tree, {
    extensions: [gfmTaskListItemToMarkdown, frontmatterToMarkdown(["yaml"])],
  });
};
