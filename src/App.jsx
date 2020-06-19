import React from "react";
import "./App.css";
import Nav from "./components/Nav";
import Board from "./components/board/Board";

function App() {
  return (
    <div className="App">
      <Nav />
      <Board />
    </div>
  );
}

export default App;
