import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MarkdownRenderer } from "obsidian";
import { Task as TaskType } from "../task-vault";

const StyledDiv = styled.div`
  p {
    word-break: break-word;
    margin: 1px 2px;
  }
`;

export const RenderedMarkdown = ({ markdown }: { markdown: string }) => {
  const div = useRef(null);

  useEffect(() => {
    MarkdownRenderer.renderMarkdown(markdown, div.current);
  }, [markdown, div]);

  return <StyledDiv ref={div} />;
};
