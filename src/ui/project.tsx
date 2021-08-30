import React, { useCallback } from "react";
import styled from "styled-components";
import { Project as ProjectType, VaultTasks, isHeading } from "../vault-tasks";
import { ProjectItem } from "./project-item";
import { RenderedMarkdown } from "./rendered-markdown";

const Container = styled.div`
  border-bottom: 1px solid var(--background-secondary-alt);
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const Heading = styled.div`
  color: var(--text-title-h1);
  margin: 6px 0;
`;

export const Project = ({
  project,
  vaultTasks,
  openFile,
}: {
  project: ProjectType;
  vaultTasks: VaultTasks;
  openFile: Funtion;
}) => {
  const renderChildren = useCallback(
    () =>
      project.children.map((child) => (
        <ProjectItem item={child} vaultTasks={vaultTasks} />
      )),
    [project]
  );

  return (
    <Container>
      <Heading onClick={() => openFile(project.file)}>
        {project.basename}
      </Heading>
      <div style={{ marginLeft: 10 }}>{renderChildren()}</div>
    </Container>
  );
};
