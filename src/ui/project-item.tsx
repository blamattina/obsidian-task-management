import React, { useCallback } from "react";
import styled from "styled-components";
import {
  ProjectItem as ProjectItemType,
  VaultTasks,
  isHeading,
  isTask,
} from "../vault-tasks";
import { Task } from "./Task";
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
  vaultTasks: VaultTasks;
}) => {
  const renderChild = useCallback(() => {
    if (isHeading(item)) {
      return (
        <Heading key={item.name}>
          <RenderedMarkdown markdown={item.name} />
        </Heading>
      );
    }

    if (isTask(item)) {
      return (
        <Task key={item.description} task={item} vaultTasks={vaultTasks}>
          {item.children.map((child: ProjectItemType) => (
            <ProjectItem item={child} vaultTasks={vaultTasks} />
          ))}
        </Task>
      );
    }

    return (
      <>
        {item.children.map((child: ProjectItemType) => (
          <ProjectItem item={child} vaultTasks={vaultTasks} />
        ))}
      </>
    );
  }, [item]);

  return <div>{renderChild()}</div>;
};
