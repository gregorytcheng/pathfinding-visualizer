// Dijkstra's algorithm is a weighted algorithm that returns the shortest path.
// It generates a shortest path tree with the given node as the root. As the algorithm runs,
// It keeps track of two things:
// 1) Vertices included in this shortest path tree (visted nodes)
// 2) Vertices not included in the shortest path tree (unvisited nodes)
// In each step of the algorithm, we find a vertex within the 2nd (unvisited) set and has the shortest
// distance from the source. We then update the distance value.
// In doing this, we keep track of the previous node that led us a a given node. Once the
// algorithm completes, this 'previousNode' field gives us the path from the source to the target.

import { NodeState } from "../constants/NodeState";

export const getVisitedNodes = (grid) => {
  // Create a deep copy fo the grid
  const newGrid = [];
  for (let row = 0; row < 30; row++) {
    const currentRow = [];
    for (let column = 0; column < 45; column++) {
      currentRow.push(Object.assign(grid[row][column]));
    }
    newGrid.push(currentRow);
  }

  const visitedNodes = [];
  const unvisitedNodes = flattenGrid(newGrid);

  // Keep iterating through this loop as long as nodes exist that are not visited
  while (!!unvisitedNodes.length) {
    sortByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // Skipping all walls
    if (!closestNode || closestNode.state === NodeState.WALL) continue;

    // If the closest node has a distance of Infinity, we have reached a trap
    if (closestNode.distance === Infinity) return visitedNodes;

    // If we have reached the target, return the visited nodes
    if (closestNode.state === NodeState.TARGET) return visitedNodes;

    closestNode.isVisited = true;
    visitedNodes.push(closestNode);

    // Before going to the next iteration of the loop, we must update distances.
    updateUnvisitedDistances(closestNode, newGrid);
  }

  return [];
};

const updateUnvisitedDistances = (closestNode, grid) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
  for (const unvisitedNeighbor of unvisitedNeighbors) {
    unvisitedNeighbor.distance = closestNode.distance + 1;
    unvisitedNeighbor.previousNode = closestNode;
  }
};

// Given a node, retrieve all unvisited neighbors to update their distance.
const getUnvisitedNeighbors = (closestNode, grid) => {
  const unvisitedNeighbors = [];

  const { row, column } = closestNode;

  if (closestNode.column > 0) unvisitedNeighbors.push(grid[row][column - 1]);
  if (closestNode.row > 0) unvisitedNeighbors.push(grid[row - 1][column]);

  if (closestNode.column < grid[0].length - 1)
    unvisitedNeighbors.push(grid[row][column + 1]);
  if (closestNode.row < grid.length - 1)
    unvisitedNeighbors.push(grid[row + 1][column]);

  return unvisitedNeighbors.filter((node) => !node.isVisited);
};

// Sort a list of nodes distance given a comparator.
const sortByDistance = (nodes) => {
  return nodes.sort((a, b) => a.distance - b.distance);
};

// Given a grid, return a single array containing all nodes.
const flattenGrid = (grid) => {
  const results = [];
  grid.forEach((row) => {
    row.forEach((node) => results.push(node));
  });
  return results;
};

export const getShortestPath = (finishNode) => {
  const shortestPath = [];
  var currentNode = finishNode;
  while (currentNode != null) {
    shortestPath.unshift(currentNode);
    //currentNode.state = NodeState.SHOREST_PATH;
    currentNode = currentNode.previousNode;
  }
  return shortestPath;
};
