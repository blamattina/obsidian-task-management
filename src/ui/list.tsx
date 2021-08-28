import React, { useCallback } from "react";
import { List as ListType, VaultTasks } from "../vault-tasks";
import { Task } from "./task";

export const List = ({
  list,
  vaultTasks,
}: {
  list: ListType;
  vaultTasks: VaultTasks;
}) => {
  const renderTasks = useCallback(
    () =>
      list.children.map((task) => (
        <Task
          key={task.description}
          task={task}
          onCheckboxClick={() => {
            vaultTasks.toggleTaskStatus(task);
          }}
        />
      )),
    [list]
  );

  return (
    <div>
      <h3>{list.basename}</h3>
      {renderTasks()}
    </div>
  );
};
