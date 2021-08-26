import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MarkdownRenderer } from "obsidian";
import { Task as TaskType } from "../vault-tasks";

const StyledDescription = styled.div`
  p {
    margin: 1px 2px;
  }
`;

export const TaskDescription = ({ description }: { description: string }) => {
  const descriptionEl = useRef(null);

  useEffect(() => {
    MarkdownRenderer.renderMarkdown(description, descriptionEl.current);
  }, [description, descriptionEl]);

  return <StyledDescription ref={descriptionEl} />;
};
