import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ProjectPanel } from "./project-panel";
import { TaskPanel } from "./task-panel";
import { NavHeader } from "./nav-header";
import { NavAction } from "./nav-action";
import { Project as ProjectType } from "../task-vault/types";

const Panel = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 0 10px;
`;

enum Actions {
  INCOMPLETE_PROJECTS = "INCOMPLETE_PROJECTS",
  INCOMPLETE_TASKS = "INCOMPLETE_TASKS",
}

export const TaskLeaf = ({ vaultTasks, openFile }: any) => {
  const [selectedAction, setSelectedAction] = useState<Actions>(
    Actions.INCOMPLETE_PROJECTS
  );

  const renderPanel = useCallback(() => {
    switch (selectedAction) {
      case Actions.INCOMPLETE_PROJECTS: {
        return <ProjectPanel vaultTasks={vaultTasks} openFile={openFile} />;
      }

      case Actions.INCOMPLETE_TASKS: {
        return <TaskPanel vaultTasks={vaultTasks} openFile={openFile} />;
      }
    }
  }, [selectedAction]);

  return (
    <>
      <NavHeader>
        <NavAction
          label="Incomplete Projects"
          icon="bullet-list"
          isActive={selectedAction === Actions.INCOMPLETE_PROJECTS}
          onClick={() => setSelectedAction(Actions.INCOMPLETE_PROJECTS)}
        />
        <NavAction
          label="Incomplete Tasks"
          icon="check-in-circle"
          isActive={selectedAction === Actions.INCOMPLETE_TASKS}
          onClick={() => setSelectedAction(Actions.INCOMPLETE_TASKS)}
        />
      </NavHeader>
      <Panel>{renderPanel()}</Panel>
    </>
  );
};
