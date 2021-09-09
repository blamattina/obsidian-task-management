import React, { useRef, useEffect } from "react";
import { setIcon } from "obsidian";

export const NavAction = ({ label, icon, isActive }: any) => {
  const div = useRef(null);

  useEffect(() => {
    setIcon(div.current, icon, 20);
  }, [div, icon]);

  const classes = `nav-action-button ${isActive ? "is-active" : ""}`;

  return <div className={classes} ref={div} aria-label={label} />;
};
