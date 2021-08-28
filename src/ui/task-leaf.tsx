import React, { useState, useEffect, useCallback } from "react";
import { Project } from "./project";

export const TaskLeaf = ({ vaultTasks }: any) => {
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
        .filter((project) => project.completed)
        .map((project) => {
          return (
            <Project
              key={project.path}
              project={project}
              vaultTasks={vaultTasks}
            />
          );
        }),
    [projects]
  );

  return <div>{renderProjects()}</div>;
};
