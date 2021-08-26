import React, { useState, useEffect, useCallback } from "react";
import { TaskList } from "./task-list";

export const TaskLeaf = ({ vaultTasks }: any) => {
  const [taskLists, setTaskLists] = useState(vaultTasks.getTasks());

  useEffect(() => {
    vaultTasks.on("initialized", () => {
      setTaskLists(vaultTasks.getTasks());
    });

    vaultTasks.on("update", () => {
      setTaskLists(vaultTasks.getTasks());
    });
  }, [vaultTasks]);

  const renderTaskLists = useCallback(
    () =>
      taskLists
        .filter((taskList) => taskList.completed)
        .map((taskList) => (
          <TaskList
            key={taskList.path}
            taskList={taskList}
            vaultTasks={vaultTasks}
          />
        )),
    [taskLists]
  );

  return <div>{renderTaskLists()}</div>;
};
