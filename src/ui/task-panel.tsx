import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ProjectItem } from "./project-item";
import { Toggle } from "./toggle";
import { Task as TaskType } from "../task-vault";

const Option = styled.div`
  font-size: 12px;
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
`;

const identity = (f: any): any => f;
const incomplete = (item: TaskType | Task) => !item.completed;
const mostRecentlyUpdated = (a: TaskType, b: TaskType) => {
  return b.modifiedAt - a.modifiedAt;
};

export const TaskPanel = ({ vaultTasks, openFile }: any) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

  const getTasks = useCallback(() => {
    const get = async () => {
      const tasks = await vaultTasks.getTasks({
        taskPredicate: showCompletedTasks ? identity : incomplete,
      });
      setTasks(tasks);
    };

    get();
  }, [vaultTasks, showCompletedTasks]);

  useEffect(() => {
    vaultTasks.on("initialized", getTasks);
    vaultTasks.on("update", getTasks);
    getTasks();

    return () => {
      vaultTasks.off("initialized", getTasks);
      vaultTasks.off("update", getTasks);
    };
  }, [vaultTasks, getTasks]);

  const renderTasks = useCallback(
    () =>
      tasks.map((task: TaskType) => (
        <ProjectItem key={task.id} item={task} vaultTasks={vaultTasks} />
      )),
    [tasks]
  );

  return (
    <>
      <Option>
        Show completed tasks
        <Toggle
          enabled={showCompletedTasks}
          onClick={() => setShowCompletedTasks((show) => !show)}
        />
      </Option>
      {renderTasks()}
    </>
  );
};
