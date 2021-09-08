import React, { useState, useEffect, useCallback } from "react";
import { Project } from "./project";
import { Project as ProjectType } from "../task-vault/types";

export const TaskLeaf = ({ vaultTasks, openFile }: any) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    vaultTasks.on("initialized", async () => {
      const projects = await vaultTasks.getProjects();
      setProjects(projects);
    });

    vaultTasks.on("update", async () => {
      const projects = await vaultTasks.getProjects();
      setProjects(projects);
    });
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

  return <div>{renderProjects()}</div>;
};
