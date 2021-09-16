import React, { useCallback } from "react";
import styled from "styled-components";
import { Task as TaskType, TaskVault } from "../task-vault";
import { RenderedMarkdown } from "./rendered-markdown";

const StyledTask = styled.div`
  display: flex;
  align-items: baseline;
  padding: 0;
  margin-left: 10px;
`;

const Indent = styled.div`
  margin-left: 25px;
`;

type Props = {
  children?: React.ReactNode;
  task: TaskType;
  vaultTasks: TaskVault;
};

export const Task = ({ children, task, vaultTasks }: Props) => (
  <>
    <StyledTask
      style={{ display: "flex", alignItems: "baseline" }}
      className="markdown-preview-view"
    >
      <div>
        <input
          type="checkbox"
          checked={task.completed}
          className="task-list-item-checkbox"
          onChange={() => vaultTasks.toggleTaskStatus(task)}
        />
      </div>
      <RenderedMarkdown markdown={task.description} />
    </StyledTask>
    <Indent>{children}</Indent>
  </>
);
