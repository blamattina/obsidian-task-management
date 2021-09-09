import React from "react";

export const NavHeader = ({ children }: any) => {
  return (
    <div className="nav-header">
      <div className="nav-buttons-container">{children}</div>
    </div>
  );
};
