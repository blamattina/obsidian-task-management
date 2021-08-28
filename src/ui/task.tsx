import React, { useCallback } from "react";
import styled from "styled-components";
import { Task as TaskType } from "../vault-tasks";
import { RenderedMarkdown } from "./rendered-markdown";

const StyledTask = styled.div`
  display: flex;
  align-items: baseline;
  padding: 0;
`;

const Indent = styled.div`
  padding-left: 25px;
`;

export const Task = ({
  task,
  children,
  onCheckboxClick,
}: {
  task: TaskType;
  children: any;
  onCheckboxClick: Function;
}) => {
  return (
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
            readOnly
          />
        </div>
        <RenderedMarkdown markdown={task.description} />
      </StyledTask>
      <Indent>{children}</Indent>
    </>
  );
};
