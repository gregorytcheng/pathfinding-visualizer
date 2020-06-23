import React, { useState } from "react";
import {
  Portal,
  Segment,
  Header,
  List,
  Button,
  Loader,
} from "semantic-ui-react";
import { AnimationState } from "../../constants/AnimationState";
import moment from "moment";

const HistoryPortal = ({
  animationState,
  getAllVisualizations,
  history,
  restoreVisualization,
}) => {
  const [portalOpen, setPortalOpen] = useState(false);

  const handleOpenPortal = () => {
    setPortalOpen(true);
    getAllVisualizations();
  };

  const handleClosePortal = () => {
    setPortalOpen(false);
  };

  return (
    <Portal
      closeOnTriggerClick
      openOnTriggerClick
      trigger={
        <Button disabled={animationState === AnimationState.IN_PROGRESS}>
          View History
        </Button>
      }
      open={portalOpen}
      onOpen={handleOpenPortal}
      onClose={handleClosePortal}
    >
      <Segment
        style={{
          left: "30%",
          position: "fixed",
          top: "15%",
          zIndex: 1000,
        }}
      >
        <Header>History</Header>
        <div style={{ overflow: "scroll", height: "500px", width: "600px" }}>
          <List style={{ margin: "1em" }}>
            {history.length === 0 ? (
              <Loader active />
            ) : (
              history.map((viz) => {
                return (
                  <div key={viz.id} style={{ margin: "1em" }}>
                    <List.Item>Walls: {viz.numWalls}</List.Item>
                    <List.Item>
                      Time to complete: {viz.timeToComplete.toFixed(0)}ms
                    </List.Item>
                    <List.Item>Nodes Visited: {viz.nodesVisited}</List.Item>
                    <List.Item>
                      Created {moment(viz.created).fromNow()}
                    </List.Item>
                    <List.Item>
                      <Button
                        onClick={() => {
                          restoreVisualization(viz.id, viz.numWalls);
                          handleClosePortal();
                        }}
                      >
                        Restore
                      </Button>
                    </List.Item>
                  </div>
                );
              })
            )}
          </List>
        </div>
      </Segment>
    </Portal>
  );
};

export default HistoryPortal;
