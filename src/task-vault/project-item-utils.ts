import {
  Project,
  ProjectItem,
  StoredProjectItem,
  Relationship,
  isHeading,
  isTask,
} from "./types";
import { request } from "./db-utils";

export const createProjectItem = (
  transaction: IDBTransaction,
  project: Project
) => async (item: ProjectItem): Promise<Relationship> => {
  const type = isHeading(item) ? "headings" : "tasks";
  if ("children" in item) {
    item.children = await Promise.all(
      item.children.map(createProjectItem(transaction, project))
    );
  }

  const store = transaction.objectStore(type);
  const id = await request<number>(
    store.put({
      ...item,
      type,
      createdAt: project.createdAt,
      modifiedAt: project.modifiedAt,
    })
  );
  return [type, id];
};

export const readProjectItem = (transaction: IDBTransaction) => async (
  locator: any
): Promise<ProjectItem> => {
  const [type, id] = locator;
  const store = transaction.objectStore(type);
  const item = (await request(store.get(id))) as ProjectItem;
  if ("children" in item) {
    item.children = await Promise.all(
      item.children.map(readProjectItem(transaction))
    );
  }

  return item;
};

export const deleteProjectItem = (transaction: IDBTransaction) => async (
  locator: any
): Promise<void> => {
  const [type, id] = locator;
  const store = transaction.objectStore(type);
  const item = (await request(store.get(id))) as ProjectItem;

  if ("children" in item) {
    await Promise.all(item.children.map(deleteProjectItem(transaction)));
  }

  await request(store.delete(id));
};

const pruneHeading = (item: ProjectItem, nextItem: ProjectItem) => {
  if (!isHeading(item)) return false;
  if (!nextItem) return true;
  if (isHeading(nextItem)) return true;
  return false;
};

export const pruneTasks = (taskPredicate: Function) => (
  acc: ProjectItem[],
  item: ProjectItem
): ProjectItem[] => {
  if (isTask(item)) {
    item.children = item.children.reduceRight(pruneTasks(taskPredicate), []);
  }

  if (isTask(item) && !taskPredicate(item)) {
    return item.children.concat(acc);
  }

  if (pruneHeading(item, acc[0])) return acc;

  acc.unshift(item);
  return acc;
};
