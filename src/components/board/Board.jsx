import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Header,
  Portal,
  Segment,
  List,
} from "semantic-ui-react";
import Node from "../node/Node";
import { NodeState } from "../../constants/NodeState";
import { AnimationState } from "../../constants/AnimationState";
import { getVisitedNodes, getShortestPath } from "../../algorithms/dijkstra";
import {
  createNewViz,
  getVisualizations,
  getVisualization,
} from "../../services/visualizationService";
import moment from "moment";

const INITIAL_STATE = {
  sourceRow: 14,
  sourceColumn: 5,
  targetRow: 14,
  targetColumn: 40,
};

const Board = () => {
  const [grid, setGrid] = useState([[]]);
  const [nodesVisited, setNodesVisited] = useState(0);
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [animationState, setAnimationState] = useState(AnimationState.READY);
  const [sourcePlaced, setSourcePlaced] = useState(true);
  const [targetPlaced, setTargetPlaced] = useState(true);
  const [currentTarget, setCurrentTarget] = useState({
    row: INITIAL_STATE.targetRow,
    column: INITIAL_STATE.targetColumn,
  });
  const [numWalls, setNumWalls] = useState(0);
  const [history, setHistory] = useState([]);

  const TIME_INTERVAL_LENGTH = 100;

  useEffect(() => {
    setGrid(getInitialGrid());
    // eslint-disable-next-line
  }, []);

  const getInitialGrid = () => {
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

  const createNode = (row, column, distance, state, isVisited) => {
    return {
      row,
      column,
      distance,
      distanceToDisplay: distance,
      state,
      isVisited,
    };
  };

  const dijkstra = () => {
    const timeStart = performance.now();
    const visitedNodes = getVisitedNodes(grid);
    const shortestPath = getShortestPath(
      grid[currentTarget.row][currentTarget.column]
    );
    const timeEnd = performance.now();
    setTimeToComplete(timeEnd - timeStart);
    createNewViz(
      grid,
      currentTarget,
      timeEnd - timeStart,
      numWalls,
      visitedNodes.length,
      shortestPath.length
    );

    visitedNodes.forEach((node, index) => {
      // Skipping the first one in order to preserve the style
      if (index !== 0) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            state: NodeState.VISITED,
            distanceToDisplay: node.distance,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
          setNodesVisited((nodesVisited) => nodesVisited + 1);
        }, index * TIME_INTERVAL_LENGTH);
      }
    });

    shortestPath.forEach((node, index) => {
      if (index !== 0 && index !== shortestPath.length - 1) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            distanceToDisplay: node.distance,
            state: NodeState.SHORTEST_PATH,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
        }, visitedNodes.length * TIME_INTERVAL_LENGTH + index * TIME_INTERVAL_LENGTH);
      }
      if (index === shortestPath.length - 1) {
        setTimeout(() => {
          const newGrid = grid.slice();
          const newNode = {
            ...node,
            distanceToDisplay: node.distance,
          };
          newGrid[node.row][node.column] = newNode;
          setGrid(newGrid);
        }, visitedNodes.length * TIME_INTERVAL_LENGTH + (shortestPath.length - 1) * TIME_INTERVAL_LENGTH);
      }
    });

    // set time to complete
    setTimeout(() => {
      setAnimationState(AnimationState.DONE);
    }, visitedNodes.length * TIME_INTERVAL_LENGTH + shortestPath.length * TIME_INTERVAL_LENGTH);
  };

  const reset = () => {
    setGrid(getInitialGrid());
    setAnimationState(AnimationState.READY);
    setNodesVisited(0);
    setTimeToComplete(0);
  };

  const handleClick = (row, column) => {
    // Only handle changes if a visualization is not running
    if (animationState === AnimationState.READY) {
      // If clicking on a source to remove
      if (grid[row][column].state === NodeState.SOURCE) {
        const newGrid = grid.slice();
        const newNode = {
          ...grid[row][column],
          state: NodeState.EMPTY,
          distance: Infinity,
          distanceToDisplay: Infinity,
        };
        newGrid[row][column] = newNode;
        setGrid(newGrid);
        setSourcePlaced(false);
      }

      // If clicking on a target to remove
      else if (grid[row][column].state === NodeState.TARGET) {
        const newGrid = grid.slice();
        const newNode = {
          ...grid[row][column],
          state: NodeState.EMPTY,
          distance: Infinity,
          distanceToDisplay: Infinity,
        };
        newGrid[row][column] = newNode;
        setGrid(newGrid);
        setTargetPlaced(false);
      }

      // If clicking on a wall, empty it
      else if (grid[row][column].state === NodeState.WALL) {
        const newGrid = grid.slice();
        const newNode = {
          ...grid[row][column],
          state: NodeState.EMPTY,
        };
        newGrid[row][column] = newNode;
        setNumWalls((numWalls) => numWalls - 1);
        setGrid(newGrid);
      }

      // If clicking on an empty node or a wall
      else if (grid[row][column].state === NodeState.EMPTY) {
        // If a source doesn't exist, create a new source
        if (!sourcePlaced) {
          const newGrid = grid.slice();
          const newNode = {
            ...grid[row][column],
            state: NodeState.SOURCE,
            distance: 0,
            distanceToDisplay: 0,
          };
          newGrid[row][column] = newNode;
          setGrid(newGrid);
          setSourcePlaced(true);
        }

        // If a target doesn't exist, create a new target
        else if (!targetPlaced) {
          const newGrid = grid.slice();
          const newNode = {
            ...grid[row][column],
            state: NodeState.TARGET,
            distance: Infinity,
            distanceToDisplay: Infinity,
          };
          newGrid[row][column] = newNode;
          setGrid(newGrid);
          setTargetPlaced(true);
          setCurrentTarget({ row, column });
        }

        // Create a wall if we encounter an empty node
        else {
          const newGrid = grid.slice();
          const newNode = {
            ...grid[row][column],
            state: NodeState.WALL,
            distance: Infinity,
            distanceToDisplay: Infinity,
          };
          newGrid[row][column] = newNode;
          setNumWalls((numWalls) => numWalls + 1);
          setGrid(newGrid);
        }
      }
    }
  };

  const handleOpenPortal = () => {
    getAllVisualizations();
  };

  const getAllVisualizations = () => {
    if (history.length === 0) {
      getVisualizations().then((data) => setHistory(data.results));
    }
  };

  const restoreVisualization = (id, numWalls) => {
    getVisualization(id)
      .then((response) => {
        const grid = response.grid;
        const newGrid = [];
        for (let row = 0; row < 30; row++) {
          const currentRow = [];
          for (let column = 0; column < 45; column++) {
            currentRow.push({
              ...grid[row][column],
              distance:
                grid[row][column].state === NodeState.SOURCE ? 0 : Infinity,
              distanceToDisplay:
                grid[row][column].state === NodeState.SOURCE ? 0 : Infinity,
              isVisited: false,
            });
          }
          newGrid.push(currentRow);
        }
        console.log(response);
        setGrid(newGrid);
        setNodesVisited(0);
        setTimeToComplete(0);
        setAnimationState(AnimationState.READY);
        setSourcePlaced(true);
        setTargetPlaced(true);
        setCurrentTarget(response.currentTarget);
        setNumWalls(numWalls);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Button
        onClick={() => {
          setAnimationState(AnimationState.IN_PROGRESS);
          dijkstra();
        }}
        disabled={animationState !== AnimationState.READY}
      >
        Dijkstra
      </Button>
      <Button
        onClick={() => {
          reset();
        }}
        disabled={animationState !== AnimationState.DONE}
      >
        Reset
      </Button>
      <Portal
        closeOnTriggerClick
        openOnTriggerClick
        trigger={
          <Button disabled={animationState === AnimationState.IN_PROGRESS}>
            View History
          </Button>
        }
        onOpen={handleOpenPortal}
        // onClose={handleClosePortal}
      >
        <Segment
          style={{
            left: "40%",
            position: "fixed",
            top: "20%",
            zIndex: 1000,
          }}
        >
          <Header>History</Header>
          {history.map((viz) => {
            return (
              <List key={viz.id}>
                <List.Item>Walls: {viz.numWalls}</List.Item>
                <List.Item>
                  Time to complete: {viz.timeToComplete.toFixed(0)}ms
                </List.Item>
                <List.Item>Nodes Visited: {viz.nodesVisited}</List.Item>
                <List.Item>Created {moment(viz.created).fromNow()}</List.Item>
                <List.Item>
                  <Button
                    onClick={() => {
                      restoreVisualization(viz.id, viz.numWalls);
                    }}
                  >
                    Restore
                  </Button>
                </List.Item>
              </List>
            );
          })}
        </Segment>
      </Portal>
      <Container style={{ paddingTop: "5em" }}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              {row.map((node, nodeIndex) => {
                return (
                  <Node
                    key={nodeIndex}
                    node={node}
                    handleClick={(row, col) => handleClick(row, col)}
                  />
                );
              })}
            </div>
          );
        })}
        <Header> Nodes visited: {nodesVisited}</Header>
        <Header> Time to complete: {timeToComplete.toFixed(0)} ms</Header>
      </Container>
    </>
  );
};

export default Board;
