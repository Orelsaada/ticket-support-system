import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import UserIncidents from "./UserIncidents";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Login</Link> <br></br>
        <Link to="/my-incidents">My Incidents</Link>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <AuthProvider>
                <LoginPage />
              </AuthProvider>
            )}
          ></Route>

          <Route
            path="/my-incidents"
            render={() => (
              <AuthProvider>
                <UserIncidents />
              </AuthProvider>
            )}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
