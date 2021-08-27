import { fromMarkdown as mdastFromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown as mdastToMarkdown } from "mdast-util-to-markdown";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";
import {
  gfmTaskListItemFromMarkdown,
  gfmTaskListItemToMarkdown,
} from "mdast-util-gfm-task-list-item";

export const fromMarkdown = function (markdown: string) {
  return mdastFromMarkdown(markdown, {
    extensions: [gfmTaskListItem],
    mdastExtensions: [gfmTaskListItemFromMarkdown],
  });
};

export const toMarkdown = function (tree: object) {
  return mdastToMarkdown(tree, { extensions: [gfmTaskListItemToMarkdown] });
};
