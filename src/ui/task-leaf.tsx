import React, { useState, useEffect, useCallback } from "react";
import { Project } from "./project";
import { Project as ProjectType } from "../vault-tasks/types";

export const TaskLeaf = ({ vaultTasks, openFile }: any) => {
  const [projects, setProjects] = useState(vaultTasks.getProjects());

  useEffect(() => {
    vaultTasks.on("initialized", () => {
      setProjects(vaultTasks.getProjects());
    });

    vaultTasks.on("update", () => {
      setProjects(vaultTasks.getProjects());
    });
  }, [vaultTasks]);

  const renderProjects = useCallback(
    () =>
      projects
        .filter((project: ProjectType) => project.completed)
        .map((project: ProjectType) => {
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
