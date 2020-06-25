import { NodeState } from "../constants/NodeState";

// Initial state of the source and target; this can be modified
export const INITIAL_STATE = {
  sourceRow: 14,
  sourceColumn: 5,
  targetRow: 14,
  targetColumn: 40,
};

// Creates a node given parameters
export const createNode = (row, column, distance, state, isVisited) => {
  return {
    row,
    column,
    distance,
    distanceToDisplay: distance,
    state,
    isVisited,
  };
};

// Generates the initial grid
export const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let column = 0; column < 45; column++) {
      currentRow.push(createNode(row, column, Infinity, NodeState.EMPTY));
    }
    grid.push(currentRow);
  }
  grid[INITIAL_STATE.sourceRow][INITIAL_STATE.sourceColumn] = createNode(
    INITIAL_STATE.sourceRow,
    INITIAL_STATE.sourceColumn,
    0,
    NodeState.SOURCE,
    true
  );
  grid[INITIAL_STATE.targetRow][INITIAL_STATE.targetColumn] = createNode(
    INITIAL_STATE.targetRow,
    INITIAL_STATE.targetColumn,
    Infinity,
    NodeState.TARGET,
    false
  );
  return grid;
};

export const getRandomGrid = () => {
  var numWalls = 0;
  const grid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let column = 0; column < 45; column++) {
      // Approximately half the time, an empty node will be created.
      // A wall will be created the other half.
      if (Math.random() > 0.25) {
        currentRow.push(createNode(row, column, Infinity, NodeState.EMPTY));
      } else {
        currentRow.push(createNode(row, column, Infinity, NodeState.WALL));
        numWalls += 1;
      }
    }
    grid.push(currentRow);
  }

  // Place the source; if we are placing it on a wall, decrement the wall counter
  const sourceRow = randomNumber(0, 29, []);
  const sourceColumn = randomNumber(0, 44, []);
  if (grid[sourceRow][sourceColumn].state === NodeState.WALL) {
    numWalls -= 1;
  }
  grid[sourceRow][sourceColumn] = createNode(
    sourceRow,
    sourceColumn,
    0,
    NodeState.SOURCE,
    true
  );

  // Place the target
  const targetRow = randomNumber(0, 29, [sourceRow]);
  const targetColumn = randomNumber(0, 44, [sourceColumn]);
  if (grid[targetRow][targetColumn].state === NodeState.WALL) {
    numWalls -= 1;
  }
  grid[targetRow][targetColumn] = createNode(
    targetRow,
    targetColumn,
    Infinity,
    NodeState.TARGET,
    false
  );

  const currentTarget = { row: targetRow, column: targetColumn };

  return { grid, numWalls, currentTarget };
};

// Generates a random integer, inclusive
// Exclude is an array that specifies what numbers we should not include in the range of possibility.
const randomNumber = (lower, upper, exclude) => {
  var candidate = Math.floor(Math.random() * (upper - lower + 1)) + lower;
  while (exclude.includes(candidate)) {
    // If the generated number falls within the exclude range, generate another one
    candidate = Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }
  return candidate;
};
