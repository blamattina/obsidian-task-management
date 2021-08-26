import React, { useCallback } from "react";
import { TaskList as TaskListType, VaultTasks } from "../vault-tasks";
import { Task } from "./task";

export const TaskList = ({
  taskList,
  vaultTasks,
}: {
  taskList: TaskListType;
  vaultTasks: VaultTasks;
}) => {
  const renderTasks = useCallback(
    () =>
      taskList.tasks.map((task) => (
        <Task
          key={task.description}
          task={task}
          onCheckboxClick={() => {
            vaultTasks.toggleTaskStatus(task);
          }}
        />
      )),
    [taskList]
  );

  return (
    <div>
      <h3>{taskList.basename}</h3>
      {renderTasks()}
    </div>
  );
};
