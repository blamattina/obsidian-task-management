import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Project } from "./project";
import { NavHeader } from "./nav-header";
import { NavAction } from "./nav-action";
import { Project as ProjectType, ProjectQuery } from "../task-vault/types";

const Panel = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 0 10px;
`;

enum Actions {
  INCOMPLETE_PROJECTS,
}

export const TaskLeaf = ({ vaultTasks, openFile }: any) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedAction, setSelectedAction] = useState<Actions>(
    Actions.INCOMPLETE_PROJECTS
  );

  const getProjects = useCallback(async () => {
    const projects = await vaultTasks.getProjects();
    setProjects(projects);
  }, [selectedAction, vaultTasks]);

  useEffect(() => {
    vaultTasks.on("initialized", getProjects);
    vaultTasks.on("update", getProjects);

    return () => {
      vaultTasks.off("initialized", getProjects);
      vaultTasks.off("update", getProjects);
    };
  }, [vaultTasks]);

  const renderProjects = useCallback(
    () =>
      projects.map((project: ProjectType) => {
        return (
          <Project
            key={project.path}
            project={project}
            vaultTasks={vaultTasks}
            openFile={openFile}
          />
        );
      }),
    [projects]
  );

  return (
    <>
      <NavHeader>
        <NavAction
          label="Incomplete Projects"
          icon="bullet-list"
          isActive={selectedAction === Actions.INCOMPLETE_PROJECTS}
          onClick={() => setSelectedAction(Actions.INCOMPLETE_PROJECTS)}
        />
      </NavHeader>
      <Panel>{renderProjects()}</Panel>
    </>
  );
};
