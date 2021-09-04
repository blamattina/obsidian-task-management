import React, { useCallback } from "react";
import styled from "styled-components";
import { Project as ProjectType, TaskVault, isHeading } from "../task-vault";
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
  vaultTasks: TaskVault;
  openFile: Funtion;
}) => {
  const renderChildren = useCallback(() => {
    return project.children.map((child) => (
      <ProjectItem
        key={`project-item-for-${child.type}-${child.id}`}
        item={child}
        vaultTasks={vaultTasks}
      />
    ));
  }, [project]);

  return (
    <Container>
      <Heading onClick={() => openFile(project.path)}>
        {project.basename}
      </Heading>
      <div style={{ marginLeft: 10 }}>{renderChildren()}</div>
    </Container>
  );
};
