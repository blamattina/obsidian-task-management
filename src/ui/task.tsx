import React, { useCallback } from "react";
import styled from "styled-components";
import { Task as TaskType } from "../vault-tasks";
import { TaskDescription } from "./task-description";

const StyledTask = styled.div`
  display: flex;
  align-items: baseline;
  padding: 0;
`;

export const Task = ({ task }: { task: TaskType }) => {
  return (
    <StyledTask
      style={{ display: "flex", alignItems: "baseline" }}
      className="markdown-preview-view"
    >
      <div>
        <input
          type="checkbox"
          checked={task.completed}
          className="task-list-item-checkbox"
        />
      </div>
      <TaskDescription description={task.description} />
    </StyledTask>
  );
};
