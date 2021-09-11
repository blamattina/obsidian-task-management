import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Project } from "./project";
import { Project as ProjectType } from "../task-vault";

export const ProjectPanel = ({ vaultTasks, openFile, query }: any) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const getProjects = useCallback(() => {
    const get = async () => {
      const projects = await vaultTasks.getProjects(query);
      setProjects(projects);
    };

    get();
  }, [vaultTasks, query]);

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

  return <>{renderProjects()}</>;
};
