import React from "react";
import "./Node.css";

const Node = ({ node }) => {
  const { distanceToDisplay, state } = node;
  return (
    <div className={`node ${state}`}>
      {distanceToDisplay === Infinity ? "?" : distanceToDisplay}
    </div>
  );
};

export default Node;
