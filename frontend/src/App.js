import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GamePage from "./pages/GamePage";
import PlayPage from "./pages/PlayPage";
import VerificationPage from "./pages/VerificationPage";
import EmailPage from "./pages/EmailPage";
import PasswordPage from "./pages/PasswordPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/main">
          <MainPage />
        </Route>
        <Route exact path="/leaderboard">
          <LeaderboardPage />
        </Route>
        <Route exact path="/game">
          <GamePage />
        </Route>
        <Route exact path="/play">
          <PlayPage />
        </Route>
        <Route exact path="/verification">
          <VerificationPage />
        </Route>
        <Route exact path="/email">
          <EmailPage />
        </Route>
        <Route exact path="/password">
          <PasswordPage />
        </Route>
        <Route exact path="/user">
          <UserPage />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
