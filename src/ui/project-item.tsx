import React, { useCallback } from "react";
import styled from "styled-components";
import {
  ProjectItem as ProjectItemType,
  TaskVault,
  isHeading,
  isTask,
} from "../task-vault";
import { Task } from "./task";
import { RenderedMarkdown } from "./rendered-markdown";

const Heading = styled.div`
  font-size: 12px;
  margin: 6px 0;
  color: var(--text-normal) !important;

  .internal-link {
    color: var(--text-normal) !important;

    &:hover {
      text-decoration: underline !important;
    }
  }
`;

export const ProjectItem = ({
  item,
  vaultTasks,
}: {
  item: ProjectItemType;
  vaultTasks: TaskVault;
}) => {
  const renderChild = useCallback(() => {
    if (isHeading(item)) {
      return (
        <Heading key={`${item.type}-${item.id}`}>
          <RenderedMarkdown markdown={item.name} />
        </Heading>
      );
    }

    return (
      <Task key={`${item.type}-${item.id}`} task={item} vaultTasks={vaultTasks}>
        {item.children.map((child: ProjectItemType) => (
          <ProjectItem
            key={`project-item-for-${child.type}-${child.id}`}
            item={child}
            vaultTasks={vaultTasks}
          />
        ))}
      </Task>
    );
  }, [item]);

  return <div>{renderChild()}</div>;
};
