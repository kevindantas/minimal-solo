import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Entrance from "./views/Entrance";
import NameSelect from "./views/NameSelect";
import GameRoom from "./views/GameRoom";
import Lobby from "./views/Lobby";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Entrance} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/room/:id" component={GameRoom} />
      </Switch>
    </Router>
  );
}

export default App;
