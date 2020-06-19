import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import UserIncidents from "./UserIncidents";
import NewIncident from "./newIncident";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Login</Link> {" --- "}
        <Link to="/my-incidents">My Incidents</Link> {" --- "}
        <Link to="/my-incidents/new">New incident</Link> {" --- "}
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
            exact
            render={() => (
              <AuthProvider>
                <UserIncidents />
              </AuthProvider>
            )}
          ></Route>
          <Route
            path="/my-incidents/new"
            exact
            render={() => (
              <AuthProvider>
                <NewIncident />
              </AuthProvider>
            )}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
