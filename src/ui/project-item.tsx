import React, { useCallback } from "react";
import styled from "styled-components";
import {
  Heading as HeadingType,
  List as ListType,
  Task as TaskType,
  VaultTasks,
  isHeading,
  isList,
} from "../vault-tasks";
import { Task } from "./Task";
import { RenderedMarkdown } from "./rendered-markdown";

const Heading = styled.h4`
  margin: 6px 0;
`;

export const ProjectItem = ({
  item,
  vaultTasks,
}: {
  item: HeadingType | TaskType;
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
        {item.children.map((child: TaskType | HeadingType) => (
          <ProjectItem item={child} vaultTasks={vaultTasks} />
        ))}
      </Task>
    );
  }, [item]);

  return <div>{renderChild()}</div>;
};
