import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { UserContext } from "./UserContext";
import "./componentsStyles/newIncident.css";

function NewIncident() {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);
  const [myInputs, setMyInputs] = useState({});
  const history = useHistory();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user-id");
  let newIncident = {};

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  // Handle form changes
  const handleChange = (e) => {
    setMyInputs({
      ...myInputs,
      [e.target.name]: e.target.value,
    });
  };

  // Get sd from backend, Post new incident.
  const handleSubmit = (e) => {
    e.preventDefault();

    const userName = user.name;
    const { title, description } = myInputs;

    // Get SD from DB based on total incidents and create the new incident object.
    axios({
      method: "get",
      url: "/api/incidents/sd",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        newIncident = {
          userId,
          userName,
          title,
          description,
          sd: res.data.totalIncidents + 1,
        };
        createIncident(newIncident);
      })
      .catch((e) => console.log(e));
  };

  // Function that gets call from axios sd response to actually create the new incident at backend.
  const createIncident = (newIncident) => {
    // POST request to the backend to create new incident.
    axios({
      method: "post",
      url: "/api/incidents/new",
      data: newIncident,
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        alert(res.data.msg);
        history.push("/my-incidents");
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="new-incident">
      <div className="container">
        <h1 className="title">Create new incident</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              onChange={handleChange}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="5"
              onChange={handleChange}
            ></textarea>
          </div>
          <input type="submit" className="btn btn-primary"></input>
        </form>
      </div>
    </section>
  );
}

export default NewIncident;
