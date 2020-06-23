import React, { useState } from "react";
import {
  Portal,
  Segment,
  Header,
  List,
  Button,
  Loader,
} from "semantic-ui-react";
import moment from "moment";
import { getVisualizations } from "../../services/visualizationService";

const HistoryPortal = ({ disabled, restoreVisualization }) => {
  const [portalOpen, setPortalOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const handleOpenPortal = () => {
    setPortalOpen(true);
    getAllVisualizations();
  };

  const handleClosePortal = () => {
    setPortalOpen(false);
  };

  const getAllVisualizations = () => {
    if (history.length === 0) {
      getVisualizations().then((data) => setHistory(data.results));
    }
  };

  return (
    <Portal
      closeOnTriggerClick
      openOnTriggerClick
      trigger={<Button disabled={disabled}>View History</Button>}
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
