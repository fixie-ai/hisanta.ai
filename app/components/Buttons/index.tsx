"use client";
import React from "react";
import { EpicButtonProps } from "@/lib/types";

const EpicButton = ({
  children,
  type,
  className,
  disabled,
  onClick,
}: EpicButtonProps) => {
  const buttonType = type || "primary";
  const mappings = {
    primary: {
      front: "bg-Holiday-Green text-white",
      edge: "bg-Holiday-Green-Edge",
      shadow: "Primary-Button-Shadow",
    },
    secondaryGreen: {
      front: "bg-white shadow-Holiday-Green text-Holiday-Green",
      edge: "bg-Holiday-Green",
      shadow: "",
    },
    secondaryRed: {
      front: "bg-white shadow-Holiday-Red text-Holiday-Red",
      edge: "bg-Holiday-Red",
      shadow: "",
    },
  };

  let frontClass = mappings[buttonType].front;
  let edgeClass = mappings[buttonType].edge;
  let shadowClass = mappings[buttonType].shadow;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`pushable ${className}`}
    >
      <span className={`shadow ${shadowClass}`}></span>
      <span className={`edge ${edgeClass}`}></span>
      <span className={`front ${frontClass}`}>{children}</span>
    </button>
  );
};

export default EpicButton;
