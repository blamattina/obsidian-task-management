import { ProjectItem, isHeading, isTask } from "./types";
import { request } from "./db-utils";

export const createProjectItem = (transaction) => async (item) => {
  const type = isHeading(item) ? "headings" : "tasks";
  if (item.children) {
    item.children = await Promise.all(
      item.children.map(createProjectItem(transaction))
    );
  }

  const store = transaction.objectStore(type);
  const id = await request(store.put({ ...item, type }));
  return [type, id];
};

export const readProjectItem = (transaction, taskPredicate) => async (
  locator: any
): Promise<ProjectItem> => {
  const [type, id] = locator;
  const store = transaction.objectStore(type);
  const item = (await request(store.get(id))) as ProjectItem;
  if ("children" in item) {
    item.children = await Promise.all(
      item.children.map(readProjectItem(transaction, taskPredicate))
    );
  }

  return item;
};

export const deleteProjectItem = (transaction) => async (
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
