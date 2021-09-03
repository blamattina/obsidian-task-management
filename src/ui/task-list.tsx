import React, { useCallback } from "react";
import { TaskList as TaskListType, TaskVault } from "../task-vault";
import { Task } from "./task";

export const TaskList = ({
  taskList,
  vaultTasks,
}: {
  taskList: TaskListType;
  vaultTasks: TaskVault;
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
