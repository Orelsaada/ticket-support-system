import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "./componentsStyles/UserIncidents.css";
import { AuthContext } from "./AuthContext";

function UserIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState([]);
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const userId = localStorage.getItem("user-id");
  const token = localStorage.getItem("token");
  // Request once to get username base on user id.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/auth/user",
      data: userId,
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => setUserName(res.data.name))
      .catch((err) => setError(...error, err.data));
  }, []);

  // Request to get the incidents.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/incidents",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => setIncidents(res.data))
      .catch((err) => setError(...error, err.data));
  }, []);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  return (
    <section className="user-incidents">
      <h1>{error}</h1>
      <h1>Hello {userName}</h1>
      <h2> Your incidents </h2>
      {incidents.map((incident, index) => (
        <div key={index} className="incident">
          <li>{incident.title}</li>
          <p>{incident.description}</p>
        </div>
      ))}
    </section>
  );
}

export default UserIncidents;
