import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import UserIncidents from "./UserIncidents";
import AdminIncidents from "./AdminIncidents";
import AdminPermissions from "./AdminPermissions";
import NewIncident from "./newIncident";
import CustomNavbar from "./Navbar";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <UserProvider>
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

              <Route
                path="/admin-incidents"
                exact
                render={() => <AdminIncidents />}
              ></Route>

              <Route
                path="/permissons"
                exact
                render={() => <AdminPermissions />}
              ></Route>
            </Switch>
          </Router>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
