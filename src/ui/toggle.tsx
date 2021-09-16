import React, { useState, useEffect, useCallback } from "react";

export const Toggle = ({ enabled, onClick }) => {
  const classes = `checkbox-container ${enabled ? "is-enabled" : ""}`;
  return <div className={classes} onClick={onClick} />;
};
