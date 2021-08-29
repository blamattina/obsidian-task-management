import React, { useCallback } from "react";
import styled from "styled-components";
import { Project as ProjectType, VaultTasks, isHeading } from "../vault-tasks";
import { ProjectItem } from "./project-item";
import { RenderedMarkdown } from "./rendered-markdown";

const Heading = styled.h4`
  color: var(--text-normal);
  margin: 6px 0;
`;

export const Project = ({
  project,
  vaultTasks,
}: {
  project: ProjectType;
  vaultTasks: VaultTasks;
}) => {
  const renderChildren = useCallback(
    () =>
      project.children.map((child) => (
        <ProjectItem item={child} vaultTasks={vaultTasks} />
      )),
    [project]
  );

  return (
    <div>
      <Heading>{project.basename}</Heading>
      {renderChildren()}
    </div>
  );
};
