import React from "react";
import "./Node.css";

const Node = ({ node }) => {
  const { distance, state } = node;
  return (
    <div className={`node ${state}`}>
      {distance === Infinity ? "?" : distance}
    </div>
  );
};

export default Node;
