import React from "react";
import "./Node.css";

const Node = ({ node, handleClick }) => {
  const { row, column, distanceToDisplay, state } = node;
  return (
    <div className={`node ${state}`} onClick={() => handleClick(row, column)}>
      {distanceToDisplay === Infinity ? "?" : distanceToDisplay}
    </div>
  );
};

export default Node;
