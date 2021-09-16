import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ProjectPanel } from "./project-panel";
import { NavHeader } from "./nav-header";
import { NavAction } from "./nav-action";
import { Project as ProjectType, Task } from "../task-vault/types";

const Panel = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 0 10px;
`;

enum Actions {
  PROJECTS = "PROJECTS",
  TASKS = "TASKS",
}

const identity = (f: any): any => f;
const incomplete = (item: ProjectType | Task) => !item.completed;
const mostRecentlyUpdated = (a: ProjectType, b: ProjectType) => {
  return b.modifiedAt - a.modifiedAt;
};

export const TaskLeaf = ({ vaultTasks, openFile }: any) => {
  const [selectedAction, setSelectedAction] = useState<Actions>(
    Actions.PROJECTS
  );

  const renderPanel = useCallback(() => {
    switch (selectedAction) {
      case Actions.PROJECTS: {
        return <ProjectPanel vaultTasks={vaultTasks} openFile={openFile} />;
      }

      case Actions.TASKS: {
        return <ProjectPanel vaultTasks={vaultTasks} openFile={openFile} />;
      }
    }
  }, [selectedAction]);

  return (
    <>
      <NavHeader>
        <NavAction
          label="Project view"
          icon="bullet-list"
          isActive={selectedAction === Actions.PROJECTS}
          onClick={() => setSelectedAction(Actions.PROJECTS)}
        />
        <NavAction
          label="Task view"
          icon="check-in-circle"
          isActive={selectedAction === Actions.TASKS}
          onClick={() => setSelectedAction(Actions.TASKS)}
        />
      </NavHeader>
      <Panel>{renderPanel()}</Panel>
    </>
  );
};
