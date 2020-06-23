import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "./componentsStyles/newIncident.css";

function NewIncident() {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [myInputs, setMyInputs] = useState({});
  const [msg, setMsg] = useState("");
  const history = useHistory();

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  const handleChange = (e) => {
    setMyInputs({
      ...myInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user-id");
    const { title, description } = myInputs;
    const incident = { userId, title, description };

    axios({
      method: "post",
      url: "http://localhost:5000/api/incidents/new",
      data: incident,
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
