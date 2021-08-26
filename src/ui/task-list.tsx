import React, { useCallback } from "react";
import { TaskList as TaskListType } from "../vault-tasks";
import { Task } from "./task";

export const TaskList = ({ taskList }: { taskList: TaskListType }) => {
  const renderTasks = useCallback(
    () => taskList.tasks.map((task) => <Task task={task} />),
    [taskList]
  );

  return (
    <div>
      <h3>{taskList.basename}</h3>
      {renderTasks()}
    </div>
  );
};
