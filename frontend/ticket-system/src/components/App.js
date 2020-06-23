import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import UserIncidents from "./UserIncidents";
import NewIncident from "./newIncident";
import CustomNavbar from "./Navbar";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <CustomNavbar />
          <Switch>
            <Route path="/" exact render={() => <LoginPage />}></Route>

            <Route
              path="/my-incidents"
              exact
              render={() => <UserIncidents />}
            ></Route>
            <Route
              path="/my-incidents/new"
              exact
              render={() => <NewIncident />}
            ></Route>
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
