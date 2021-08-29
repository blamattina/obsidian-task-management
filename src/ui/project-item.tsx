import React, { useCallback } from "react";
import styled from "styled-components";
import {
  ProjectItem as ProjectItemType,
  VaultTasks,
  isHeading,
} from "../vault-tasks";
import { Task } from "./Task";
import { RenderedMarkdown } from "./rendered-markdown";

const Heading = styled.h5`
  color: var(--text-muted);
  margin: 6px 0;
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

    return (
      <Task key={item.description} task={item} vaultTasks={vaultTasks}>
        {item.children.map((child: ProjectItemType) => (
          <ProjectItem item={child} vaultTasks={vaultTasks} />
        ))}
      </Task>
    );
  }, [item]);

  return <div>{renderChild()}</div>;
};
