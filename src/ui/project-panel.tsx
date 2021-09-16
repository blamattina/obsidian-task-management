import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Project } from "./project";
import { Toggle } from "./toggle";
import { Project as ProjectType } from "../task-vault";

const Option = styled.div`
  font-size: 12px;
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
`;

const identity = (f: any): any => f;
const incomplete = (item: ProjectType | Task) => !item.completed;
const mostRecentlyUpdated = (a: ProjectType, b: ProjectType) => {
  return b.modifiedAt - a.modifiedAt;
};

export const ProjectPanel = ({ vaultTasks, openFile }: any) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

  const getProjects = useCallback(() => {
    const get = async () => {
      const projects = await vaultTasks.getProjects({
        projectPredicate: showCompletedTasks ? identity : incomplete,
        taskPredicate: showCompletedTasks ? identity : incomplete,
        projectSort: mostRecentlyUpdated,
      });
      setProjects(projects);
    };

    get();
  }, [vaultTasks, showCompletedTasks]);

  useEffect(() => {
    vaultTasks.on("initialized", getProjects);
    vaultTasks.on("update", getProjects);
    getProjects();

    return () => {
      vaultTasks.off("initialized", getProjects);
      vaultTasks.off("update", getProjects);
    };
  }, [vaultTasks, getProjects]);

  const renderProjects = useCallback(
    () =>
      projects.map((project: ProjectType) => (
        <Project
          key={project.path}
          project={project}
          vaultTasks={vaultTasks}
          openFile={openFile}
        />
      )),
    [projects]
  );

  return (
    <>
      <Option>
        Show completed tasks
        <Toggle
          enabled={showCompletedTasks}
          onClick={() => setShowCompletedTasks((show) => !show)}
        />
      </Option>
      {renderProjects()}
    </>
  );
};
