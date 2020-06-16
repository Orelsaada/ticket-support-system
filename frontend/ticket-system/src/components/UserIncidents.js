import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import "./componentsStyles/UserIncidents.css";
import { AuthContext } from "./AuthContext";

function UserIncidents() {
  const [incidents, setIncidents] = useState(["1", "2"]);
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  console.log(isAuthenticated);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  return (
    <section className="user-incidents">
      <h2> My incidents </h2>
      {incidents.map((incident) => (
        <li key={incidents.indexOf(incident)}>{incident}</li>
      ))}
    </section>
  );
}

export default UserIncidents;
