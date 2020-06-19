import React from "react";
import { Menu } from "semantic-ui-react";

const Nav = () => {
  return (
    <Menu inverted>
      <Menu.Item>Pathfinding Visualizer</Menu.Item>
      <Menu.Item position="right">Created by Gregory Cheng</Menu.Item>
    </Menu>
  );
};

export default Nav;
