import axios from "axios";

const endpoint = "http://127.0.0.1:5000/";

export const createNewViz = (
  grid,
  currentTarget,
  timeToComplete,
  numWalls,
  nodesVisited,
  shortestPath
) => {
  // Filtering the properties we want from the grid to pass to the database
  const modifiedGrid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let column = 0; column < 45; column++) {
      const currentNode = grid[row][column];
      currentRow.push({
        row: currentNode.row,
        column: currentNode.column,
        state: currentNode.state,
      });
    }
    modifiedGrid.push(currentRow);
  }

  try {
    const request = {
      grid: modifiedGrid,
      currentTarget,
      timeToComplete,
      numWalls,
      nodesVisited,
      shortestPath,
      created: new Date(),
    };

    axios
      .post(`${endpoint}new-visualization`, request)
      .then((response) => console.log(response));
  } catch (e) {
    console.log("big oof");
  }
};
